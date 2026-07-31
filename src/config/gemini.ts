import { env } from './env';

export const GEMINI_CONFIG = {
  apiKey: env.GEMINI_API_KEY,
  primaryModel: 'gemini-3.5-flash',
  fallbackModel: 'gemini-3.5-flash-lite',
  timeout: 15000,
  retries: 2,
  temperature: 0.2,
  maxOutputTokens: 2048,
};

// Backwards compatibility alias
export const geminiConfig = GEMINI_CONFIG;
