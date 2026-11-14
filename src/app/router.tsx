import { createBrowserRouter } from "react-router";

import AppLayout from "@/app/AppLayout";
import RouteErrorBoundary from "@/app/RouteErrorBoundary";
import Home from "@/pages/Home";
import Cart from "@/pages/Cart";
import Account from "@/pages/Account";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    // Also renders for unmatched paths, as the 404 screen.
    errorElement: <RouteErrorBoundary />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/cart", element: <Cart /> },
      { path: "/account", element: <Account /> },
    ],
  },
]);

export default router;
