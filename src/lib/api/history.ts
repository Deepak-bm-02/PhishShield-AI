import { HistoryRecord } from '../../types';

export async function fetchHistory(): Promise<HistoryRecord[]> {
  const res = await fetch('/api/history', { method: 'GET' });
  const parsed = await res.json();
  
  if (!res.ok || !parsed.success) {
    throw new Error(parsed.error?.message || 'Failed to fetch history');
  }

  return parsed.data;
}
