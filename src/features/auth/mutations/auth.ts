import { useMutation } from "@tanstack/react-query";
import { authStore } from "@/lib/auth/authStore";
import { queryClient } from "@/lib/query/queryClient";
import { AuthService } from "@/features/auth/api/authService";
import { isBuyerRole } from "@/features/auth/utils/roles";
import type {
  LoginPayload,
  RegisterPayload,
  ResendCodePayload,
  VerifyEmailPayload,
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
    mutationFn: (payload: VerifyEmailPayload) =>
      AuthService.verifyEmail(payload),
  });

export const useResendCode = () =>
  useMutation({
    mutationFn: (payload: ResendCodePayload) => AuthService.resendCode(payload),
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
