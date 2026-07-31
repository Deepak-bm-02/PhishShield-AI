import { ThreatReport } from '../../types';

export class ThreatFormatter {
  static format(
    scanType: 'email' | 'url' | 'screenshot' | 'qr',
    riskResult: { riskScore: number; severity: any; verdict: any; confidence: number },
    geminiData: any
  ): ThreatReport {
    return {
      requestId: crypto.randomUUID(),
      scanType,
      verdict: riskResult.verdict,
      severity: riskResult.severity,
      confidence: riskResult.confidence,
      riskScore: riskResult.riskScore,
      threatType: geminiData.threatType || 'Unknown',
      summary: geminiData.summary || 'Analysis complete.',
      reasons: geminiData.reasons || [],
      indicators: geminiData.indicators || [],
      recommendations: geminiData.recommendations || [],
      preventionTips: geminiData.preventionTips || [],
      timestamp: new Date().toISOString()
    };
  }
}
