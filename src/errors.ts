export class TsukyioError extends Error {
  public statusCode?: number;
  public details?: unknown;

  constructor(message: string, statusCode?: number, details?: unknown) {
    super(message);
    this.name = "TsukyioError";
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, TsukyioError.prototype);
  }
}

export class AuthenticationError extends TsukyioError {
  constructor(message = "Invalid or missing Tsukyio API Key / Access Token") {
    super(message, 401);
    this.name = "AuthenticationError";
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

export class RateLimitError extends TsukyioError {
  public retryAfter?: number;

  constructor(message = "Rate limit exceeded", retryAfter?: number) {
    super(message, 429);
    this.name = "RateLimitError";
    this.retryAfter = retryAfter;
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}

export class NotFoundError extends TsukyioError {
  constructor(message = "Resource not found") {
    super(message, 404);
    this.name = "NotFoundError";
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class ValidationError extends TsukyioError {
  constructor(message = "Validation error in request parameters", details?: unknown) {
    super(message, 400, details);
    this.name = "ValidationError";
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class ServerError extends TsukyioError {
  constructor(message = "Internal server error occurred", statusCode = 500, details?: unknown) {
    super(message, statusCode, details);
    this.name = "ServerError";
    Object.setPrototypeOf(this, ServerError.prototype);
  }
}

export class TaskTimeoutError extends TsukyioError {
  constructor(message = "Toolkit background task timed out before completion") {
    super(message, 408);
    this.name = "TaskTimeoutError";
    Object.setPrototypeOf(this, TaskTimeoutError.prototype);
  }
}

