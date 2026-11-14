import { Home, ShoppingCart, User, type LucideIcon } from "lucide-react";

export interface RouteMetadata {
  path: string;
  label: string;
  icon?: LucideIcon;
  showInTabBar: boolean;
}

/**
 * The static route table. `TabBar` renders every entry with
 * `showInTabBar: true`, so adding a tab means adding it here, nowhere else.
 */
export const routes: RouteMetadata[] = [
  { path: "/", label: "Home", icon: Home, showInTabBar: true },
  { path: "/cart", label: "Cart", icon: ShoppingCart, showInTabBar: true },
  { path: "/account", label: "Account", icon: User, showInTabBar: true },
];
