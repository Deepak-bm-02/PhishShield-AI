import { HistoryRecord } from '../../types';

function randomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
}

const mockSummaries = {
  'High Risk': 'Critical threat identified. Analysis indicates active malicious payload or highly sophisticated impersonation.',
  'Suspicious': 'Anomalies detected. Contains unusual patterns that require further investigation.',
  'Low Risk': 'Minor warnings present, but no definitive threat indicators found.',
  'Safe': 'No threats detected. Safe to proceed.'
};

const mockThreatTypes = ['Brand Impersonation', 'Credential Harvesting', 'QR Fraud', 'Banking Scam', 'Social Engineering', 'Fake Login', 'Malware', 'Suspicious URL', 'None'];

export async function fetchHistory(): Promise<HistoryRecord[]> {
  const records: HistoryRecord[] = [];
  const now = new Date();
  const pastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const pastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Generate 50 realistic mock records for the dashboard
  for (let i = 0; i < 50; i++) {
    const isSafe = Math.random() > 0.4;
    const scanType = ['email', 'url', 'screenshot', 'qr'][Math.floor(Math.random() * 4)];
    const riskScore = isSafe ? Math.floor(Math.random() * 30) : Math.floor(Math.random() * 50) + 50;
    
    let verdict = 'Safe';
    if (riskScore > 85) verdict = 'High Risk';
    else if (riskScore > 60) verdict = 'Suspicious';
    else if (riskScore > 30) verdict = 'Low Risk';

    const threatType = isSafe ? 'None' : mockThreatTypes[Math.floor(Math.random() * (mockThreatTypes.length - 1))];
    const timestamp = i < 15 ? randomDate(pastWeek, now) : randomDate(pastMonth, pastWeek);

    records.push({
      id: `scan-${i}`,
      requestId: `req-${i}`,
      scanType,
      timestamp,
      riskScore,
      verdict,
      threatType, // Added for category stats
      summary: (mockSummaries as any)[verdict]
    });
  }

  // Sort descending by timestamp
  return records.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}
