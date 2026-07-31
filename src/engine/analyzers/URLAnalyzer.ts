import { GeminiClient } from '../services/GeminiClient';
import { URLPromptBuilder } from '../prompts/URLPromptBuilder';
import { RiskEngine } from '../core/RiskEngine';
import { ThreatFormatter } from '../formatters/ThreatFormatter';
import { ThreatReport } from '../../types';

export class URLAnalyzer {
  private geminiClient: GeminiClient;

  constructor() {
    this.geminiClient = new GeminiClient();
  }

  async analyze(url: string): Promise<ThreatReport> {
    const prompt = URLPromptBuilder.build(url);
    
    // Call Gemini
    const geminiData = await this.geminiClient.generateJSON(prompt);
    
    // Calculate Risk
    const riskResult = RiskEngine.calculateRisk(geminiData);
    
    // Format response
    return ThreatFormatter.format('url', riskResult, geminiData);
  }
}
