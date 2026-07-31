import { NextRequest } from 'next/server';
import { appConfig } from '../../../config';
import { createRequestContext } from '../../../lib/requestContext';
import { successResponse } from '../../../lib/api/response';
import { MetricsService } from '../../../services/MetricsService';

export async function GET(req: NextRequest) {
  const ctx = createRequestContext(req);
  
  if (!appConfig.enableHealthEndpoints) {
    return new Response('Not Found', { status: 404 });
  }

  const health = {
    status: 'Healthy',
    version: appConfig.version,
    environment: appConfig.environment,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    metrics: MetricsService.getStats(),
  };

  return successResponse(health, ctx);
}
