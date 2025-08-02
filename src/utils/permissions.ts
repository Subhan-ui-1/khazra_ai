import React from 'react';

export interface Permission {
  _id: string;
  name: string;
  description: string;
}

export class PermissionManager {
  private static instance: PermissionManager;
  private permissions: Permission[] = [];

  private constructor() {
    this.loadPermissions();
  }

  public static getInstance(): PermissionManager {
    if (!PermissionManager.instance) {
      PermissionManager.instance = new PermissionManager();
    }
    return PermissionManager.instance;
  }

  private loadPermissions(): void {
    try {
      const permissionsData = localStorage.getItem('permissions');
      if (permissionsData) {
        this.permissions = JSON.parse(permissionsData);
      }
    } catch (error) {
      console.error('Error loading permissions:', error);
      this.permissions = [];
    }
  }

  public refreshPermissions(): void {
    this.loadPermissions();
  }

  public hasPermission(permissionName: string): boolean {
    return this.permissions.some(permission => permission.name === permissionName);
  }

  public hasAnyPermission(permissionNames: string[]): boolean {
    return permissionNames.some(permissionName => this.hasPermission(permissionName));
  }

  public hasAllPermissions(permissionNames: string[]): boolean {
    return permissionNames.every(permissionName => this.hasPermission(permissionName));
  }

  public getPermissions(): Permission[] {
    return [...this.permissions];
  }

  public getPermissionNames(): string[] {
    return this.permissions.map(permission => permission.name);
  }

  // Helper methods for common permission patterns
  public canView(resource: string): boolean {
    return this.hasPermission(`${resource}.view`);
  }

  public canCreate(resource: string): boolean {
    return this.hasPermission(`${resource}.create`);
  }

  public canUpdate(resource: string): boolean {
    return this.hasPermission(`${resource}.update`);
  }

  public canDelete(resource: string): boolean {
    return this.hasPermission(`${resource}.delete`);
  }

  public canManage(resource: string): boolean {
    return this.hasAnyPermission([
      `${resource}.view`,
      `${resource}.create`,
      `${resource}.update`,
      `${resource}.delete`
    ]);
  }
}

// Export a singleton instance
export const permissionManager = PermissionManager.getInstance();

// React Hook for permissions
export const usePermissions = () => {
  const hasPermission = (permissionName: string): boolean => {
    return permissionManager.hasPermission(permissionName);
  };

  const hasAnyPermission = (permissionNames: string[]): boolean => {
    return permissionManager.hasAnyPermission(permissionNames);
  };

  const hasAllPermissions = (permissionNames: string[]): boolean => {
    return permissionManager.hasAllPermissions(permissionNames);
  };

  const canView = (resource: string): boolean => {
    return permissionManager.canView(resource);
  };

  const canCreate = (resource: string): boolean => {
    return permissionManager.canCreate(resource);
  };

  const canUpdate = (resource: string): boolean => {
    return permissionManager.canUpdate(resource);
  };

  const canDelete = (resource: string): boolean => {
    return permissionManager.canDelete(resource);
  };

  const canManage = (resource: string): boolean => {
    return permissionManager.canManage(resource);
  };

  const getPermissions = (): Permission[] => {
    return permissionManager.getPermissions();
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canView,
    canCreate,
    canUpdate,
    canDelete,
    canManage,
    getPermissions,
    refreshPermissions: () => permissionManager.refreshPermissions()
  };
};

// Higher-order component for permission-based rendering
export const withPermission = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requiredPermission: string,
  fallbackComponent?: React.ComponentType<P>
) => {
  const WithPermissionComponent: React.FC<P> = (props) => {
    const { hasPermission } = usePermissions();
    
    if (hasPermission(requiredPermission)) {
      return React.createElement(WrappedComponent, props);
    }
    
    if (fallbackComponent) {
      return React.createElement(fallbackComponent, props);
    }
    
    return null;
  };

  WithPermissionComponent.displayName = `withPermission(${WrappedComponent.displayName || WrappedComponent.name})`;
  return WithPermissionComponent;
};

// Permission-based component wrapper
export const PermissionGuard: React.FC<{
  permission: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}> = ({ permission, fallback, children }) => {
  const { hasPermission } = usePermissions();
  
  if (hasPermission(permission)) {
    return React.createElement(React.Fragment, null, children);
  }
  
  return fallback ? React.createElement(React.Fragment, null, fallback) : null;
}; 