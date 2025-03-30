import { Response } from "../interfaces/response";

class ResponseHandler<T> implements Response<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  meta?: Record<string, any>;

  constructor(
    success: boolean,
    message: string,
    data?: T,
    error?: string,
    meta?: Record<string, any>
  ) {
    this.success = success;
    this.message = message;
    if (data) this.data = data;
    if (error) this.error = error;
    if (meta) this.meta = meta;
  }
}

class SuccessResponse<T> extends ResponseHandler<T> {
  constructor(message: string, data?: T, meta?: Record<string, any>) {
    super(true, message, data, null, meta);
  }
}

class ErrorResponse<T> extends ResponseHandler<T> {
  constructor(message: string, error?: string, meta?: Record<string, any>) {
    super(false, message, null, error, meta);
  }
}

export { SuccessResponse, ErrorResponse };
