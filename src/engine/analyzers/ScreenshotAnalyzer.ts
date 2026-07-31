import { GeminiClient } from '../services/GeminiClient';
import { OCRService } from '../services/OCRService';
import { ScreenshotPromptBuilder } from '../prompts/ScreenshotPromptBuilder';
import { RiskEngine } from '../core/RiskEngine';
import { ThreatFormatter } from '../formatters/ThreatFormatter';
import { ThreatReport } from '../../types';
import { logger } from '../../lib/logger/logger';

export class ScreenshotAnalyzer {
  private geminiClient: GeminiClient;

  constructor() {
    this.geminiClient = new GeminiClient();
  }

  async analyze(base64Image: string): Promise<ThreatReport> {
    logger.info('[Analyzer] Extracting text via OCR');
    const ocrStart = Date.now();
    const ocrText = await OCRService.extractText(base64Image);
    const ocrDuration = Date.now() - ocrStart;
    
    logger.info(`[Analyzer] Processing OCR content: ${ocrText.substring(0, 50)}... | OCR duration: ${ocrDuration}ms`);
    
    const prompt = ScreenshotPromptBuilder.build(ocrText);
    
    try {
      const geminiStart = Date.now();
      const geminiData = await this.geminiClient.generateJSON(prompt);
      const geminiDuration = Date.now() - geminiStart;
      
      logger.info(`[Analyzer] Gemini generated JSON. | Gemini duration: ${geminiDuration}ms`);
      
      const riskResult = RiskEngine.calculateRisk(geminiData);
      const report = ThreatFormatter.format('screenshot', riskResult, geminiData);
      
      // Attach the OCR content to the summary for context
      report.summary = `OCR Content: ${ocrText.substring(0, 100)}...\n\n${report.summary}`;
      
      return report;
    } catch (error: any) {
      logger.warn(`AI failed for ScreenshotAnalyzer, falling back to Rule Engine. Reason: ${error.message}`);
      return this.fallbackAnalysis(ocrText);
    }
  }

  private fallbackAnalysis(ocrText: string): ThreatReport {
    const lowerText = ocrText.toLowerCase();
    
    // Deterministic Rule Engine for OCR
    const hasBrandImpersonation = /login|password|sign in|account|verify|update|microsoft|paypal|bank|apple/i.test(lowerText);
    const hasUrgency = /urgent|suspended|locked|unauthorized/i.test(lowerText);
    
    const isPhishing = hasBrandImpersonation && hasUrgency;
    
    const fallbackData = {
      hasMaliciousLinks: false,
      hasUrgency,
      isBrandImpersonation: hasBrandImpersonation,
      threatType: isPhishing ? 'Phishing' : 'None',
      summary: isPhishing 
        ? 'Local Rule Engine detected a potential fake login or suspended account notice in the image text.'
        : 'Local Rule Engine found no obvious malicious text patterns in the image.',
      reasons: [] as string[],
      indicators: [] as { type: string, description: string }[],
      recommendations: ['Verify the source of this image', 'Do not enter credentials if this is a login screen'],
      preventionTips: []
    };
    
    if (hasBrandImpersonation) fallbackData.reasons.push('Contains words commonly found on login pages or brand notices');
    if (hasUrgency) fallbackData.reasons.push('Contains urgent or threatening text');

    const riskResult = RiskEngine.calculateRisk(fallbackData);
    const report = ThreatFormatter.format('screenshot', riskResult, fallbackData);
    
    report.confidence = 0.3;
    report.summary = `[RULE ENGINE FALLBACK - AI UNAVAILABLE] ${fallbackData.summary}\n\nOCR Preview: ${ocrText.substring(0, 100)}...`;
    
    return report;
  }
}
