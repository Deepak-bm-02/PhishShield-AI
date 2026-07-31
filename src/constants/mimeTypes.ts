export const ALLOWED_MIME_TYPES = {
  JPEG: 'image/jpeg',
  PNG: 'image/png',
  WEBP: 'image/webp',
} as const;

export type AllowedMimeType = typeof ALLOWED_MIME_TYPES[keyof typeof ALLOWED_MIME_TYPES];
