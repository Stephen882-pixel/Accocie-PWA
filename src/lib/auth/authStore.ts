import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isVerified: boolean;
}

interface Session {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  setSession: (session: Session) => void;
  setAccessToken: (accessToken: string) => void;
  updateUser: (user: AuthUser) => void;
  clearSession: () => void;
}

/**
 * The signed-in session, persisted so the app opens signed in. Read it with
 * the hooks below in components, and with `authStore.getState()` elsewhere
 * (the HTTP client).
 */
export const authStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setSession: ({ user, accessToken, refreshToken }) =>
        set({ user, accessToken, refreshToken }),
      setAccessToken: (accessToken) => set({ accessToken }),
      updateUser: (user) => set({ user }),
      clearSession: () =>
        set({ user: null, accessToken: null, refreshToken: null }),
    }),
    { name: "acocie-pwa-auth" },
  ),
);

export const useAuthUser = () => authStore((state) => state.user);

export const useIsSignedIn = () =>
  authStore((state) => state.accessToken !== null);
