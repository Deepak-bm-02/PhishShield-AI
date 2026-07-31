import { env } from './env';

export const appConfig = {
  name: env.NEXT_PUBLIC_APP_NAME,
  version: env.NEXT_PUBLIC_APP_VERSION,
  demoMode: env.NEXT_PUBLIC_DEMO_MODE,
  environment: env.NODE_ENV,
  enableHealthEndpoints: env.ENABLE_HEALTH_ENDPOINTS,
};
