import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_CONFIG } from '../../config/gemini';
import { AIServiceError, ErrorCode } from '../../errors';
import { SafeJsonParser } from '../../lib/json/SafeJsonParser';
import { MetricsService } from '../../services/MetricsService';
import { logger } from '../../lib/logger/logger';

export class GeminiClient {
  private genAI: GoogleGenerativeAI;
  
  constructor() {
    if (!GEMINI_CONFIG.apiKey) {
      throw new AIServiceError('Gemini API Key is not configured', ErrorCode.CONFIGURATION_ERROR, 500, false);
    }
    this.genAI = new GoogleGenerativeAI(GEMINI_CONFIG.apiKey);
  }

  async generateJSON(prompt: string, retries = GEMINI_CONFIG.retries): Promise<any> {
    let lastError: any;
    
    // Attempt Primary Model
    try {
      return await this.executeWithModel(GEMINI_CONFIG.primaryModel, prompt, retries);
    } catch (e: any) {
      lastError = e;
      logger.warn(`Primary model (${GEMINI_CONFIG.primaryModel}) failed: ${e.message}. Attempting fallback...`);
      
      // If 404 or 503, fallback to the secondary model immediately
      if (e instanceof AIServiceError && (e.code === ErrorCode.MODEL_NOT_FOUND || e.code === ErrorCode.MODEL_UNAVAILABLE || e.statusCode >= 500)) {
         try {
           logger.info(`Switching to fallback model: ${GEMINI_CONFIG.fallbackModel}`);
           return await this.executeWithModel(GEMINI_CONFIG.fallbackModel, prompt, 1);
         } catch (fallbackError: any) {
           logger.error(`Fallback model also failed: ${fallbackError.message}`);
           throw fallbackError;
         }
      }
      
      throw lastError;
    }
  }

  private async executeWithModel(modelName: string, prompt: string, maxAttempts: number): Promise<any> {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const startTime = Date.now();
      try {
        const model = this.genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            responseMimeType: "application/json",
            temperature: GEMINI_CONFIG.temperature,
            maxOutputTokens: GEMINI_CONFIG.maxOutputTokens
          }
        });

        logger.info(`Sending request to ${modelName} (Attempt ${attempt}/${maxAttempts})`);

        const result = await Promise.race([
          model.generateContent(prompt),
          new Promise((_, reject) => setTimeout(() => reject(new AIServiceError('Gemini Request Timeout', ErrorCode.AI_TIMEOUT, 504, true)), GEMINI_CONFIG.timeout))
        ]);

        const duration = Date.now() - startTime;
        MetricsService.recordAiLatency(duration);

        const responseText = (result as any).response.text();
        
        logger.info(`Successful response from ${modelName} in ${duration}ms (Size: ${responseText.length} chars)`);
        
        return SafeJsonParser.parse(responseText);
      } catch (error: any) {
        const duration = Date.now() - startTime;
        logger.warn(`Attempt ${attempt} failed for ${modelName} after ${duration}ms: ${error.message}`);
        
        const isRateLimit = error.message?.includes('429');
        const isNotFound = error.message?.includes('404');
        
        let aiError: AIServiceError;
        
        if (error instanceof AIServiceError) {
          aiError = error;
        } else if (isNotFound) {
          aiError = new AIServiceError(`Model not found: ${modelName}`, ErrorCode.MODEL_NOT_FOUND, 404, false);
        } else if (isRateLimit) {
          aiError = new AIServiceError(`Rate limited by Gemini`, ErrorCode.RATE_LIMITED, 429, true);
        } else {
          aiError = new AIServiceError(error.message || 'Unknown Gemini Error', ErrorCode.UNKNOWN_ERROR, 502, true);
        }

        if (attempt === maxAttempts || !aiError.retryable) {
          throw aiError;
        }
        
        // Exponential backoff
        await new Promise(res => setTimeout(res, Math.pow(2, attempt) * 1000));
      }
    }
  }
}
