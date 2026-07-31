export interface ThreatIndicator {
  type: string;
  description: string;
}

export interface ThreatReport {
  requestId?: string;
  scanType: 'email' | 'url' | 'screenshot' | 'qr';
  verdict: 'Safe' | 'Low Risk' | 'Suspicious' | 'High Risk';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  confidence: number;
  riskScore: number;
  threatType: string;
  summary: string;
  reasons: string[];
  indicators: ThreatIndicator[];
  recommendations: string[];
  preventionTips: string[];
  processingTime?: number;
  timestamp?: string;
}

export interface AnalysisRequest {
  content: string;
}

export interface DashboardStats {
  totalScans: number;
  threatCount: number;
  safeCount: number;
  protectionScore: number;
  recentActivity: any[]; // To be expanded in future sprints
  threatDistribution: Record<string, number>;
}

export interface HistoryRecord {
  id: string;
  requestId: string;
  scanType: string;
  timestamp: string;
  riskScore: number;
  verdict: string;
  summary: string;
  threatType?: string;
}
