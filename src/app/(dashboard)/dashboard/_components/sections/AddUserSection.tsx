'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { getRequest, postRequest } from '@/utils/api';
import { usePermissions, PermissionGuard } from '@/utils/permissions';
import { safeLocalStorage } from '@/utils/localStorage';
import DynamicForm, { FormField } from '@/components/forms/DynamicForm';
import { Edit3 } from 'lucide-react';

interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNo: string;
  countryCode: string;
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
  createdBy?: {
    firstName: string;
  }
}

// Country code options for Saudi Arabia and UAE
const countryCodes = [
  { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' }
];

// Phone number validation patterns
const phoneValidationPatterns = {
  '+966': /^5[0-9]{8}$/, // Saudi Arabia: 5XXXXXXXX (9 digits starting with 5)
  '+971': /^5[0-9]{8}$/  // UAE: 5XXXXXXXX (9 digits starting with 5)
};

// Phone validation function
const validatePhoneNumber = (countryCode: string, phoneNumber: string): { isValid: boolean; message: string } => {
  // Handle undefined/null values
  if (!phoneNumber || typeof phoneNumber !== 'string') {
    return { isValid: true, message: '' }; // Phone is optional
  }

  const trimmedPhone = phoneNumber.trim();
  if (!trimmedPhone) {
    return { isValid: true, message: '' }; // Phone is optional
  }

  if (!countryCode) {
    return { isValid: false, message: 'Please select a country code' };
  }

  const pattern = phoneValidationPatterns[countryCode as keyof typeof phoneValidationPatterns];
  if (!pattern) {
    return { isValid: false, message: 'Invalid country code' };
  }

  // Remove any non-digit characters from phone number
  const cleanPhone = trimmedPhone.replace(/\D/g, '');
  
  if (!pattern.test(cleanPhone)) {
    if (countryCode === '+966') {
      return { isValid: false, message: 'Saudi Arabia phone number must be 9 digits starting with 5 (e.g., 501234567)' };
    } else if (countryCode === '+971') {
      return { isValid: false, message: 'UAE phone number must be 9 digits starting with 5 (e.g., 501234567)' };
    }
  }

  return { isValid: true, message: '' };
};

const AddUserSection = () => {
  const [userData, setUserData] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const router = useRouter();
  const { canView, canCreate, canUpdate, canDelete } = usePermissions();
  
  const tokenData = JSON.parse(safeLocalStorage.getItem('tokens') || "{}");
  
  if (!tokenData.accessToken) {
    toast.error("Please login to continue");
    router.push('/login');
  }
  console.log(userData,'userData...........................????????????????????????????????????')
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
    countryCode: '',
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

  // Scroll to bottom when form opens
  useEffect(() => {
    if (showForm) {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [showForm]);

  const getOrganizationId = () => {
    const user = safeLocalStorage.getItem('user');
    const userData = JSON.parse(user || "");
    return userData.organization;
  }

  const fetchUsers = async () => {
    try {
      const user = JSON.parse(safeLocalStorage.getItem('user')|| '')
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
        const user = JSON.parse(safeLocalStorage.getItem('user')|| '')
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
        const user = JSON.parse(safeLocalStorage.getItem('user')|| '')
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
    const user = safeLocalStorage.getItem('user');
    const userData = JSON.parse(user || "");
    return userData.boundary;
  }

  const handleEdit = (user: User) => {
    // Extract country code from phone number if it exists
    const phoneParts = user.phoneNo?.split(' ') || [];
    const countryCode = phoneParts.length > 1 ? phoneParts[0] : '';
    const phoneNumber = phoneParts.length > 1 ? phoneParts.slice(1).join(' ') : user.phoneNo;
    
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNo: phoneNumber,
      countryCode: countryCode,
      departmentId: user.department?._id || '',
      roleId: user.role?._id || ''
    });
    setEditingUser(user);
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
      countryCode: '',
      departmentId: '',
      roleId: ''
    });
    setEditingUser(null);
    setShowForm(false);
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

  // Form fields configuration
  const userFormFields: FormField[] = [
    {
      name: 'firstName',
      label: 'First Name',
      type: 'text',
      required: true,
      placeholder: 'Enter first name'
    },
    {
      name: 'lastName',
      label: 'Last Name',
      type: 'text',
      required: true,
      placeholder: 'Enter last name'
    },
    {
      name: 'email',
      label: 'Email Address (Work email only)',
      type: 'email',
      required: true,
      placeholder: 'Enter work email address',
      validation: {
        pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        message: 'Please enter a valid email address'
      }
    },
    {
      name: 'phoneNo',
      label: 'Phone Number',
      type: 'phone',
      placeholder: 'Enter phone number',
      maxLength: 9,
      options: [
        { value: '+966', label: 'Saudi Arabia', flag: '🇸🇦', code: '+966' },
        { value: '+971', label: 'UAE', flag: '🇦🇪', code: '+971' }
      ],
      validation: {
        custom: ({ countryCode, phoneNumber }: { countryCode: string; phoneNumber: string }) => {
          return validatePhoneNumber(countryCode, phoneNumber);
        }
      }
    },
    {
      name: 'departmentId',
      label: 'Department',
      type: 'select',
      required: true,
      placeholder: 'Select Department',
      options: departments.map(dept => ({ value: dept._id, label: dept.name }))
    },
    {
      name: 'roleId',
      label: 'Role',
      type: 'select',
      required: true,
      placeholder: 'Select Role',
      options: roles.map(role => ({ value: role._id, label: role.name }))
    }
  ];

  const handleFormSubmit = async (data: any) => {
    setSubmitting(true);
    try {
      // Safely format phone number with country code if provided
      let formattedPhoneNo = '';
      if (data.phoneNo && typeof data.phoneNo === 'string' && data.phoneNo.trim()) {
        const countryCode = data.countryCode || '';
        formattedPhoneNo = countryCode ? `${countryCode} ${data.phoneNo.trim()}` : data.phoneNo.trim();
      }
      
      const userData = {
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
        phoneNo: formattedPhoneNo,
        departmentId: data.departmentId || '',
        roleId: data.roleId || '',
        organizationId: getOrganizationId(),
        boundaryId: getBoundaryId()
      };

      let response;
      
      if (editingUser) {
        // Update existing user
        response = await postRequest(
          `user/updateUser/${editingUser._id}`,
          userData,
          "User updated successfully",
          tokenData.accessToken,
          "put"
        );
      } else {
        // Create new user
        response = await postRequest(
          "user/createUser",
          userData,
          "User created successfully",
          tokenData.accessToken,
          "post"
        );
      }
      
      if (response.success) {
        toast.success(editingUser ? "User updated successfully" : "User created successfully");
        resetForm();
        fetchUsers();
      }
    } catch (error: any) {
      toast.error(error.message || (editingUser ? "Failed to update user" : "Failed to create user"));
    } finally {
      setSubmitting(false);
    }
  };

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(userData.map(user => user._id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers(prev => [...prev, userId]);
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedUsers.length} selected users?`)) {
      return;
    }

    try {
      const deletePromises = selectedUsers.map(userId => 
        postRequest(
          `user/deleteUser/${userId}`,
          {},
          "User deleted successfully",
          tokenData.accessToken,
          "delete"
        )
      );

      await Promise.all(deletePromises);
      toast.success(`${selectedUsers.length} users deleted successfully`);
      setSelectedUsers([]);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete some users");
    }
  };

  const handleBulkVerify = async () => {
    try {
      const verifyPromises = selectedUsers.map(userId => 
        postRequest(
          `user/verifyUser/${userId}`,
          {},
          "User verified successfully",
          tokenData.accessToken,
          "put"
        )
      );

      await Promise.all(verifyPromises);
      toast.success(`${selectedUsers.length} users verified successfully`);
      setSelectedUsers([]);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || "Failed to verify some users");
    }
  };

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

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <span className='text-sm font-medium text-blue-900'>
                {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
              </span>
            </div>
            <div className='flex gap-2'>
              <PermissionGuard permission="user.update">
                <button
                  onClick={handleBulkVerify}
                  className='bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm transition-colors duration-200'
                >
                  Verify Selected
                </button>
              </PermissionGuard>
              <PermissionGuard permission="user.delete">
                <button
                  onClick={handleBulkDelete}
                  className='bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm transition-colors duration-200'
                >
                  Delete Selected
                </button>
              </PermissionGuard>
              <button
                onClick={() => setSelectedUsers([])}
                className='bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-md text-sm transition-colors duration-200'
              >
                Clear Selection
              </button>
            </div>
          </div>
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
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === userData.length && userData.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    ID
                  </th>
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
                      Created By
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Created At
                    </th>
                  {/* <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Status
                  </th> */}
                  
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {userData.map((user,i) => (
                  <tr key={user._id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user._id)}
                        onChange={(e) => handleSelectUser(user._id, e.target.checked)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm font-medium text-gray-900'>US-{i+1}</div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm font-medium text-gray-900'>
                        <span className='bg-gray-300 rounded-full text-gray-600 p-2 mr-1 text-xs size-8'>{createDP(`${user.firstName} ${user.lastName}`)}</span> {user.firstName} {user.lastName}
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
                      <div className='text-sm text-gray-900'>{user.createdBy?.firstName || 'N/A'}</div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>{formatDate(user.createdAt)}</div>
                    </td>

                    {/* <td className='px-6 py-4 whitespace-nowrap'>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-[8px] text-xs font-medium ${
                        user.isVerified 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {!user.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </td> */}
                    
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                      <div className='flex gap-2'>
                        <PermissionGuard permission="user.update">
                          <button
                            onClick={() => handleEdit(user)}
                            className='text-green-600 hover:text-green-900 transition-colors duration-200'
                            title="Edit User"
                          >
                           <Edit3 className="w-4 h-4" />  
                          </button>
                        </PermissionGuard>
                        {/* <PermissionGuard permission="user.delete">
                          <button
                            onClick={() => handleDelete(user._id)}
                            className='text-red-600 hover:text-red-900 transition-colors duration-200'
                            title="Delete User"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </PermissionGuard> */}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

       {/* Form Section */}
       {showForm && (
        <DynamicForm
          title={editingUser ? 'Edit User' : 'Add New User'}
          fields={userFormFields}
          onSubmit={handleFormSubmit}
          onCancel={resetForm}
          initialData={formData}
          loading={submitting}
          submitText={editingUser ? 'Update User' : 'Create User'}
          cancelText="Cancel"
          onClose={resetForm}
          confirmationMessage={editingUser ? 'Do you really want to update this user?' : 'Do you really want to create this user?'}
        />
      )}
    </div>
  );
};

export default AddUserSection;