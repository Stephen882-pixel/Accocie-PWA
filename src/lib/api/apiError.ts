import axios from "axios";
import type { ApiErrorBody } from "@/types/api";

export class ApiError extends Error {
  status?: number;
  /** The server's machine-readable code, e.g. `EMAIL_NOT_VERIFIED`. */
  code?: string;
  details?: unknown;

  constructor(
    message: string,
    options: { status?: number; code?: string; details?: unknown } = {},
  ) {
    super(message);
    this.name = "ApiError";
    this.status = options.status;
    this.code = options.code;
    this.details = options.details;
  }
}

/** Turns anything a request can throw into an `ApiError` with copy fit for the user. */
export const toApiError = (error: unknown): ApiError => {
  if (error instanceof ApiError) return error;

  if (axios.isAxiosError<ApiErrorBody>(error)) {
    const body = error.response?.data?.error;

    if (body) {
      // A validation error's useful text is per field; show the first one.
      const fieldMessage = Array.isArray(body.details)
        ? (body.details[0] as { message?: string } | undefined)?.message
        : undefined;

      return new ApiError(fieldMessage ?? body.message, {
        status: body.statusCode,
        code: body.code,
        details: body.details,
      });
    }

    if (!error.response) {
      return new ApiError(
        "We could not reach Acocie. Check your connection and try again.",
        { code: "NETWORK_ERROR" },
      );
    }
  }

  return new ApiError("Something went wrong. Please try again.");
};
