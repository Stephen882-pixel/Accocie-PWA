import type { AuthUser } from "@/lib/auth/authStore";

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface VerifyEmailPayload {
  email: string;
  otpCode: string;
}

export interface ResendCodePayload {
  email: string;
  purpose: "signup" | "password_reset";
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}
