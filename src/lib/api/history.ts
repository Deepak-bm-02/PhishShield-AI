import { HistoryRecord } from '../../types';

// In a real application, this would fetch from a database API.
// We are mocking the client side fetching for the frontend integration.
export async function fetchHistory(): Promise<HistoryRecord[]> {
  // Mock response for frontend integration
  return [
    {
      id: 'mock-1',
      requestId: 'mock-1',
      scanType: 'email',
      timestamp: new Date().toISOString(),
      riskScore: 85,
      verdict: 'High Risk',
      summary: 'High confidence phishing email attempting credential harvesting.'
    },
    {
      id: 'mock-2',
      requestId: 'mock-2',
      scanType: 'url',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      riskScore: 12,
      verdict: 'Safe',
      summary: 'Legitimate domain, no threats detected.'
    }
  ];
}
