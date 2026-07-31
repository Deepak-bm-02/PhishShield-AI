import { env } from './env';

export const limitsConfig = {
  apiTimeoutMs: env.API_TIMEOUT,
  ocrTimeoutMs: env.OCR_TIMEOUT,
  maxUploadSizeBytes: env.MAX_UPLOAD_SIZE,
  rateLimit: {
    maxRequests: env.RATE_LIMIT_REQUESTS,
    windowSeconds: env.RATE_LIMIT_WINDOW,
  }
};
