import axios from "axios";
import config from "@/config/index";

/**
 * The one HTTP client. Feature services (`features/<domain>/api`) import
 * this instead of calling axios directly, so auth headers and token refresh
 * can be added here once auth lands, without touching any feature.
 */
const api = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
});

export { api };
