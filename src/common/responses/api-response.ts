export class APIResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  timestamp?: Date;

  constructor(success: boolean, message?: string, data?: T, error?: string) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.error = error;
    this.timestamp = new Date();
  }

  static success<T>(data?: T, message?: string): APIResponse<T> {
    return new APIResponse<T>(true, message, data);
  }

  static failure<T>(message: string, error?: string): APIResponse<T> {
    return new APIResponse<T>(false, message, undefined, error);
  }
}
