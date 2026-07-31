import { ZodSchema } from 'zod';
import { AIServiceError, ErrorCode } from '../../errors';
import { logger } from '../logger/logger';

export class SafeJsonParser {
  static parse<T>(rawText: string, schema?: ZodSchema<T>): T {
    try {
      // Markdown stripping: handles ```json ... ``` and ``` ... ```
      let cleanText = rawText.trim();
      if (cleanText.startsWith('```')) {
        const lines = cleanText.split('\n');
        if (lines[0].startsWith('```')) lines.shift();
        if (lines[lines.length - 1].startsWith('```')) lines.pop();
        cleanText = lines.join('\n').trim();
      }
      
      let parsed;
      try {
        parsed = JSON.parse(cleanText);
      } catch (_parseError: any) {
        // Attempt 1-time repair: strip trailing commas which commonly break JSON.parse
        try {
          const repairedText = cleanText.replace(/,\s*([\]}])/g, '$1');
          parsed = JSON.parse(repairedText);
          logger.info('Successfully repaired malformed JSON from AI');
        } catch (repairError: any) {
          logger.error('JSON parsing failed permanently', undefined, { rawText, error: repairError.message });
          throw new AIServiceError('Failed to parse AI JSON response', ErrorCode.INVALID_JSON, 502, false);
        }
      }
      
      if (schema) {
        const result = schema.safeParse(parsed);
        if (!result.success) {
          logger.error('JSON Schema validation failed', undefined, result.error.format());
          throw new AIServiceError('AI Response did not match expected schema', ErrorCode.INVALID_JSON, 502, false);
        }
        return result.data;
      }
      
      return parsed;
    } catch (e: any) {
      if (e instanceof AIServiceError) throw e;
      logger.error('Unexpected error parsing AI response', undefined, e);
      throw new AIServiceError('Unexpected JSON parse error', ErrorCode.INVALID_JSON, 502, false);
    }
  }
}
