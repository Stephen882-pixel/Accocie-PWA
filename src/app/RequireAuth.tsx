import { Navigate, Outlet, useLocation } from "react-router";
import { useIsSignedIn } from "@/lib/auth/authStore";

/** Wraps screens that need a session. Sign-in brings the user back here. */
const RequireAuth = () => {
  const isSignedIn = useIsSignedIn();
  const location = useLocation();

  if (!isSignedIn) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
};

export default RequireAuth;
