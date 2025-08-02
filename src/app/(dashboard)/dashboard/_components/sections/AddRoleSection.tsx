"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getRequest, postRequest } from "@/utils/api";
import { usePermissions, PermissionGuard } from "@/utils/permissions";
import { safeLocalStorage } from "@/utils/localStorage";

interface RoleFormData {
  name: string;
  description: string;
  permissions: string[];
}

interface FilterState {
  search: string;
  sortBy: string;
  sortOrder: string;
  page: number;
  limit: number;
}

interface Permission {
  _id: string;
  name: string;
  description: string;
}

interface Role {
  _id: string;
  name: string;
  description: string;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
}

const AddRoleSection = () => {
  const [roleData, setRoleData] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadingPermissions, setLoadingPermissions] = useState(false);
  const router = useRouter();
  const { canView, canCreate, canUpdate, canDelete } = usePermissions();

  const tokenData = JSON.parse(safeLocalStorage.getItem("tokens") || "{}");
  if (!tokenData.accessToken) {
    toast.error("Please login to continue");
    router.push("/login");
  }

  // Check if user has permission to view roles
  if (!canView("role")) {
    return (
      <div className="p-8 text-center text-gray-500">
        You don't have permission to view roles.
      </div>
    );
  }

  const [formData, setFormData] = useState<RoleFormData>({
    name: "",
    description: "",
    permissions: [],
  });

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    sortBy: "createdAt",
    sortOrder: "asc",
    page: 1,
    limit: 100,
  });

  // Fetch roles and permissions on component mount
  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, [filters]);

  const fetchRoles = async () => {
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
        `roles/getRoles?${queryParams}`,
        tokenData.accessToken
      );

      if (response.success) {
        const user = JSON.parse(safeLocalStorage.getItem("user") || "");
        if (user.role.name === "superadmin") {
          setRoleData(response.data.roles || []);
        } else {
          setRoleData(
            response.data.roles.filter((e: any) => e.name !== "superadmin") ||
              []
          );
        }
      } else {
        toast.error(response.message || "Failed to fetch roles");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch roles");
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      setLoadingPermissions(true);
      const permissionsss = JSON.parse(
        safeLocalStorage.getItem("permissions") || ""
      );
      setPermissions(permissionsss);
      // const response = await getRequest(
      //   'permissions/getPermissions?limit=100',
      //   tokenData.accessToken
      // );

      // if (response.success) {
      //   setPermissions(response.data.permissions || []);
      // } else {
      //   toast.error(response.message || "Failed to fetch permissions");
      // }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch permissions");
    } finally {
      setLoadingPermissions(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Role name is required");
      return;
    }

    setSubmitting(true);
    try {
      if (editingItem) {
        // Update existing role
        const response = await postRequest(
          `roles/updateRole/${editingItem._id}`,
          { ...formData },
          "Role updated successfully",
          tokenData.accessToken,
          "put"
        );

        if (response.success) {
          toast.success("Role updated successfully");
          resetForm();
          fetchRoles();
        }
      } else {
        // Add new role
        const response = await postRequest(
          "roles/addRole",
          formData,
          "Role added successfully",
          tokenData.accessToken,
          "post"
        );

        if (response.success) {
          toast.success("Role added successfully");
          resetForm();
          fetchRoles();
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to save role");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (role: Role) => {
    setEditingItem(role);
    setFormData({
      name: role.name,
      description: role.description || "",
      permissions: role.permissions.map((p) => p._id),
    });
    setShowForm(true);
  };

  const handleDelete = async (roleId: string) => {
    if (!confirm("Are you sure you want to delete this role?")) {
      return;
    }

    try {
      const response = await postRequest(
        `roles/deleteRole/${roleId}`,
        {},
        "Role deleted successfully",
        tokenData.accessToken,
        "delete"
      );

      if (response.success) {
        toast.success("Role deleted successfully");
        fetchRoles();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete role");
    }
  };

  const resetForm = () => {
    setFormData({ name: "", description: "", permissions: [] });
    setEditingItem(null);
    setShowForm(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePermissionChange = (permissionId: string) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter((id) => id !== permissionId)
        : [...prev.permissions, permissionId],
    }));
  };

  const handleSelectAll = () => {
    // Get all available permission IDs from the permissions array
    const allPermissionIds = permissions.map(permission => permission._id);
    
    // If all permissions are already selected, unselect all
    if (formData.permissions.length === allPermissionIds.length) {
      setFormData(prev => ({
        ...prev,
        permissions: []
      }));
    } else {
      // Otherwise, select all permissions
      setFormData(prev => ({
        ...prev,
        permissions: allPermissionIds
      }));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getPermissionNames = (permissionIds: string[]) => {
    return permissionIds
      .map((id) => permissions.find((p) => p._id === id)?.name)
      .filter(Boolean)
      .join(", ");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Role Management</h1>
        <PermissionGuard permission="role.create">
          <button
            onClick={() => setShowForm(true)}
            className="bg-[#0D5942] text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Role
          </button>
        </PermissionGuard>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 w-1/2">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search roles..."
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  search: e.target.value,
                  page: 1,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filters.sortBy}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, sortBy: e.target.value }))
              }
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="createdAt">Created Date</option>
              <option value="name">Name</option>
            </select>
            <select
              value={filters.sortOrder}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, sortOrder: e.target.value }))
              }
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Form Section */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {editingItem ? "Edit Role" : "Add New Role"}
            </h2>
            <button
              onClick={resetForm}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Role Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter role name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Role Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                placeholder="Enter role description (optional)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <div className=" text-sm font-medium text-gray-700 mb-2 flex justify-between items-center">
                Permissions
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Select All</span>
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" 
                      checked={formData.permissions.length === permissions.length && permissions.length > 0}
                      onChange={handleSelectAll}
                    />
                  </div>
                  {formData.permissions.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, permissions: [] }))}
                      className="text-xs text-red-600 hover:text-red-800 underline"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>
              {loadingPermissions ? (
                <div className="flex items-center gap-2 text-gray-500">
                  <svg
                    className="animate-spin h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Loading permissions...
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto border border-gray-300 rounded-md">
                  {(() => {
                    // Define resource mappings
                    const resourceMappings = {
                      user: { label: "Users", icon: "👥" },
                      role: { label: "Roles", icon: "🔐" },
                      department: { label: "Departments", icon: "🏢" },
                      facilities: { label: "Facilities", icon: "🏭" },
                      vehicle: { label: "Vehicles", icon: "🚗" },
                      equipment: { label: "Equipment", icon: "⚙️" },
                      equipmentType: { label: "Equipment Types", icon: "🔧" },
                      boundaries: { label: "Boundaries", icon: "🌐" },
                      feedback: { label: "Feedback", icon: "💬" },
                      permission: { label: "Permission", icon: "💬" },
                      mobileFuelType: { label: "Mobile Fuel Type", icon: "💬" },
                      energyType: { label: "Energy Type", icon: "💬" },
                      stationaryFuelType: {
                        label: "Stationary Fuel Type",
                        icon: "💬",
                      },
                      organization: { label: "Organization", icon: "💬" },
                    };

                    // Get available actions from permissions
                    const availableActions = new Set();
                    const availableResources = new Set();

                    permissions.forEach((permission: any) => {
                      const [resource, action] = permission.name.split(".");
                      if (resourceMappings[resource]) {
                        availableActions.add(action);
                        availableResources.add(resource);
                      }
                    });

                    const sortedActions = Array.from(availableActions).sort();
                    const sortedResources =
                      Array.from(availableResources).sort();

                    if (sortedResources.length === 0) {
                      return (
                        <div className="p-4 text-center text-gray-500">
                          No permissions available
                        </div>
                      );
                    }

                    return (
                      <table className="w-full">
                        <thead className="bg-gray-50 sticky top-0">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                              Resource
                            </th>
                            {sortedActions.map((action: any) => (
                              <th
                                key={action}
                                className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200"
                              >
                                {/* {action.charAt(0).toUpperCase() +
                                  action.slice(1)} */}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {sortedResources.map((resource: string) => {
                            const resourceInfo = resourceMappings[resource];
                            return (
                              <tr key={resource} className="hover:bg-gray-50">
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <span className="text-lg mr-2">
                                      {resourceInfo.icon}
                                    </span>
                                    <span className="text-sm font-medium text-gray-900">
                                      {resourceInfo.label}
                                    </span>
                                  </div>
                                </td>
                                {sortedActions.map((action) => {
                                  const permissionName = `${resource}.${action}`;
                                  const permission = permissions.find(
                                    (p) => p.name === permissionName
                                  );
                                  return (
                                    <td
                                      key={action}
                                      className="px-4 py-3 text-center "
                                    >
                                      <div className="flex items-center justify-center gap-2">
                                      {action.charAt(0).toUpperCase() +
                                        action.slice(1)}{" "}
                                      {permission ? (
                                        <input
                                          type="checkbox"
                                          checked={formData.permissions.includes(
                                            permission._id
                                          )}
                                          onChange={() =>
                                            handlePermissionChange(
                                              permission._id
                                            )
                                          }
                                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                        />
                                      ) : (
                                        <span className="text-gray-400 text-xs">
                                          -
                                        </span>
                                      )}
                                      </div>
                                    </td>
                                  );
                                })}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    );
                  })()}
                </div>
              )}
              {formData.permissions.length > 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  {formData.permissions.length} permission(s) selected
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="bg-[#0D5942] text-white px-6 py-2 rounded-md transition-colors duration-200 flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {editingItem ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {editingItem ? "Update Role" : "Add Role"}
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-md transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Roles List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Roles</h3>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <svg
              className="animate-spin h-8 w-8 mx-auto text-green-600"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="mt-2 text-gray-600">Loading roles...</p>
          </div>
        ) : roleData.length === 0 ? (
          <div className="p-8 text-center">
            <svg
              className="w-16 h-16 mx-auto text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p className="mt-2 text-gray-600">No roles found</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 bg-[#0D5942] text-white px-4 py-2 rounded-md transition-colors duration-200"
            >
              Add your first role
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Permissions
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {roleData.map((role) => (
                  <tr key={role._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {role.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        {role.description || "No description"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 max-w-xs">
                        {role.permissions && role.permissions.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {role.permissions
                              .slice(0, 3)
                              .map((permission, index) => (
                                <span
                                  key={permission._id}
                                  className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-800"
                                >
                                  {permission.name}
                                </span>
                              ))}
                            {role.permissions.length > 3 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-800">
                                +{role.permissions.length - 3} more
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">No permissions</span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <PermissionGuard permission="role.update">
                          <button
                            onClick={() => handleEdit(role)}
                            className="text-green-600 hover:text-green-900 transition-colors duration-200"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                        </PermissionGuard>
                        <PermissionGuard permission="role.delete">
                          <button
                            onClick={() => handleDelete(role._id)}
                            className="text-red-600 hover:text-red-900 transition-colors duration-200"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
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

export default AddRoleSection;
