export class ApiError extends Error {
  statuscode: number;
  errors?: unknown;
  constructor(statusCode: number, message: string, errors?: unknown) {
    super(message);
    this.statuscode = statusCode;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}
