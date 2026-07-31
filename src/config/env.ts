import { z } from 'zod';

const envSchema = z.object({
  GEMINI_API_KEY: z.string().min(1, 'GEMINI_API_KEY is required').default('dummy_key_for_build'),
  NEXT_PUBLIC_APP_NAME: z.string().default('PhishShield AI'),
  NEXT_PUBLIC_APP_VERSION: z.string().default('1.0.0'),
  NEXT_PUBLIC_DEMO_MODE: z.string().transform(v => v === 'true').default('true'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  API_TIMEOUT: z.string().transform(Number).default('15000'),
  OCR_TIMEOUT: z.string().transform(Number).default('30000'),
  MAX_UPLOAD_SIZE: z.string().transform(Number).default('10485760'),
  RATE_LIMIT_REQUESTS: z.string().transform(Number).default('50'),
  RATE_LIMIT_WINDOW: z.string().transform(Number).default('60'),
  ENABLE_ANALYTICS: z.string().transform(v => v === 'true').default('true'),
  ENABLE_EXPORTS: z.string().transform(v => v === 'true').default('true'),
  ENABLE_HEALTH_ENDPOINTS: z.string().transform(v => v === 'true').default('true'),
  ENABLE_LOGGING: z.string().transform(v => v === 'true').default('true'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format());
  throw new Error('Invalid environment variables');
}

export const env = _env.data;
