import { ThreatReport } from '../../types';

async function fetchAPI(endpoint: string, payload: any): Promise<ThreatReport> {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const parsed = await res.json();

  if (!res.ok || !parsed.success) {
    throw new Error(parsed.error?.message || 'API request failed');
  }

  // Unwrap the `{ data }` property from the standardized Response Helper
  return parsed.data;
}

export const analyzeEmail = (content: string) => fetchAPI('/api/analyze/email', { content });
export const analyzeUrl = (content: string) => fetchAPI('/api/analyze/url', { content });

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export const analyzeScreenshot = async (image: string | File) => {
  const base64Image = typeof image === 'string' ? image : await fileToBase64(image);
  return fetchAPI('/api/analyze/screenshot', { image: base64Image });
};

export const analyzeQr = async (image: string | File) => {
  const base64Image = typeof image === 'string' ? image : await fileToBase64(image);
  return fetchAPI('/api/analyze/qr', { image: base64Image });
};
