interface ApiConfig {
  baseUrl: string;
  timeout: number;
}

export const apiConfig: ApiConfig = {
  baseUrl:
    import.meta.env.VITE_ACOCIE_API_URL ?? "http://localhost:5002/api/v1",
  timeout: import.meta.env.VITE_ACOCIE_API_TIMEOUT
    ? parseInt(import.meta.env.VITE_ACOCIE_API_TIMEOUT, 10)
    : 10000,
};
