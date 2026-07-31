import { NextRequest } from 'next/server';
import { emailAnalysisSchema } from '../../../../types/schemas';
import { EmailAnalyzer } from '../../../../engine/analyzers/EmailAnalyzer';
import { HistoryStorage } from '../../../../storage/HistoryStorage';
import { APIError } from '../../../../errors';
import { createRequestContext, getDuration } from '../../../../lib/requestContext';
import { successResponse, failureResponse } from '../../../../lib/api/response';
import { logger } from '../../../../lib/logger/logger';
import { MetricsService } from '../../../../services/MetricsService';

export async function POST(req: NextRequest) {
  const ctx = createRequestContext(req);
  MetricsService.recordRequest();

  try {
    const body = await req.json();
    
    const parsed = emailAnalysisSchema.safeParse(body);
    if (!parsed.success) {
      logger.warn('Validation Error', ctx, parsed.error.format());
      return failureResponse('Validation Error', 400, ctx, parsed.error.format());
    }

    logger.info('Received email analysis request', ctx);
    
    const analyzer = new EmailAnalyzer();
    const report = await analyzer.analyze(parsed.data.content);
    report.processingTime = getDuration(ctx);
    
    logger.info(`Email analysis completed: ${report.verdict}`, ctx);

    await HistoryStorage.saveAnalysis({
      id: report.requestId || ctx.requestId,
      requestId: report.requestId || ctx.requestId,
      scanType: 'email',
      timestamp: report.timestamp || ctx.timestamp,
      riskScore: report.riskScore,
      verdict: report.verdict,
      summary: report.summary
    });

    MetricsService.recordScan(getDuration(ctx), true);
    return successResponse(report, ctx);
    
  } catch (error: any) {
    MetricsService.recordScan(getDuration(ctx), false);
    logger.error('Error in email analysis', ctx, error);
    
    if (error instanceof APIError) {
      return failureResponse(error.message, error.statusCode, ctx);
    }
    
    return failureResponse('Internal Server Error', 500, ctx);
  }
}
