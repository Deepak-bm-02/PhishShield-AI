export const VERDICT = {
  SAFE: 'Safe',
  LOW_RISK: 'Low Risk',
  SUSPICIOUS: 'Suspicious',
  HIGH_RISK: 'High Risk',
} as const;

export type VerdictType = typeof VERDICT[keyof typeof VERDICT];

export const RISK_THRESHOLDS = {
  HIGH_RISK: 75,
  SUSPICIOUS: 40,
  LOW_RISK: 15,
} as const;
