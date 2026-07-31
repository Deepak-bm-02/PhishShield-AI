import { ThreatIndicator } from '../../types';

export class RiskEngine {
  static calculateRisk(observations: any): {
    riskScore: number;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    verdict: 'Safe' | 'Low Risk' | 'Suspicious' | 'High Risk';
    confidence: number;
  } {
    // Deterministic scoring based on observations
    let score = 0;
    const confidence = 90; // Base confidence

    const indicators: ThreatIndicator[] = observations.indicators || [];
    
    // Simple heuristic for demonstration purposes
    score += indicators.length * 15;
    
    if (observations.hasMaliciousLinks) score += 40;
    if (observations.hasUrgency) score += 20;
    if (observations.isBrandImpersonation) score += 35;
    
    // Cap score at 100
    score = Math.min(100, Math.max(0, score));

    // Calculate Verdict & Severity based on thresholds
    let verdict: 'Safe' | 'Low Risk' | 'Suspicious' | 'High Risk' = 'Safe';
    let severity: 'Low' | 'Medium' | 'High' | 'Critical' = 'Low';

    if (score <= 25) {
      verdict = 'Safe';
      severity = 'Low';
    } else if (score <= 50) {
      verdict = 'Low Risk';
      severity = 'Low';
    } else if (score <= 75) {
      verdict = 'Suspicious';
      severity = 'Medium';
    } else {
      verdict = 'High Risk';
      severity = 'High';
      if (score >= 90) severity = 'Critical';
    }

    return {
      riskScore: score,
      severity,
      verdict,
      confidence
    };
  }
}
