import { GeminiClient } from '../services/GeminiClient';
import { EmailPromptBuilder } from '../prompts/EmailPromptBuilder';
import { RiskEngine } from '../core/RiskEngine';
import { ThreatFormatter } from '../formatters/ThreatFormatter';
import { ThreatReport } from '../../types';

export class EmailAnalyzer {
  private geminiClient: GeminiClient;

  constructor() {
    this.geminiClient = new GeminiClient();
  }

  async analyze(content: string): Promise<ThreatReport> {
    const prompt = EmailPromptBuilder.build(content);
    
    // Call Gemini
    const geminiData = await this.geminiClient.generateJSON(prompt);
    
    // Calculate Risk
    const riskResult = RiskEngine.calculateRisk(geminiData);
    
    // Format response
    return ThreatFormatter.format('email', riskResult, geminiData);
  }
}
