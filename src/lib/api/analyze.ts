import { ThreatReport } from '../../types';

async function fetchAPI(endpoint: string, payload: any): Promise<ThreatReport> {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'API request failed');
  }

  return res.json();
}

export const analyzeEmail = (content: string) => fetchAPI('/api/analyze/email', { content });
export const analyzeUrl = (content: string) => fetchAPI('/api/analyze/url', { content });
export const analyzeScreenshot = (image: string) => fetchAPI('/api/analyze/screenshot', { image });
export const analyzeQr = (image: string) => fetchAPI('/api/analyze/qr', { image });
