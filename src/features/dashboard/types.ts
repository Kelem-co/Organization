export interface School {
  id: string;
  name: string;
  logo: string;
  logoMediaId?: string | null;
  location: string;
  studentCount: number;
  staffCount: number;
  description?: string;
  website?: string;
  organizationId?: string;
  contactEmail?: string;
  contactPhone?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface Branch {
  id: string;
  schoolId: string;
  name: string;
  address: string;
  city: string;
  region?: string;
  contactPhone?: string;
  contactEmail?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  studentCount: number;
  teacherCount: number;
  capacity: number;
  performance: number[]; // Academic performance over time
}

export interface Admin {
  id: string;
  branchId: string;
  name: string;
  role: string;
  status: 'active' | 'inactive';
  email: string;
  lastLogin?: string;
}
