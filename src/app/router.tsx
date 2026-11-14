import { createBrowserRouter } from "react-router";

import AppLayout from "@/app/AppLayout";
import GuestLayout from "@/app/GuestLayout";
import RequireAuth from "@/app/RequireAuth";
import RouteErrorBoundary from "@/app/RouteErrorBoundary";
import Home from "@/pages/Home";
import Cart from "@/pages/Cart";
import Account from "@/pages/Account";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import VerifyEmail from "@/pages/VerifyEmail";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetCode from "@/pages/ResetCode";
import ResetPassword from "@/pages/ResetPassword";
import ChangePassword from "@/pages/ChangePassword";
import SellerAccount from "@/pages/SellerAccount";

const router = createBrowserRouter([
  {
    // One root so every path, matched or not, shares the error screen.
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        // The app with its bars. Guests can browse; sign-in is on Account.
        element: <AppLayout />,
        children: [
          { path: "/", element: <Home /> },
          { path: "/cart", element: <Cart /> },
          { path: "/account", element: <Account /> },
        ],
      },
      {
        // Sign-in screens. A signed-in user is redirected out of them.
        element: <GuestLayout />,
        children: [
          { path: "/login", element: <Login /> },
          { path: "/register", element: <Register /> },
          { path: "/verify-email", element: <VerifyEmail /> },
          { path: "/forgot-password", element: <ForgotPassword /> },
          { path: "/reset-code", element: <ResetCode /> },
          { path: "/reset-password", element: <ResetPassword /> },
        ],
      },
      {
        // Screens that need a session. Signed-out users go to Sign in first.
        element: <RequireAuth />,
        children: [{ path: "/account/password", element: <ChangePassword /> }],
      },
      { path: "/seller-account", element: <SellerAccount /> },
    ],
  },
]);

export default router;
