import { Outlet } from "react-router";
import NavBar from "@/app/NavBar";
import TabBar from "@/components/layout/TabBar";
import { useSessionSync } from "@/features/auth/hooks/useSessionSync";
import { useGuestCartMerge } from "@/features/cart/hooks/useGuestCartMerge";
import { useCart } from "@/features/cart/queries/cart";

/**
 * The app shell: fixed NavBar on top, fixed TabBar below, and the page
 * scrolling between them. The padding reserves exactly the bars' space.
 */
const AppLayout = () => {
  useSessionSync();
  useGuestCartMerge();
  const { data: cart } = useCart();

  return (
    <div className="min-h-svh bg-background">
      <NavBar />
      <main className="shell-column pt-(--nav-h) pb-[calc(var(--tabbar-h)+env(safe-area-inset-bottom))]">
        <Outlet />
      </main>
      <TabBar badges={{ "/cart": cart?.itemCount }} />
    </div>
  );
};

export default AppLayout;
