import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { authStore, useIsSignedIn } from "@/lib/auth/authStore";
import { AuthService } from "@/features/auth/api/authService";
import { isBuyerRole } from "@/features/auth/utils/roles";

/**
 * Keeps the stored user in step with the server: names, and above all the
 * role. A customer whose vendor application was approved since they last
 * signed in becomes a vendor, and is moved to the Seller Dashboard screen.
 * Runs on open and whenever the app regains focus (TanStack Query's default).
 */
export const useSessionSync = () => {
  const isSignedIn = useIsSignedIn();
  const navigate = useNavigate();

  const { data: profile } = useQuery({
    queryKey: ["auth", "profile"],
    queryFn: AuthService.getProfile,
    enabled: isSignedIn,
  });

  useEffect(() => {
    if (!profile) return;

    if (!isBuyerRole(profile.role)) {
      authStore.getState().clearSession();
      navigate("/seller-account", {
        replace: true,
        state: { firstName: profile.firstName, role: profile.role },
      });
      return;
    }

    const { id, firstName, lastName, email, role, isVerified } = profile;
    authStore
      .getState()
      .updateUser({ id, firstName, lastName, email, role, isVerified });
  }, [profile, navigate]);
};
