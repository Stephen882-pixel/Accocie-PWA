interface AppConfig {
  name: string;
  env: "development" | "staging" | "production";
  isProduction: boolean;
}

export const appConfig: AppConfig = {
  name: import.meta.env.VITE_ACOCIE_APP_NAME ?? "Acocie Stores",
  env: (import.meta.env.VITE_ACOCIE_APP_ENV ??
    "development") as AppConfig["env"],
  isProduction: import.meta.env.VITE_ACOCIE_APP_ENV === "production",
};
