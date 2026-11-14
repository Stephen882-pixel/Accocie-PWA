import { Outlet } from "react-router";
import NavBar from "@/app/NavBar";
import TabBar from "@/components/layout/TabBar";
import { useSessionSync } from "@/features/auth/hooks/useSessionSync";

/**
 * The app shell: fixed NavBar on top, fixed TabBar below, and the page
 * scrolling between them. The padding reserves exactly the bars' space.
 */
const AppLayout = () => {
  useSessionSync();

  return (
    <div className="min-h-svh bg-background">
      <NavBar />
      <main className="shell-column pt-(--nav-h) pb-[calc(var(--tabbar-h)+env(safe-area-inset-bottom))]">
        <Outlet />
      </main>
      <TabBar />
    </div>
  );
};

export default AppLayout;
