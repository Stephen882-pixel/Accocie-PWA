interface ApiConfig {
  baseUrl: string;
  timeout: number;
}

export const apiConfig: ApiConfig = {
  // Relative by default: the Vite server passes /api to the backend (see
  // vite.config.ts). Set VITE_ACOCIE_API_URL for a deployed API.
  baseUrl: import.meta.env.VITE_ACOCIE_API_URL ?? "/api/v1",
  timeout: import.meta.env.VITE_ACOCIE_API_TIMEOUT
    ? parseInt(import.meta.env.VITE_ACOCIE_API_TIMEOUT, 10)
    : 10000,
};
