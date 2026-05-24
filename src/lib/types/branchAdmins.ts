export interface BranchAdmin {
  id: string;
  organization: string;
  branch: string;
  user: string;
  email: string;
  name: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  role_title: string;
  qualification: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

export interface InviteBranchAdminRequest {
  email: string;
  name: string;
  father_name: string;
  grandfather_name: string;
  role_title: string;
  branch: string; // Branch ID
}

export interface BranchAdminsListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: BranchAdmin[];
}
