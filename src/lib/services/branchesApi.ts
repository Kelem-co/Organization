import { apiRequest } from '../api/client';
import type { InviteBranchAdminRequest, BranchAdmin } from '../types/branchAdmins';
import type { ApiBranch, CreateBranchRequest, UpdateBranchRequest, BranchesListResponse } from '../types/branches';

export const branchesApi = {
  async list(): Promise<BranchesListResponse> {
    const res = await apiRequest<BranchesListResponse>({
      method: 'GET',
      path: '/api/branches/',
    });
    return res.data;
  },

  async get(branchId: string): Promise<ApiBranch> {
    const res = await apiRequest<ApiBranch>({
      method: 'GET',
      path: `/api/branches/${branchId}/`,
    });
    return res.data;
  },

  async create(data: CreateBranchRequest): Promise<ApiBranch> {
    const res = await apiRequest<ApiBranch>({
      method: 'POST',
      path: '/api/branches/',
      body: data,
    });
    return res.data;
  },

  async update(branchId: string, data: UpdateBranchRequest): Promise<ApiBranch> {
    const res = await apiRequest<ApiBranch>({
      method: 'PATCH',
      path: `/api/branches/${branchId}/`,
      body: data,
    });
    return res.data;
  },

  async delete(branchId: string): Promise<void> {
    await apiRequest<void>({
      method: 'DELETE',
      path: `/api/branches/${branchId}/`,
    });
  },

  // Legacy methods for backward compatibility (will be removed)
  async listBySchool(schoolId: string): Promise<ApiBranch[]> {
    // This is a mock implementation until the backend provides this endpoint
    const response = await this.list();
    return response.results.filter(branch => branch.school === schoolId);
  },

  async listAdmins(_branchId: string): Promise<BranchAdmin[]> {
    // Mock implementation - will be replaced with real API
    void _branchId;
    return [];
  },

  async createAdmin(_data: InviteBranchAdminRequest): Promise<{ message: string }> {
    // Mock implementation - will be replaced with real API
    void _data;
    return { message: 'Not implemented' };
  },

  async deleteAdmin(_branchId: string, _adminId: string): Promise<void> {
    // Mock implementation - will be replaced with real API
    void _branchId;
    void _adminId;
  },
};
