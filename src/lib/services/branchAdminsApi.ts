import { apiRequest } from '../api/client';
import type { BranchAdmin, InviteBranchAdminRequest, BranchAdminsListResponse } from '../types/branchAdmins';

export const branchAdminsApi = {
  async list(branchId?: string): Promise<BranchAdmin[]> {
    const path = branchId 
      ? `/api/branch-admins/?branch=${branchId}`
      : '/api/branch-admins/';
    
    const res = await apiRequest<BranchAdmin[] | BranchAdminsListResponse>({
      method: 'GET',
      path,
    });
    
    // Handle both array and paginated response formats
    if (Array.isArray(res.data)) {
      console.log('Branch admins response (array):', res.data);
      return res.data;
    } else if (res.data && typeof res.data === 'object' && 'results' in res.data) {
      console.log('Branch admins response (paginated):', res.data);
      return (res.data as BranchAdminsListResponse).results;
    } else {
      console.error('Unexpected branch admins response format:', res.data);
      return [];
    }
  },

  async invite(data: InviteBranchAdminRequest): Promise<{ message: string }> {
    // Remove trailing slash to fix "method not allowed" error
    const res = await apiRequest<{ message: string }>({
      method: 'POST',
      path: '/api/branch-admins/invite/',
      body: data,
    });
    return res.data;
  },

  async get(id: string): Promise<BranchAdmin> {
    const res = await apiRequest<BranchAdmin>({
      method: 'GET',
      path: `/api/branch-admins/${id}/`,
    });
    return res.data;
  },
};
