import { GeminiClient } from '../services/GeminiClient';
import { OCRService } from '../services/OCRService';
import { ScreenshotPromptBuilder } from '../prompts/ScreenshotPromptBuilder';
import { RiskEngine } from '../core/RiskEngine';
import { ThreatFormatter } from '../formatters/ThreatFormatter';
import { ThreatReport } from '../../types';

export class ScreenshotAnalyzer {
  private geminiClient: GeminiClient;

  constructor() {
    this.geminiClient = new GeminiClient();
  }

  async analyze(base64Image: string): Promise<ThreatReport> {
    console.log('[Analyzer] Extracting text via OCR');
    const ocrText = await OCRService.extractText(base64Image);
    
    console.log('[Analyzer] Building prompt');
    const prompt = ScreenshotPromptBuilder.build(ocrText);
    
    console.log('[Analyzer] Calling Gemini');
    const geminiData = await this.geminiClient.generateJSON(prompt);
    
    console.log('[Analyzer] Calculating risk');
    const riskResult = RiskEngine.calculateRisk(geminiData);
    
    return ThreatFormatter.format('screenshot', riskResult, geminiData);
  }
}
