import { api } from "@/lib/api/client";
import type { AuthUser } from "@/lib/auth/authStore";
import type { ApiSuccess } from "@/types/api";
import type {
  ChangePasswordPayload,
  CodePayload,
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  ResendCodePayload,
  ResetPasswordPayload,
} from "@/features/auth/types/auth";

export const AuthService = {
  register: async (payload: RegisterPayload) => {
    await api.post("/auth/register", payload);
  },

  // Verifies the account only; the API returns no tokens, so the user signs in next.
  verifyEmail: async (payload: CodePayload) => {
    await api.post("/auth/verify-otp", payload);
  },

  resendCode: async (payload: ResendCodePayload) => {
    await api.post("/auth/resend-otp", payload);
  },

  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const response = await api.post<ApiSuccess<LoginResponse>>(
      "/auth/login",
      payload,
    );
    return response.data.data;
  },

  // `accessToken` is passed when ending a session that was never stored.
  logout: async (refreshToken: string, accessToken?: string) => {
    await api.post(
      "/auth/logout",
      { refreshToken },
      accessToken
        ? { headers: { Authorization: `Bearer ${accessToken}` } }
        : undefined,
    );
  },

  forgotPassword: async (email: string) => {
    await api.post("/auth/forgot-password", { email });
  },

  // Returns the short-lived token that reset-password requires.
  verifyResetCode: async (payload: CodePayload): Promise<string> => {
    const response = await api.post<ApiSuccess<{ resetToken: string }>>(
      "/auth/verify-reset-otp",
      payload,
    );
    return response.data.data.resetToken;
  },

  resetPassword: async (payload: ResetPasswordPayload) => {
    await api.post("/auth/reset-password", payload);
  },

  changePassword: async (payload: ChangePasswordPayload) => {
    await api.post("/auth/change-password", payload);
  },

  getProfile: async (): Promise<AuthUser> => {
    const response = await api.get<ApiSuccess<AuthUser>>("/users/profile");
    return response.data.data;
  },
};
