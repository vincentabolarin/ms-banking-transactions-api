export interface Response<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  meta?: Record<string, any>;
}
