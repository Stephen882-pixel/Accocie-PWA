import { api } from "@/lib/api/client";
import type { ApiSuccess } from "@/types/api";
import type {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  ResendCodePayload,
  VerifyEmailPayload,
} from "@/features/auth/types/auth";

export const AuthService = {
  register: async (payload: RegisterPayload) => {
    await api.post("/auth/register", payload);
  },

  // Verifies the account only; the API returns no tokens, so the user signs in next.
  verifyEmail: async (payload: VerifyEmailPayload) => {
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
};
