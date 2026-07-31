import { ZodSchema } from 'zod';
import { APIError, ErrorCode } from '../../errors';
import { logger } from '../logger/logger';

export class SafeJsonParser {
  static parse<T>(rawText: string, schema?: ZodSchema<T>): T {
    try {
      // Remove markdown JSON wrappers if present
      const cleanText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanText);
      
      if (schema) {
        const result = schema.safeParse(parsed);
        if (!result.success) {
          logger.error('JSON Schema validation failed', undefined, result.error);
          throw new APIError('Invalid AI Response Format', 500, ErrorCode.INTERNAL_ERROR);
        }
        return result.data;
      }
      
      return parsed;
    } catch (e: any) {
      if (e instanceof APIError) throw e;
      logger.error('Failed to parse JSON', undefined, e);
      throw new APIError('Failed to parse AI response', 500, ErrorCode.INTERNAL_ERROR);
    }
  }
}
