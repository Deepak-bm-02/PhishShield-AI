import { GeminiClient } from '../services/GeminiClient';
import { QRDecoder } from '../services/QRDecoder';
import { QRPromptBuilder } from '../prompts/QRPromptBuilder';
import { RiskEngine } from '../core/RiskEngine';
import { ThreatFormatter } from '../formatters/ThreatFormatter';
import { ThreatReport } from '../../types';

export class QRAnalyzer {
  private geminiClient: GeminiClient;

  constructor() {
    this.geminiClient = new GeminiClient();
  }

  async analyze(base64Image: string): Promise<ThreatReport> {
    console.log('[Analyzer] Decoding QR Image');
    const decodedText = await QRDecoder.decode(base64Image);
    
    console.log('[Analyzer] Building prompt');
    const prompt = QRPromptBuilder.build(decodedText);
    
    console.log('[Analyzer] Calling Gemini');
    const geminiData = await this.geminiClient.generateJSON(prompt);
    
    console.log('[Analyzer] Calculating risk');
    const riskResult = RiskEngine.calculateRisk(geminiData);
    
    const report = ThreatFormatter.format('qr', riskResult, geminiData);
    
    // Attach the decoded content to the summary for context
    report.summary = `Decoded Content: ${decodedText}\n\n${report.summary}`;
    
    return report;
  }
}
