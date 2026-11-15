import { NavLink, useLocation } from "react-router";
import { routes } from "@/config/routes";

const tabs = routes.filter((route) => route.showInTabBar);

type TabBarProps = {
  /** A count to show on a tab, by path, e.g. `{ "/cart": 3 }`. */
  badges?: Record<string, number | undefined>;
};

/** Bottom navigation. Destinations come from `config/routes.ts`. */
const TabBar = ({ badges = {} }: TabBarProps) => {
  const { pathname } = useLocation();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-grey-300 bg-background pb-[env(safe-area-inset-bottom)]">
      <div className="shell-column flex h-(--tabbar-h) items-stretch">
        {tabs.map(({ path, label, icon: Icon, alsoActiveOn }) => {
          const badge = badges[path];
          return (
            <NavLink
              key={path}
              to={path}
              end={path === "/"}
              aria-label={badge ? `${label}, ${badge} items` : undefined}
              className={({ isActive }) =>
                `flex flex-1 flex-col items-center justify-center gap-1 text-xs font-medium ${
                  isActive || alsoActiveOn?.some((p) => pathname.startsWith(p))
                    ? "text-primary"
                    : "text-grey-700"
                }`
              }
            >
              <span className="relative">
                {Icon ? <Icon size={22} aria-hidden="true" /> : null}
                {badge ? (
                  <span
                    aria-hidden="true"
                    className="absolute -top-1.5 -right-2.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-white"
                  >
                    {badge > 99 ? "99+" : badge}
                  </span>
                ) : null}
              </span>
              {label}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default TabBar;
