import { env } from './env';

export const loggingConfig = {
  level: env.LOG_LEVEL,
  enabled: env.ENABLE_LOGGING,
};
