export interface ApiSchool {
  id: string;
  organization: string;
  name: string;
  description: string;
  country: string;
  contact_email: string;
  contact_phone: string;
  logo: string | null;
  website: string;
  status: 'ACTIVE' | 'INACTIVE';
  created_at: string;
  updated_at: string;
}

export interface CreateSchoolRequest {
  organization: string;
  name: string;
  description?: string;
  country: string;
  contact_email: string;
  contact_phone?: string;
  logo?: string;
  website?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface UpdateSchoolRequest extends Omit<Partial<CreateSchoolRequest>, 'logo'> {
  logo?: string | null;
}

export interface SchoolsListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ApiSchool[];
}
