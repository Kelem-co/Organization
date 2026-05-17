import { apiRequest } from '../api/client';
import type { OrganizationsResponse, Organization } from '../types/organizations';

export interface CreateOrganizationRequest {
  name: string;
  trade_name: string;
  tin_number: string;
  license_no: string;
  client_full_name: string;
  business_address: string;
  business_phone_number: string;
  client_phone_number: string;
  business_license_image?: string; // UUID of uploaded media file
}

export const organizationsApi = {
  async list(): Promise<OrganizationsResponse> {
    const res = await apiRequest<OrganizationsResponse>({
      method: 'GET',
      path: '/api/organizations/',
    });
    return res.data;
  },

  async create(data: CreateOrganizationRequest): Promise<Organization> {
    const res = await apiRequest<Organization>({
      method: 'POST',
      path: '/api/organizations/',
      body: data,
    });
    return res.data;
  },

  async get(id: string): Promise<Organization> {
    const res = await apiRequest<Organization>({
      method: 'GET',
      path: `/api/organizations/${id}/`,
    });
    return res.data;
  },
};
