import { apiRequest } from '../api/client';
import type { ApiSchool, CreateSchoolRequest, SchoolsListResponse, UpdateSchoolRequest } from '../types/schools';

export const schoolsApi = {
  async list(): Promise<SchoolsListResponse> {
    const res = await apiRequest<SchoolsListResponse>({
      method: 'GET',
      path: '/api/schools/',
    });
    return res.data;
  },

  async get(schoolId: string): Promise<ApiSchool> {
    const res = await apiRequest<ApiSchool>({
      method: 'GET',
      path: `/api/schools/${schoolId}/`,
    });
    return res.data;
  },

  async create(data: CreateSchoolRequest): Promise<ApiSchool> {
    const res = await apiRequest<ApiSchool>({
      method: 'POST',
      path: '/api/schools/',
      body: data,
    });
    return res.data;
  },

  async update(schoolId: string, data: UpdateSchoolRequest): Promise<ApiSchool> {
    const res = await apiRequest<ApiSchool>({
      method: 'PATCH',
      path: `/api/schools/${schoolId}/`,
      body: data,
    });
    return res.data;
  },

  async delete(schoolId: string): Promise<void> {
    await apiRequest<void>({
      method: 'DELETE',
      path: `/api/schools/${schoolId}/`,
    });
  },
};
