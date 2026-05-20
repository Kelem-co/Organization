export interface Organization {
  id: string;
  owner: string;
  name: string;
  trade_name: string;
  tin_number: string;
  license_no: string;
  client_full_name: string;
  business_address: string;
  business_phone_number: string;
  client_phone_number: string;
  business_license_image: string | null;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  verification_status: 'pending' | 'verified' | 'failed';
  verification_checked_at: string | null;
  verification_failure_reason: string | null;
  verification_match_source: string | null;
  verified_name: string | null;
  verified_license_no: string | null;
  verified_tin_number: string | null;
  requires_manual_verification: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrganizationsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Organization[];
}

export interface UpdateOrganizationRequest {
  name?: string;
  trade_name?: string;
  tin_number?: string;
  license_no?: string;
  client_full_name?: string;
  business_address?: string;
  business_phone_number?: string;
  client_phone_number?: string;
  business_license_image?: string | null; // UUID of uploaded media file
}
