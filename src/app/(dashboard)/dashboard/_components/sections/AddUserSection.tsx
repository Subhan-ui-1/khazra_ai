'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { getRequest, postRequest } from '@/utils/api';
import { usePermissions, PermissionGuard } from '@/utils/permissions';

interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNo: string;
  departmentId: string;
  roleId: string;
}

interface FilterState {
  search: string;
  sortBy: string;
  sortOrder: string;
  page: number;
  limit: number;
  department: string;
  role: string;
  isVerified: string;
}

interface Department {
  _id: string;
  name: string;
  description: string;
}

interface Role {
  _id: string;
  name: string;
  description: string;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNo: string;
  department: Department;
  role: Role;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

const AddUserSection = () => {
  const [userData, setUserData] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const router = useRouter();
  const { canView, canCreate, canUpdate, canDelete } = usePermissions();
  
  const tokenData = JSON.parse(localStorage.getItem('tokens') || "{}");
  
  if (!tokenData.accessToken) {
    toast.error("Please login to continue");
    router.push('/login');
  }

  // Check if user has permission to view users
  if (!canView('user')) {
    return (
      <div className="p-8 text-center text-gray-500">
        You don't have permission to view users.
      </div>
    );
  }

  const [formData, setFormData] = useState<UserFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNo: '',
    departmentId: '',
    roleId: ''
  });

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'asc',
    page: 1,
    limit: 10,
    department: '',
    role: '',
    isVerified: ''
  });

  // Fetch users, departments, and roles on component mount
  useEffect(() => {
    fetchUsers();
    fetchDepartments();
    fetchRoles();
  }, [filters]);

  const getOrganizationId = () => {
    const user = localStorage.getItem('user');
    const userData = JSON.parse(user || "");
    return userData.organization;
  }
  const fetchUsers = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user')|| '')
      setLoading(true);
      

      const queryParams = new URLSearchParams({
        page: filters.page.toString(),
        limit: filters.limit.toString(),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        department: user.department.name.toLowerCase()==='administration'?"":user.department._id,
        ...(filters.search && { search: filters.search }),
        ...(filters.department && { department: filters.department }),
        ...(filters.role && { role: filters.role }),
        ...(filters.isVerified && { isVerified: filters.isVerified }),
      });

      const response = await getRequest(
        `user/getUsers?${queryParams}`,
        tokenData.accessToken
      );
      
      if (response.success) {
        setUserData(response.data.users || []);
      } else {
        toast.error(response.message || "Failed to fetch users");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      setLoadingDepartments(true);
      const response = await getRequest(
        'departments/getDepartments?limit=100',
        tokenData.accessToken
      );
      
      if (response.success) {
        const user = JSON.parse(localStorage.getItem('user')|| '')
        if(user.role.name === 'superadmin'){
          setDepartments(response.data.departments || []);
        }else{
          setDepartments(response.data.departments.filter((e:any)=>e.name !== 'Administration') || []);
        }
      } else {
        toast.error(response.message || "Failed to fetch departments");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch departments");
    } finally {
      setLoadingDepartments(false);
    }
  };

  const fetchRoles = async () => {
    try {
      setLoadingRoles(true);
      const response = await getRequest(
        'roles/getRoles?limit=100',
        tokenData.accessToken
      );
      
      if (response.success) {
        const user = JSON.parse(localStorage.getItem('user')|| '')
        if(user.role.name === 'superadmin'){
          setRoles(response.data.roles || []);
        }else{
          setRoles(response.data.roles.filter((e:any)=>e.name !== 'superadmin') || []);
        }
      } else {
        toast.error(response.message || "Failed to fetch roles");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch roles");
    } finally {
      setLoadingRoles(false);
    }
  };

  const getBoundaryId = () => {
    const user = localStorage.getItem('user');
    const userData = JSON.parse(user || "");
    return userData.boundary;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      toast.error("First name, last name, and email are required");
      return;
    }

    if (!formData.departmentId || !formData.roleId) {
      toast.error("Department and role are required");
      return;
    }

    // Email validation for work email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setSubmitting(true);
    try {
      const userData = {
        ...formData,
        organizationId:getOrganizationId(),
        boundaryId: getBoundaryId()
      };

      const response = await postRequest(
        "user/createUser",
        userData,
        "User created successfully",
        tokenData.accessToken,
        "post"
      );
      
      if (response.success) {
        toast.success("User created successfully");
        resetForm();
        fetchUsers();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create user");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (user: User) => {
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNo: user.phoneNo,
      departmentId: user.department?._id || '',
      roleId: user.role?._id || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      const response = await postRequest(
        `user/deleteUser/${userId}`,
        {},
        "User deleted successfully",
        tokenData.accessToken,
        "delete"
      );
      
      if (response.success) {
        toast.success("User deleted successfully");
        fetchUsers();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete user");
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phoneNo: '',
      departmentId: '',
      roleId: ''
    });
    setShowForm(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const createDP = (name: string) => {
    return name.split(' ').map((e:string)=>e.charAt(0).toUpperCase()).join('');
  }

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold text-gray-800'>User Management</h1>
        <PermissionGuard permission="user.create">
          <button
            onClick={() => setShowForm(true)}
            className='bg-[#0D5942] hover:bg-[#0D5942] text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2'
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add User
          </button>
        </PermissionGuard>
      </div>

      {/* Search and Filter Section */}
      <div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          <div>
            <input
              type='text'
              placeholder='Search users...'
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500'
            />
          </div>
          <div>
            <select
              value={filters.department}
              onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value, page: 1 }))}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500'
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>{dept.name}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={filters.role}
              onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value, page: 1 }))}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500'
            >
              <option value="">All Roles</option>
              {roles.map((role) => (
                <option key={role._id} value={role._id}>{role.name}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={filters.isVerified}
              onChange={(e) => setFilters(prev => ({ ...prev, isVerified: e.target.value, page: 1 }))}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500'
            >
              <option value="">All Users</option>
              <option value="true">Verified</option>
              <option value="false">Not Verified</option>
            </select>
          </div>
        </div>
        <div className='flex gap-2 mt-4'>
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
            className='px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500'
          >
            <option value="createdAt">Created Date</option>
            <option value="firstName">First Name</option>
            <option value="lastName">Last Name</option>
            <option value="email">Email</option>
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

      {/* Form Section */}
      {showForm && (
        <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-xl font-semibold text-gray-800'>Add New User</h2>
            <button
              onClick={resetForm}
              className='text-gray-500 hover:text-gray-700'
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label htmlFor='firstName' className='block text-sm font-medium text-gray-700 mb-2'>
                  First Name *
                </label>
                <input
                  type='text'
                  id='firstName'
                  name='firstName'
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder='Enter first name'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500'
                  required
                />
              </div>
              
              <div>
                <label htmlFor='lastName' className='block text-sm font-medium text-gray-700 mb-2'>
                  Last Name *
                </label>
                <input
                  type='text'
                  id='lastName'
                  name='lastName'
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder='Enter last name'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500'
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-2'>
                Email Address * (Work email only)
              </label>
              <input
                type='email'
                id='email'
                name='email'
                value={formData.email}
                onChange={handleInputChange}
                placeholder='Enter work email address'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500'
                required
              />
            </div>
            
            <div>
              <label htmlFor='phoneNo' className='block text-sm font-medium text-gray-700 mb-2'>
                Phone Number
              </label>
              <input
                type='tel'
                id='phoneNo'
                name='phoneNo'
                value={formData.phoneNo}
                onChange={handleInputChange}
                placeholder='Enter phone number'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500'
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label htmlFor='departmentId' className='block text-sm font-medium text-gray-700 mb-2'>
                  Department *
                </label>
                {loadingDepartments ? (
                  <div className='flex items-center gap-2 text-gray-500'>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading departments...
                  </div>
                ) : (
                  <select
                    id='departmentId'
                    name='departmentId'
                    value={formData.departmentId}
                    onChange={handleInputChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500'
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept._id} value={dept._id}>{dept.name}</option>
                    ))}
                  </select>
                )}
              </div>
              
              <div>
                <label htmlFor='roleId' className='block text-sm font-medium text-gray-700 mb-2'>
                  Role *
                </label>
                {loadingRoles ? (
                  <div className='flex items-center gap-2 text-gray-500'>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading roles...
                  </div>
                ) : (
                  <select
                    id='roleId'
                    name='roleId'
                    value={formData.roleId}
                    onChange={handleInputChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500'
                    required
                  >
                    <option value="">Select Role</option>
                    {roles.map((role) => (
                      <option key={role._id} value={role._id}>{role.name}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>
            
            <div className='flex gap-3 pt-4'>
              <button
                type='submit'
                disabled={submitting}
                className='bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-2 rounded-md transition-colors duration-200 flex items-center gap-2'
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Create User
                  </>
                )}
              </button>
              <button
                type='button'
                onClick={resetForm}
                className='bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-md transition-colors duration-200'
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users List */}
      <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
        <div className='px-6 py-4 border-b border-gray-200'>
          <h3 className='text-lg font-semibold text-gray-800'>Users</h3>
        </div>
        
        {loading ? (
          <div className='p-8 text-center'>
            <svg className="animate-spin h-8 w-8 mx-auto text-green-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className='mt-2 text-gray-600'>Loading users...</p>
          </div>
        ) : userData.length === 0 ? (
          <div className='p-8 text-center'>
            <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            <p className='mt-2 text-gray-600'>No users found</p>
            <button
              onClick={() => setShowForm(true)}
              className='mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors duration-200'
            >
              Add your first user
            </button>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Name
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Email
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Phone
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Department
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Role
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Status
                  </th>
                  
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {userData.map((user) => (
                  <tr key={user._id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm font-medium text-gray-900'>
                        <span className='bg-gray-300 rounded-full text-gray-600 p-2 mr-1'>{createDP(`${user.firstName} ${user.lastName}`)}</span> {user.firstName} {user.lastName}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>{user.email}</div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-500'>{user.phoneNo || 'N/A'}</div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>{user.department?.name || 'N/A'}</div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>{user.role?.name || 'N/A'}</div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-[8px] text-xs font-medium ${
                        user.isVerified 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {!user.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                      <div className='flex gap-2'>
                        <PermissionGuard permission="user.update">
                          <button
                            onClick={() => handleEdit(user)}
                            className='text-green-600 hover:text-green-900 transition-colors duration-200'
                            title="Edit User"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        </PermissionGuard>
                        <PermissionGuard permission="user.delete">
                          <button
                            onClick={() => handleDelete(user._id)}
                            className='text-red-600 hover:text-red-900 transition-colors duration-200'
                            title="Delete User"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
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
    </div>
  );
};

export default AddUserSection;