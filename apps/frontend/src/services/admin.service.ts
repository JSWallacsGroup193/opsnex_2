import apiClient from './api';

interface DashboardStats {
  users: { total: number; active: number; inactive: number };
  tenants: number;
  roles: number;
  permissions: number;
}

export const adminService = {
  async getDashboard(): Promise<DashboardStats> {
    return apiClient.get('/admin/dashboard');
  },

  async getAllUsers() {
    return apiClient.get('/admin/users');
  },

  async getUser(id: string) {
    return apiClient.get(`/admin/users/${id}`);
  },

  async createUser(data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    tenantId: string;
  }) {
    return apiClient.post('/admin/users', data);
  },

  async updateUser(
    id: string,
    data: {
      firstName?: string;
      lastName?: string;
      phone?: string;
      email?: string;
    }
  ) {
    return apiClient.put(`/admin/users/${id}`, data);
  },

  async deleteUser(id: string) {
    return apiClient.delete(`/admin/users/${id}`);
  },

  async activateUser(id: string) {
    return apiClient.post(`/admin/users/${id}/activate`);
  },

  async deactivateUser(id: string) {
    return apiClient.post(`/admin/users/${id}/deactivate`);
  },

  async updateUserRoles(userId: string, roleIds: string[]) {
    return apiClient.put(`/admin/users/${userId}/roles`, { roleIds });
  },

  async getAllRoles() {
    return apiClient.get('/admin/roles');
  },

  async getRole(id: string) {
    return apiClient.get(`/admin/roles/${id}`);
  },

  async createRole(data: {
    name: string;
    displayName?: string;
    description?: string;
    color?: string;
  }) {
    return apiClient.post('/admin/roles', data);
  },

  async updateRole(
    id: string,
    data: {
      displayName?: string;
      description?: string;
      color?: string;
    }
  ) {
    return apiClient.put(`/admin/roles/${id}`, data);
  },

  async deleteRole(id: string) {
    return apiClient.delete(`/admin/roles/${id}`);
  },

  async updateRolePermissions(roleId: string, permissionIds: string[]) {
    return apiClient.put(`/admin/roles/${roleId}/permissions`, {
      permissionIds,
    });
  },

  async getAllPermissions() {
    return apiClient.get('/admin/permissions');
  },

  async getAllTenants() {
    return apiClient.get('/admin/tenants');
  },

  async getTenant(id: string) {
    return apiClient.get(`/admin/tenants/${id}`);
  },

  async updateTenant(
    id: string,
    data: {
      name?: string;
      plan?: string;
      settings?: any;
    }
  ) {
    return apiClient.put(`/admin/tenants/${id}`, data);
  },

  async activateTenant(id: string) {
    return apiClient.post(`/admin/tenants/${id}/activate`);
  },

  async deactivateTenant(id: string) {
    return apiClient.post(`/admin/tenants/${id}/deactivate`);
  },
};
