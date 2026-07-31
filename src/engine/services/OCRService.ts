import Tesseract from 'tesseract.js';
import { APIError } from '../../errors';

export class OCRService {
  static async extractText(base64Image: string): Promise<string> {
    try {
      // In a real production setup with base64, we might need to extract the buffer or just pass the data URI.
      // Tesseract.recognize accepts image data URI.
      const result = await Tesseract.recognize(
        base64Image.startsWith('data:image') ? base64Image : `data:image/png;base64,${base64Image}`,
        'eng',
        { logger: m => console.log(`[OCR] ${m.status}: ${Math.round(m.progress * 100)}%`) }
      );
      
      const text = result.data.text;
      
      if (!text || text.trim().length === 0) {
        throw new APIError('No text detected in the image.', 400);
      }
      
      // Clean up whitespace and duplicated lines
      return text.replace(/\n\s*\n/g, '\n').trim();
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(`OCR processing failed: ${error.message}`, 500);
    }
  }
}
