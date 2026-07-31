import jsQR from 'jsqr';
import { Jimp } from 'jimp';
import { APIError } from '../../errors';

export class QRDecoder {
  static async decode(base64Image: string): Promise<string> {
    try {
      // Clean base64 prefix if exists
      const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      
      const image = await Jimp.read(buffer);
      const width = image.bitmap.width;
      const height = image.bitmap.height;
      
      const qrCode = jsQR(new Uint8ClampedArray(image.bitmap.data), width, height);
      
      if (!qrCode) {
        throw new APIError('No valid QR code found in the image.', 400);
      }
      
      return qrCode.data;
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(`QR decoding failed: ${error.message}`, 500);
    }
  }
}
