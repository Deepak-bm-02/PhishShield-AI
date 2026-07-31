import { GoogleGenerativeAI } from '@google/generative-ai';
import { geminiConfig, limitsConfig } from '../../config';
import { AIServiceError } from '../../errors';
import { SafeJsonParser } from '../../lib/json/SafeJsonParser';
import { MetricsService } from '../../services/MetricsService';
import { logger } from '../../lib/logger/logger';

export class GeminiClient {
  private genAI: GoogleGenerativeAI;
  private modelName: string;

  constructor(modelName = 'gemini-2.5-flash') {
    const apiKey = geminiConfig.apiKey;
    if (!apiKey) {
      throw new AIServiceError('Gemini API Key is not configured.');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.modelName = modelName;
  }

  async generateJSON(prompt: string, retries = 3): Promise<any> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      const startTime = Date.now();
      try {
        const model = this.genAI.getGenerativeModel({
          model: this.modelName,
          generationConfig: {
            responseMimeType: "application/json",
          }
        });

        const result = await Promise.race([
          model.generateContent(prompt),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), limitsConfig.apiTimeoutMs))
        ]);

        const duration = Date.now() - startTime;
        MetricsService.recordAiLatency(duration);

        const responseText = (result as any).response.text();
        return SafeJsonParser.parse(responseText);
      } catch (error: any) {
        logger.warn(`Gemini API attempt ${attempt} failed: ${error.message}`);
        if (attempt === retries) {
          throw new AIServiceError(`Gemini request failed after ${retries} attempts: ${error.message}`);
        }
        // Exponential backoff
        await new Promise(res => setTimeout(res, Math.pow(2, attempt) * 1000));
      }
    }
  }
}
