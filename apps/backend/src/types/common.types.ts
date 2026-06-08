export interface ApiResponse<T> {
  message: string;
  data?: T;
  error?: string | string[];
}

export interface BackendFieldError {
  field: string;
  messages: string|undefined;
}
