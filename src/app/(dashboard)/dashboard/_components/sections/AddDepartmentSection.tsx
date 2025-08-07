'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { getRequest, postRequest } from '@/utils/api';
import { usePermissions, PermissionGuard } from '@/utils/permissions';
import { safeLocalStorage } from '@/utils/localStorage';
import DynamicForm, { FormField } from '@/components/forms/DynamicForm';
import { Edit3 } from 'lucide-react';

interface DepartmentFormData {
  name: string;
  description: string;
}

interface FilterState {
  search: string;
  sortBy: string;
  sortOrder: string;
  page: number;
  limit: number;
}

interface Department {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: {
    firstName?: string;
  };
}

const AddDepartmentSection = () => {
  const [departmentData, setDepartmentData] = useState<Department[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Department | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const router = useRouter();
  const { canView, canCreate, canUpdate, canDelete } = usePermissions();
  
  const tokenData = JSON.parse(safeLocalStorage.getItem('tokens') || "{}");
  if (!tokenData.accessToken) {
    toast.error("Please login to continue");
    router.push('/login');
  }

  // Check if user has permission to view departments
  if (!canView('department')) {
    return (
      <div className="p-8 text-center text-gray-500">
        You don't have permission to view departments.
      </div>
    );
  }

  const [formData, setFormData] = useState<DepartmentFormData>({
    name: '',
    description: ''
  });

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'asc',
    page: 1,
    limit: 10
  });

  // Fetch departments on component mount and when filters change
  useEffect(() => {
    fetchDepartments();
  }, [filters]);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: filters.page.toString(),
        limit: filters.limit.toString(),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        ...(filters.search && { search: filters.search }),
      });

      const response = await getRequest(
        `departments/getDepartments?${queryParams}`,
        tokenData.accessToken
      );
      console.log(response, 'response')
      if (response.success) {
        const user = JSON.parse(safeLocalStorage.getItem('user')|| '')
        if(user.role.name === 'superadmin'){
          setDepartmentData(response.data.departments || []);
        }else{
          setDepartmentData(response.data.departments.filter((e:any)=>e.name !== 'Administration') || []);
        }
      } else {
        // toast.error(response.message || "Failed to fetch departments");
      }
    } catch (error: any) {
      //  toast.error(error.message || "Failed to fetch departments");
    } finally {
      setLoading(false);
    }
  };

  const getOrganizationId = async () => {
    const user = safeLocalStorage.getItem('user');
    const userData = JSON.parse(user || "{}");
    console.log(userData.organization, 'organisation id')
    return userData.organization;
  }


  const handleEdit = (department: Department) => {
    setEditingItem(department);
    setFormData({
      name: department.name,
      description: department.description || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (departmentId: string) => {
    if (!confirm("Are you sure you want to delete this department?")) {
      return;
    }

    try {
      const response = await postRequest(
        `departments/deleteDepartment/${departmentId}`,
        {},
        "Department deleted successfully",
        tokenData.accessToken,
        "delete"
      );
      
      if (response.success) {
        // toast.success("Department deleted successfully");
        fetchDepartments();
      }
    } catch (error: any) {
      // toast.error(error.message || "Failed to delete department");
      console.log(error, 'error')
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setEditingItem(null);
    setShowForm(false);
  };



  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  // Form fields configuration
  const departmentFormFields: FormField[] = [
    {
      name: 'name',
      label: 'Department Name',
      type: 'text',
      required: true,
      placeholder: 'Enter department name'
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Enter department description',
      rows: 3
    }
  ];
  useEffect(() => {
    if (showForm) {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [showForm]);

  const handleFormSubmit = async (data: any) => {
    setSubmitting(true);
    try {
      const departmentData = {
        ...data,
        // organizationId: await getOrganizationId()
      };

      const response = await postRequest(
        editingItem ? `departments/updateDepartment/${editingItem._id}` : "departments/addDepartment",
        departmentData,
        editingItem ? "Department updated successfully" : "Department created successfully",
        tokenData.accessToken,
        editingItem ? "put" : "post"
      );
      
      if (response.success) {
        toast.success(editingItem ? "Department updated successfully" : "Department created successfully");
        resetForm();
        fetchDepartments();
      }
    } catch (error: any) {
      // toast.error(error.message || (editingItem ? "Failed to update department" : "Failed to create department"));
      console.log(error, 'error')
    } finally {
      setSubmitting(false);
    }
  };;

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDepartments(departmentData.map(dept => dept._id));
    } else {
      setSelectedDepartments([]);
    }
  };

  const handleSelectDepartment = (departmentId: string, checked: boolean) => {
    if (checked) {
      setSelectedDepartments(prev => [...prev, departmentId]);
    } else {
      setSelectedDepartments(prev => prev.filter(id => id !== departmentId));
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedDepartments.length} selected departments?`)) {
      return;
    }

    try {
      const deletePromises = selectedDepartments.map(departmentId => 
        postRequest(
          `departments/deleteDepartments/${departmentId}`,
          {},
          "Department Deleted Successfully",
          tokenData.accessToken,
          "delete"
        )
      );

      await Promise.all(deletePromises);
      toast.success(`${selectedDepartments.length} departments deleted successfully`);
      setSelectedDepartments([]);
      fetchDepartments();
    } catch (error: any) {
      // toast.error(error.message || "Failed to delete some departments");
      console.log(error, 'error')
    }
  };


  return (
    <div className='flex flex-col gap-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold text-gray-800'>Department Management</h1>
        <PermissionGuard permission="department.create">
          <button
            onClick={() => setShowForm(true)}
            className='bg-[#0D5942] text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2'
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Department
          </button>
        </PermissionGuard>
      </div>

      {/* Search and Filter Section */}
      <div className='bg-white p-4 w-1/2 rounded-lg shadow-sm border border-gray-200'>
        <div className='flex flex-col md:flex-row gap-4'>
          <div className='flex-1'>
            <input
              type='text'
              placeholder='Search departments...'
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500'
            />
          </div>
          <div className='flex gap-2'>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
              className='px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500'
            >
              <option value="createdAt">Created Date</option>
              <option value="name">Name</option>
            </select>
            <select
              value={filters.sortOrder}
              onChange={(e) => setFilters(prev => ({ ...prev, sortOrder: e.target.value }))}
              className='px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500'
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Form Section */}


      {/* Bulk Actions */}
      {selectedDepartments.length > 0 && (
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <span className='text-sm font-medium text-blue-900'>
                {selectedDepartments.length} department{selectedDepartments.length > 1 ? 's' : ''} selected
              </span>
            </div>
            <div className='flex gap-2'>
              {/* <PermissionGuard permission="department.delete">
                <button
                  onClick={handleBulkDelete}
                  className='bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm transition-colors duration-200'
                >
                  Delete Selected
                </button>
              </PermissionGuard> */}
              <button
                onClick={() => setSelectedDepartments([])}
                className='bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-md text-sm transition-colors duration-200'
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Departments List */}
      <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
        <div className='px-6 py-4 border-b border-gray-200'>
          <h3 className='text-lg font-semibold text-gray-800'>Departments</h3>
        </div>
        
        {loading ? (
          <div className='p-8 text-center'>
            <svg className="animate-spin h-8 w-8 mx-auto text-green-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className='mt-2 text-gray-600'>Loading departments...</p>
          </div>
        ) : departmentData.length === 0 ? (
          <div className='p-8 text-center'>
            <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <p className='mt-2 text-gray-600'>No departments found</p>
            <button
              onClick={() => setShowForm(true)}
              className='mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors duration-200'
            >
              Add your first department
            </button>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    <input
                      type="checkbox"
                      checked={selectedDepartments.length === departmentData.length && departmentData.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    ID
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Department Name
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Description
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Created At
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Created By
                  </th>
                 
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {departmentData.map((department,i) => (
                  <tr key={department._id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <input
                        type="checkbox"
                        checked={selectedDepartments.includes(department._id)}
                        onChange={(e) => handleSelectDepartment(department._id, e.target.checked)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm font-medium text-gray-900'>DP-{i+1}</div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm font-medium text-gray-900'>{department.name}</div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='text-sm text-gray-500 max-w-xs truncate'>
                        {department.description || 'No description'}
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='text-sm text-gray-500 max-w-xs truncate'>
                        {formatDate(department.createdAt)}
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='text-sm text-gray-500 max-w-xs truncate'>
                        {department?.createdBy?.firstName||"Admin"}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                      <div className='flex gap-2'>
                        <PermissionGuard permission="department.update">
                          <button
                            onClick={() => handleEdit(department)}
                            className='text-green-600 hover:text-green-900 transition-colors duration-200'
                          >
                           <Edit3 className="w-4 h-4" />
                          </button>
                        </PermissionGuard>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {showForm && (
        <DynamicForm
          title={editingItem ? 'Edit Department' : 'Add New Department'}
          fields={departmentFormFields}
          onSubmit={handleFormSubmit}
          onCancel={resetForm}
          initialData={formData}
          loading={submitting}
          submitText={editingItem ? 'Update Department' : 'Create Department'}
          cancelText="Cancel"
          onClose={resetForm}
        />
      )}
    </div>
  );
};

export default AddDepartmentSection;