import { NextRequest } from 'next/server';
import { qrAnalysisSchema } from '../../../../types/schemas';
import { QRAnalyzer } from '../../../../engine/analyzers/QRAnalyzer';
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
    
    const parsed = qrAnalysisSchema.safeParse(body);
    if (!parsed.success) {
      logger.warn('Validation Error', ctx, parsed.error.format());
      return failureResponse('Validation Error', 400, ctx, parsed.error.format());
    }

    logger.info(`Received qr analysis request. Image length: ${parsed.data.image.length} characters.`, ctx);
    
    const analyzer = new QRAnalyzer();
    const report = await analyzer.analyze(parsed.data.image);
    report.processingTime = getDuration(ctx);
    
    logger.info(`QR analysis completed: ${report.verdict}`, ctx);

    await HistoryStorage.saveAnalysis({
      id: report.requestId || ctx.requestId,
      requestId: report.requestId || ctx.requestId,
      scanType: 'qr',
      timestamp: report.timestamp || ctx.timestamp,
      riskScore: report.riskScore,
      verdict: report.verdict,
      summary: report.summary
    });

    MetricsService.recordScan(getDuration(ctx), true);
    return successResponse(report, ctx);
    
  } catch (error: any) {
    MetricsService.recordScan(getDuration(ctx), false);
    logger.error('Error in qr analysis', ctx, error);
    
    if (error instanceof APIError) {
      return failureResponse(error.message, error.statusCode, ctx);
    }
    
    return failureResponse('Internal Server Error', 500, ctx);
  }
}
