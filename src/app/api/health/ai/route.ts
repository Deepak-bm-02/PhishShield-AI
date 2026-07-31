import { NextRequest } from 'next/server';
import { createRequestContext } from '../../../../lib/requestContext';
import { successResponse, failureResponse } from '../../../../lib/api/response';
import { SERVICE_STATUS } from '../../../../constants/status';
import { GeminiClient } from '../../../../engine/services/GeminiClient';
import { GEMINI_CONFIG } from '../../../../config/gemini';

export async function GET(req: NextRequest) {
  const ctx = createRequestContext(req);
  
  const startTime = Date.now();
  try {
    const client = new GeminiClient();
    // Use the client to trigger a lightweight ping
    await client.generateJSON('Respond with strictly valid JSON: {"ping":"pong"}', 1);
    const latency = Date.now() - startTime;

    const health = {
      service: 'Gemini AI',
      status: SERVICE_STATUS.HEALTHY,
      sdk: '@google/generative-ai',
      model: GEMINI_CONFIG.primaryModel,
      latency: latency,
      fallbackAvailable: !!GEMINI_CONFIG.fallbackModel,
      lastSuccessfulRequest: new Date().toISOString(),
      connected: true
    };

    return successResponse(health, ctx);
  } catch (error: any) {
    const health = {
      service: 'Gemini AI',
      status: SERVICE_STATUS.WARNING || 'unhealthy',
      model: GEMINI_CONFIG.primaryModel,
      reason: error.message,
      connected: false
    };
    return failureResponse('AI Service Unavailable', 503, ctx, health);
  }
}
