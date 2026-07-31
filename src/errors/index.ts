export enum ErrorCode {
  INVALID_INPUT = 'INVALID_INPUT',
  INVALID_URL = 'INVALID_URL',
  INVALID_IMAGE = 'INVALID_IMAGE',
  INVALID_QR = 'INVALID_QR',
  OCR_FAILED = 'OCR_FAILED',
  QR_FAILED = 'QR_FAILED',
  AI_TIMEOUT = 'AI_TIMEOUT',
  RATE_LIMITED = 'RATE_LIMITED',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  CONFIGURATION_ERROR = 'CONFIGURATION_ERROR',
  MODEL_NOT_FOUND = 'MODEL_NOT_FOUND',
  MODEL_UNAVAILABLE = 'MODEL_UNAVAILABLE',
  INVALID_JSON = 'INVALID_JSON',
  SAFETY_BLOCK = 'SAFETY_BLOCK',
  AUTH_FAILED = 'AUTH_FAILED',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export class APIError extends Error {
  constructor(public message: string, public statusCode: number = 500, public code: ErrorCode = ErrorCode.INTERNAL_ERROR) {
    super(message);
    this.name = 'APIError';
  }
}

export class ValidationError extends APIError {
  constructor(public message: string) {
    super(message, 400, ErrorCode.INVALID_INPUT);
    this.name = 'ValidationError';
  }
}

export class AIServiceError extends APIError {
  constructor(
    public message: string,
    public code: ErrorCode = ErrorCode.UNKNOWN_ERROR,
    public statusCode: number = 502,
    public retryable: boolean = false,
    public source: string = 'Gemini'
  ) {
    super(message, statusCode, code);
    this.name = 'AIServiceError';
  }
}

export class StorageError extends APIError {
  constructor(public message: string) {
    super(message, 500, ErrorCode.INTERNAL_ERROR);
    this.name = 'StorageError';
  }
}
