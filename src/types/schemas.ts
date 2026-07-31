import { z } from 'zod';

export const emailAnalysisSchema = z.object({
  content: z.string().min(10, 'Email content must be at least 10 characters long.'),
});

export const urlAnalysisSchema = z.object({
  content: z.string().url('Invalid URL format.').min(1, 'URL cannot be empty.').max(2048, 'URL exceeds maximum length.'),
});

export const screenshotAnalysisSchema = z.object({
  image: z.string().min(1, 'Image data is required.') // Expecting base64 string
});

export const qrAnalysisSchema = z.object({
  image: z.string().min(1, 'Image data is required.') // Expecting base64 string
});
