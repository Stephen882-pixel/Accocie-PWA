interface AppConfig {
  name: string;
  env: "development" | "staging" | "production";
  isProduction: boolean;
  /** Where vendors and admins are sent when they sign in here. */
  sellerDashboardUrl: string;
}

export const appConfig: AppConfig = {
  name: import.meta.env.VITE_ACOCIE_APP_NAME ?? "Acocie Stores",
  env: (import.meta.env.VITE_ACOCIE_APP_ENV ??
    "development") as AppConfig["env"],
  isProduction: import.meta.env.VITE_ACOCIE_APP_ENV === "production",
  sellerDashboardUrl:
    import.meta.env.VITE_ACOCIE_SELLER_DASHBOARD_URL ?? "http://localhost:3001",
};
