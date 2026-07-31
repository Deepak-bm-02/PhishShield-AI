export const THREAT_CATEGORIES = {
  BRAND_IMPERSONATION: 'Brand Impersonation',
  CREDENTIAL_HARVESTING: 'Credential Harvesting',
  QR_FRAUD: 'QR Fraud',
  BANKING_SCAM: 'Banking Scam',
  SOCIAL_ENGINEERING: 'Social Engineering',
  FAKE_LOGIN: 'Fake Login',
  MALWARE: 'Malware',
  SUSPICIOUS_URL: 'Suspicious URL',
  NONE: 'None',
} as const;

export type ThreatCategory = typeof THREAT_CATEGORIES[keyof typeof THREAT_CATEGORIES];
