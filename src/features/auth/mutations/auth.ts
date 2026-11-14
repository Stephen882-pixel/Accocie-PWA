import { useMutation } from "@tanstack/react-query";
import { authStore } from "@/lib/auth/authStore";
import { queryClient } from "@/lib/query/queryClient";
import { AuthService } from "@/features/auth/api/authService";
import { isBuyerRole } from "@/features/auth/utils/roles";
import type {
  ChangePasswordPayload,
  CodePayload,
  LoginPayload,
  RegisterPayload,
  ResendCodePayload,
  ResetPasswordPayload,
} from "@/features/auth/types/auth";

/**
 * Signs in. Only buyer roles keep the session; a vendor or admin's session is
 * ended straight away and `isBuyer: false` tells the page to send them to
 * the Seller Dashboard screen.
 */
export const useLogin = () =>
  useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const session = await AuthService.login(payload);

      if (!isBuyerRole(session.user.role)) {
        AuthService.logout(session.refreshToken, session.accessToken).catch(
          () => {},
        );
        return { user: session.user, isBuyer: false };
      }

      authStore.getState().setSession(session);
      return { user: session.user, isBuyer: true };
    },
  });

export const useRegister = () =>
  useMutation({
    mutationFn: (payload: RegisterPayload) => AuthService.register(payload),
  });

export const useVerifyEmail = () =>
  useMutation({
    mutationFn: (payload: CodePayload) => AuthService.verifyEmail(payload),
  });

export const useResendCode = () =>
  useMutation({
    mutationFn: (payload: ResendCodePayload) => AuthService.resendCode(payload),
  });

export const useForgotPassword = () =>
  useMutation({
    mutationFn: (email: string) => AuthService.forgotPassword(email),
  });

export const useVerifyResetCode = () =>
  useMutation({
    mutationFn: (payload: CodePayload) => AuthService.verifyResetCode(payload),
  });

export const useResetPassword = () =>
  useMutation({
    mutationFn: (payload: ResetPasswordPayload) =>
      AuthService.resetPassword(payload),
  });

/**
 * Changing the password signs the account out everywhere (the API revokes
 * every refresh token), so sign straight back in here with the new password
 * to keep this device's session.
 */
export const useChangePassword = () =>
  useMutation({
    mutationFn: async (payload: ChangePasswordPayload) => {
      await AuthService.changePassword(payload);

      const { user } = authStore.getState();
      if (!user) return;

      const session = await AuthService.login({
        email: user.email,
        password: payload.newPassword,
      });
      authStore.getState().setSession(session);
    },
  });

/** Signs out locally even if the server call fails: the user asked to leave. */
export const useSignOut = () =>
  useMutation({
    mutationFn: async () => {
      const { refreshToken } = authStore.getState();
      if (refreshToken) {
        await AuthService.logout(refreshToken).catch(() => {});
      }
      authStore.getState().clearSession();
      queryClient.clear();
    },
  });
