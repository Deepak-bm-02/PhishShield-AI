export async function fetchHealth() {
  const res = await fetch('/api/health', { method: 'GET' });
  const parsed = await res.json();
  
  if (!res.ok || !parsed.success) {
    throw new Error(parsed.error?.message || 'Failed to fetch health');
  }

  return parsed.data;
}
