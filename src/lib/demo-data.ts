import { ThreatReport } from '../types';

export const DEMO_DATA: ThreatReport[] = [
  {
    scanType: 'email',
    verdict: 'High Risk',
    severity: 'Critical',
    confidence: 95,
    riskScore: 92,
    threatType: 'Credential Harvesting',
    summary: 'This email is a sophisticated phishing attempt impersonating a major bank. It contains high-urgency language and links to a known malicious typosquatting domain.',
    reasons: ['Sender domain does not match official bank domain', 'Contains urgent call to action threatening account suspension'],
    indicators: [{ type: 'Domain', description: 'Typosquatting domain: secure-login-b0fa.com' }],
    recommendations: ['Do not click the link', 'Report to IT security'],
    preventionTips: ['Always verify sender address', 'Navigate to the bank website manually'],
  }
];
