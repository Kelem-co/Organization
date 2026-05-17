export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  father_name: string;
  grandfather_name: string;
  phone_number?: string;
  address?: string;
}

export interface JWTResponse {
  access: string;
  refresh: string;
}

export interface ApiUser {
  id: string;
  email: string;
  name: string;
  father_name: string;
  grandfather_name: string;
  phone_number: string;
  address: string;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface RefreshTokenRequest {
  refresh: string;
}

export interface RefreshTokenResponse {
  access: string;
}

export interface ActivationRequest {
  uid: string;
  token: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirmRequest {
  uid: string;
  token: string;
  new_password: string;
}
