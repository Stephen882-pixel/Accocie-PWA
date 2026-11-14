/** The API's success envelope: `{ success, message?, data }`. */
export interface ApiSuccess<T> {
  success: true;
  message?: string;
  data: T;
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
