import { GeminiClient } from '../services/GeminiClient';
import { URLPromptBuilder } from '../prompts/URLPromptBuilder';
import { RiskEngine } from '../core/RiskEngine';
import { ThreatFormatter } from '../formatters/ThreatFormatter';
import { ThreatReport } from '../../types';
import { logger } from '../../lib/logger/logger';

export class URLAnalyzer {
  private geminiClient: GeminiClient;

  constructor() {
    this.geminiClient = new GeminiClient();
  }

  async analyze(url: string): Promise<ThreatReport> {
    const prompt = URLPromptBuilder.build(url);
    
    try {
      const geminiData = await this.geminiClient.generateJSON(prompt);
      const riskResult = RiskEngine.calculateRisk(geminiData);
      return ThreatFormatter.format('url', riskResult, geminiData);
    } catch (error: any) {
      logger.warn(`AI failed for URLAnalyzer, falling back to Rule Engine. Reason: ${error.message}`);
      return this.fallbackAnalysis(url);
    }
  }

  private fallbackAnalysis(url: string): ThreatReport {
    const lowerUrl = url.toLowerCase();
    
    // Deterministic Rule Engine for URL
    const hasSuspiciousLinks = /https?:\/\/(bit\.ly|tinyurl|t\.co|ow\.ly)/i.test(lowerUrl);
    const hasIPAddress = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/.test(lowerUrl);
    const hasBrandImpersonation = /paypal|login|update|secure|bank|microsoft|apple|google/i.test(lowerUrl) && !/paypal\.com|microsoft\.com|apple\.com|google\.com/.test(lowerUrl);
    
    const isPhishing = hasSuspiciousLinks || hasIPAddress || hasBrandImpersonation;
    
    const fallbackData = {
      hasMaliciousLinks: hasSuspiciousLinks || hasIPAddress,
      hasUrgency: false,
      isBrandImpersonation: hasBrandImpersonation,
      threatType: isPhishing ? 'Phishing' : 'None',
      summary: isPhishing 
        ? 'Local Rule Engine detected suspicious domain patterns commonly used in phishing.'
        : 'Local Rule Engine found no obvious malicious URL patterns.',
      reasons: [] as string[],
      indicators: [] as { type: string, description: string }[],
      recommendations: ['Do not enter credentials on this site'],
      preventionTips: []
    };
    
    if (hasSuspiciousLinks) fallbackData.reasons.push('Uses a URL shortener which hides the destination');
    if (hasIPAddress) fallbackData.reasons.push('Uses a raw IP address instead of a domain name');
    if (hasBrandImpersonation) fallbackData.reasons.push('Contains brand names but does not match the official domain');

    const riskResult = RiskEngine.calculateRisk(fallbackData);
    const report = ThreatFormatter.format('url', riskResult, fallbackData);
    
    report.confidence = 0.3;
    report.summary = `[RULE ENGINE FALLBACK - AI UNAVAILABLE] ${fallbackData.summary}`;
    
    return report;
  }
}
