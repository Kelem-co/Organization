export interface ApiBranch {
  id: string;
  organization: string;
  school: string;
  name: string;
  address: string;
  city: string;
  region: string;
  contact_phone: string;
  contact_email: string;
  status: 'ACTIVE' | 'INACTIVE';
  created_at: string;
  updated_at: string;
}

export interface CreateBranchRequest {
  organization: string;
  school: string;
  name: string;
  address: string;
  city: string;
  region: string;
  contact_phone: string;
  contact_email: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface UpdateBranchRequest extends Partial<CreateBranchRequest> {}

export interface BranchesListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ApiBranch[];
}
