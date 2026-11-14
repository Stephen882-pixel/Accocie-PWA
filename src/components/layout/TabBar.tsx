import { NavLink, useLocation } from "react-router";
import { routes } from "@/config/routes";

const tabs = routes.filter((route) => route.showInTabBar);

/** Bottom navigation. Destinations come from `config/routes.ts`. */
const TabBar = () => {
  const { pathname } = useLocation();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-grey-300 bg-background pb-[env(safe-area-inset-bottom)]">
      <div className="shell-column flex h-(--tabbar-h) items-stretch">
        {tabs.map(({ path, label, icon: Icon, alsoActiveOn }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/"}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center justify-center gap-1 text-xs font-medium ${
                isActive || alsoActiveOn?.some((p) => pathname.startsWith(p))
                  ? "text-primary"
                  : "text-grey-700"
              }`
            }
          >
            {Icon ? <Icon size={22} aria-hidden="true" /> : null}
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default TabBar;
