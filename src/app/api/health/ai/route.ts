import { NextRequest } from 'next/server';
import { createRequestContext } from '../../../../lib/requestContext';
import { successResponse } from '../../../../lib/api/response';
import { SERVICE_STATUS } from '../../../../constants/status';

export async function GET(req: NextRequest) {
  const ctx = createRequestContext(req);
  
  // Mock checking AI service
  const health = {
    service: 'Gemini AI',
    status: SERVICE_STATUS.HEALTHY,
    latency: '< 200ms',
    timestamp: new Date().toISOString(),
  };

  return successResponse(health, ctx);
}
