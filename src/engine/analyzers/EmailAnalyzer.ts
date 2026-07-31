import { GeminiClient } from '../services/GeminiClient';
import { EmailPromptBuilder } from '../prompts/EmailPromptBuilder';
import { RiskEngine } from '../core/RiskEngine';
import { ThreatFormatter } from '../formatters/ThreatFormatter';
import { ThreatReport } from '../../types';
import { logger } from '../../lib/logger/logger';

export class EmailAnalyzer {
  private geminiClient: GeminiClient;

  constructor() {
    this.geminiClient = new GeminiClient();
  }

  async analyze(content: string): Promise<ThreatReport> {
    const prompt = EmailPromptBuilder.build(content);
    
    try {
      const geminiData = await this.geminiClient.generateJSON(prompt);
      const riskResult = RiskEngine.calculateRisk(geminiData);
      return ThreatFormatter.format('email', riskResult, geminiData);
    } catch (error: any) {
      logger.warn(`AI failed for EmailAnalyzer, falling back to Rule Engine. Reason: ${error.message}`);
      return this.fallbackAnalysis(content);
    }
  }

  private fallbackAnalysis(content: string): ThreatReport {
    const lowerContent = content.toLowerCase();
    
    // Deterministic Rule Engine for Email
    const hasUrgency = /urgent|immediate|account suspended|verify now|action required/i.test(lowerContent);
    const hasFinancial = /wire|payment|invoice|bank|crypto|bitcoin/i.test(lowerContent);
    const hasLinks = /https?:\/\//i.test(lowerContent);
    const hasSuspiciousLinks = /https?:\/\/(bit\.ly|tinyurl|t\.co|ow\.ly)/i.test(lowerContent);
    
    const isPhishing = hasUrgency || hasSuspiciousLinks || (hasFinancial && hasLinks);
    
    const fallbackData = {
      hasMaliciousLinks: hasSuspiciousLinks,
      hasUrgency,
      isBrandImpersonation: false,
      threatType: isPhishing ? 'Phishing' : 'None',
      summary: isPhishing 
        ? 'Local Rule Engine detected suspicious keywords and links commonly used in phishing.'
        : 'Local Rule Engine found no obvious malicious patterns.',
      reasons: [] as string[],
      indicators: [] as { type: string, description: string }[],
      recommendations: ['Do not click suspicious links', 'Verify the sender address manually'],
      preventionTips: []
    };
    
    if (hasUrgency) fallbackData.reasons.push('Contains urgent or threatening language');
    if (hasSuspiciousLinks) fallbackData.reasons.push('Contains shortened or suspicious links');
    if (hasFinancial) fallbackData.reasons.push('Requests financial actions or payments');

    const riskResult = RiskEngine.calculateRisk(fallbackData);
    const report = ThreatFormatter.format('email', riskResult, fallbackData);
    
    // Override confidence to indicate Rule Engine usage
    report.confidence = 0.3;
    report.summary = `[RULE ENGINE FALLBACK - AI UNAVAILABLE] ${fallbackData.summary}`;
    
    return report;
  }
}
