import { NextRequest, NextResponse } from 'next/server';
import { emailAnalysisSchema } from '../../../../types/schemas';
import { EmailAnalyzer } from '../../../../engine/analyzers/EmailAnalyzer';
import { HistoryStorage } from '../../../../storage/HistoryStorage';
import { APIError } from '../../../../errors';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validation
    const parsed = emailAnalysisSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation Error', details: parsed.error.format() },
        { status: 400 }
      );
    }

    console.log('[API] Received email analysis request');
    
    // Analyze
    const analyzer = new EmailAnalyzer();
    const startTime = Date.now();
    const report = await analyzer.analyze(parsed.data.content);
    report.processingTime = Date.now() - startTime;
    
    console.log('[API] Email analysis completed:', report.verdict);

    // Persist History
    await HistoryStorage.saveAnalysis({
      id: report.requestId!,
      requestId: report.requestId!,
      scanType: 'email',
      timestamp: report.timestamp!,
      riskScore: report.riskScore,
      verdict: report.verdict,
      summary: report.summary
    });

    return NextResponse.json(report);
    
  } catch (error: any) {
    console.error('[API] Error in email analysis:', error);
    
    if (error instanceof APIError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
