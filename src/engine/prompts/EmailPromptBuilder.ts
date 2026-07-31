export class EmailPromptBuilder {
  static build(content: string): string {
    return `
You are a senior cybersecurity analyst. Analyze the following email content for phishing and fraud indicators.
Look for:
- Social engineering
- Credential harvesting
- Brand impersonation
- Urgency tactics
- Suspicious sender patterns
- Fake domains
- Financial fraud
- OTP scams
- Malware indicators
- Suspicious attachments
- Grammar anomalies
- Emotional manipulation

Return ONLY a valid JSON object with the following schema:
{
  "hasMaliciousLinks": boolean,
  "hasUrgency": boolean,
  "isBrandImpersonation": boolean,
  "threatType": string,
  "summary": string,
  "reasons": string[],
  "indicators": [{ "type": string, "description": string }],
  "recommendations": string[],
  "preventionTips": string[]
}

CRITICAL: You must respond ONLY with a raw JSON object.
Do not use markdown.
Do not use code fences like \`\`\`json.
Do not explain your reasoning.
Return valid JSON matching the exact ThreatReport schema above.

Email Content:
"""
${content}
"""
    `;
  }
}
