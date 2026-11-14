interface ImportMetaEnv {
  readonly VITE_ACOCIE_APP_NAME?: string;
  readonly VITE_ACOCIE_APP_ENV?: "development" | "staging" | "production";
  readonly VITE_ACOCIE_API_URL?: string;
  readonly VITE_ACOCIE_API_TIMEOUT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
