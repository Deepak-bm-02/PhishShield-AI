import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../../config/env';
import { AIServiceError } from '../../errors';

export class GeminiClient {
  private genAI: GoogleGenerativeAI;
  private modelName: string;

  constructor(modelName = 'gemini-2.5-flash') {
    const apiKey = config.geminiApiKey;
    if (!apiKey) {
      throw new AIServiceError('Gemini API Key is not configured.');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.modelName = modelName;
  }

  async generateJSON(prompt: string, retries = 3): Promise<any> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const model = this.genAI.getGenerativeModel({
          model: this.modelName,
          generationConfig: {
            responseMimeType: "application/json",
          }
        });

        const result = await Promise.race([
          model.generateContent(prompt),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 15000))
        ]);

        const responseText = (result as any).response.text();
        return JSON.parse(responseText);
      } catch (error: any) {
        if (attempt === retries) {
          throw new AIServiceError(`Gemini request failed after ${retries} attempts: ${error.message}`);
        }
        // Exponential backoff
        await new Promise(res => setTimeout(res, Math.pow(2, attempt) * 1000));
      }
    }
  }
}
