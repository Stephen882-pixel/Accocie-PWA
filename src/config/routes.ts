import {
  Home,
  Package,
  ShoppingCart,
  User,
  type LucideIcon,
} from "lucide-react";

export interface RouteMetadata {
  path: string;
  label: string;
  icon?: LucideIcon;
  showInTabBar: boolean;
  /** Other paths under this tab, e.g. a product page under Home. */
  alsoActiveOn?: string[];
}

/**
 * The static route table. `TabBar` renders every entry with
 * `showInTabBar: true`, so adding a tab means adding it here, nowhere else.
 */
export const routes: RouteMetadata[] = [
  {
    path: "/",
    label: "Home",
    icon: Home,
    showInTabBar: true,
    alsoActiveOn: ["/products"],
  },
  { path: "/cart", label: "Cart", icon: ShoppingCart, showInTabBar: true },
  { path: "/orders", label: "Orders", icon: Package, showInTabBar: true },
  { path: "/account", label: "Account", icon: User, showInTabBar: true },
];
