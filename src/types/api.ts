/** The API's success envelope: `{ success, message?, data, meta? }`. */
export interface ApiSuccess<T, M = undefined> {
  success: true;
  message?: string;
  data: T;
  meta: M;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** The API's error envelope. Validation errors list each field in `details`. */
export interface ApiErrorBody {
  success: false;
  error: {
    statusCode: number;
    code: string;
    message: string;
    details?: unknown;
  };
}
