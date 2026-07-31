export class APIError extends Error {
  constructor(public message: string, public statusCode: number = 500) {
    super(message);
    this.name = 'APIError';
  }
}

export class ValidationError extends APIError {
  constructor(public message: string) {
    super(message, 400);
    this.name = 'ValidationError';
  }
}

export class AIServiceError extends APIError {
  constructor(public message: string) {
    super(message, 502); // Bad Gateway
    this.name = 'AIServiceError';
  }
}

export class StorageError extends APIError {
  constructor(public message: string) {
    super(message, 500);
    this.name = 'StorageError';
  }
}
