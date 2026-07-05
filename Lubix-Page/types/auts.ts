export interface LoginRequest {
  email: string;
  password?: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  id: string | number;
  Nombre: string;
  email: string;
  role: string;
}

export interface VerifyCodeRequest {
  email: string;
  code: string;
}

export interface ResendCodeRequest {
  email: string;
}