import axios, { type InternalAxiosRequestConfig } from "axios";
import config from "@/config/index";
import { toApiError } from "@/lib/api/apiError";
import { authStore } from "@/lib/auth/authStore";
import type { ApiSuccess } from "@/types/api";

/**
 * The one HTTP client. Feature services (`features/<domain>/api`) import
 * this instead of calling axios directly. It attaches the access token,
 * refreshes it once on a 401, and rejects with `ApiError`.
 */
const api = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
});

api.interceptors.request.use((requestConfig) => {
  const { accessToken } = authStore.getState();

  if (accessToken && !requestConfig.headers.has("Authorization")) {
    requestConfig.headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return requestConfig;
});

// Shared so that several requests failing at once trigger one refresh.
let refreshing: Promise<string | null> | null = null;

const refreshAccessToken = () => {
  refreshing ??= (async () => {
    const { refreshToken } = authStore.getState();
    if (!refreshToken) return null;

    try {
      // Plain axios, not `api`: a failed refresh must not trigger another.
      const response = await axios.post<ApiSuccess<{ accessToken: string }>>(
        `${config.api.baseUrl}/auth/refresh-token`,
        { refreshToken },
        { timeout: config.api.timeout },
      );
      const { accessToken } = response.data.data;
      authStore.getState().setAccessToken(accessToken);
      return accessToken;
    } catch (error) {
      // Only a rejected refresh token ends the session. A network failure
      // leaves it intact so the next request can try again.
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        authStore.getState().clearSession();
      }
      return null;
    } finally {
      refreshing = null;
    }
  })();

  return refreshing;
};

type RetriableConfig = InternalAxiosRequestConfig & { _retried?: boolean };

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config as RetriableConfig | undefined;

    // A 401 on a request sent without a token is a wrong password, not an
    // expired session, so the caller gets the server's message as is.
    const sentWithToken = original?.headers.has("Authorization");

    if (
      error.response?.status === 401 &&
      original &&
      sentWithToken &&
      !original._retried
    ) {
      original._retried = true;
      const accessToken = await refreshAccessToken();

      if (accessToken) {
        original.headers.set("Authorization", `Bearer ${accessToken}`);
        return api(original);
      }
    }

    return Promise.reject(toApiError(error));
  },
);

export { api };
