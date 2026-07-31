import { GeminiClient } from '../services/GeminiClient';
import { QRDecoder } from '../services/QRDecoder';
import { QRPromptBuilder } from '../prompts/QRPromptBuilder';
import { RiskEngine } from '../core/RiskEngine';
import { ThreatFormatter } from '../formatters/ThreatFormatter';
import { ThreatReport } from '../../types';
import { logger } from '../../lib/logger/logger';
export class QRAnalyzer {
  private geminiClient: GeminiClient;

  constructor() {
    this.geminiClient = new GeminiClient();
  }

  async analyze(base64Image: string): Promise<ThreatReport> {
    logger.info(`[Analyzer] Decoding QR Image`);
    const decodeStart = Date.now();
    const decodedText = await QRDecoder.decode(base64Image);
    const decodeDuration = Date.now() - decodeStart;
    
    logger.info(`[Analyzer] Processing QR content: ${decodedText.substring(0, 50)}... | Decode duration: ${decodeDuration}ms`);
    
    const prompt = QRPromptBuilder.build(decodedText);
    
    try {
      const geminiStart = Date.now();
      const geminiData = await this.geminiClient.generateJSON(prompt);
      const geminiDuration = Date.now() - geminiStart;
      
      logger.info(`[Analyzer] Gemini generated JSON. | Gemini duration: ${geminiDuration}ms`);
      
      const riskResult = RiskEngine.calculateRisk(geminiData);
      const report = ThreatFormatter.format('qr', riskResult, geminiData);
      
      // Attach the decoded content to the summary for context
      report.summary = `Decoded Content: ${decodedText}\n\n${report.summary}`;
      
      return report;
    } catch (error: any) {
      logger.warn(`AI failed for QRAnalyzer, falling back to Rule Engine. Reason: ${error.message}`);
      return this.fallbackAnalysis(decodedText);
    }
  }

  private fallbackAnalysis(decodedText: string): ThreatReport {
    // If the QR code contains a URL, pass it to the URL Rule Engine
    if (/https?:\/\//i.test(decodedText)) {
       // Calling analyze will fallback again to rule engine if AI is completely down, 
       // but since we are already in fallback, we'll just parse manually.
       const lowerUrl = decodedText.toLowerCase();
       const hasSuspiciousLinks = /https?:\/\/(bit\.ly|tinyurl|t\.co|ow\.ly)/i.test(lowerUrl);
       const isPhishing = hasSuspiciousLinks;
       
       const fallbackData = {
         hasMaliciousLinks: hasSuspiciousLinks,
         hasUrgency: false,
         isBrandImpersonation: false,
         threatType: isPhishing ? 'Malicious QR' : 'None',
         summary: isPhishing 
           ? 'Local Rule Engine detected a suspicious shortened URL embedded in the QR code.'
           : 'Local Rule Engine found no obvious malicious patterns in this QR.',
         reasons: hasSuspiciousLinks ? ['Contains shortened or suspicious links'] : [],
         indicators: [] as { type: string, description: string }[],
         recommendations: ['Do not scan unknown QR codes'],
         preventionTips: []
       };

       const riskResult = RiskEngine.calculateRisk(fallbackData);
       const report = ThreatFormatter.format('qr', riskResult, fallbackData);
       report.confidence = 0.3;
       report.summary = `[RULE ENGINE FALLBACK - AI UNAVAILABLE] ${fallbackData.summary}\n\nDecoded Content: ${decodedText}`;
       return report;
    }
    
    // Non-URL QR Code
    const fallbackData = {
      hasMaliciousLinks: false,
      hasUrgency: false,
      isBrandImpersonation: false,
      threatType: 'None',
      summary: 'Local Rule Engine found no obvious malicious patterns in this plain text QR code.',
      reasons: [] as string[],
      indicators: [] as { type: string, description: string }[],
      recommendations: ['Always verify QR code sources'],
      preventionTips: []
    };
    
    const riskResult = RiskEngine.calculateRisk(fallbackData);
    const report = ThreatFormatter.format('qr', riskResult, fallbackData);
    report.confidence = 0.3;
    report.summary = `[RULE ENGINE FALLBACK - AI UNAVAILABLE] ${fallbackData.summary}\n\nDecoded Content: ${decodedText}`;
    return report;
  }
}
