import { Navigate, Outlet, useLocation } from "react-router";
import { useIsSignedIn } from "@/lib/auth/authStore";

/**
 * Wraps the sign-in screens. A signed-in user is sent on, to where they were
 * heading before sign-in (`state.from`) or home. This is also what moves the
 * user off the Sign in screen the moment a login succeeds.
 */
const GuestLayout = () => {
  const isSignedIn = useIsSignedIn();
  const location = useLocation();

  if (isSignedIn) {
    const from = (location.state as { from?: string } | null)?.from ?? "/";
    return <Navigate to={from} replace />;
  }

  return <Outlet />;
};

export default GuestLayout;
