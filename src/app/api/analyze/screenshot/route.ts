import { NextRequest, NextResponse } from 'next/server';
import { screenshotAnalysisSchema } from '../../../../types/schemas';
import { ScreenshotAnalyzer } from '../../../../engine/analyzers/ScreenshotAnalyzer';
import { HistoryStorage } from '../../../../storage/HistoryStorage';
import { APIError } from '../../../../errors';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validation
    const parsed = screenshotAnalysisSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation Error', details: parsed.error.format() },
        { status: 400 }
      );
    }

    // Check size limit (e.g. 5MB base64 is roughly 6.8MB string)
    if (parsed.data.image.length > 7000000) {
      return NextResponse.json({ error: 'Image too large. Maximum size is 5MB.' }, { status: 413 });
    }

    console.log('[API] Received screenshot analysis request');
    
    // Analyze
    const analyzer = new ScreenshotAnalyzer();
    const startTime = Date.now();
    const report = await analyzer.analyze(parsed.data.image);
    report.processingTime = Date.now() - startTime;
    
    console.log('[API] Screenshot analysis completed:', report.verdict);

    // Persist History
    await HistoryStorage.saveAnalysis({
      id: report.requestId!,
      requestId: report.requestId!,
      scanType: 'screenshot',
      timestamp: report.timestamp!,
      riskScore: report.riskScore,
      verdict: report.verdict,
      summary: report.summary
    });

    return NextResponse.json(report);
    
  } catch (error: any) {
    console.error('[API] Error in screenshot analysis:', error);
    
    if (error instanceof APIError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
