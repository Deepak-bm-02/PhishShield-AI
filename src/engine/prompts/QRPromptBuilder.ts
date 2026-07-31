export class QRPromptBuilder {
  static build(decodedContent: string): string {
    return `
You are a senior cybersecurity analyst. Analyze the following content decoded from a QR code.
Look for:
- Fake payment requests
- Malicious URLs
- Credential harvesting
- Fake banking pages
- Crypto scams
- UPI fraud
- Malware download links

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

Decoded QR Content:
"""
${decodedContent}
"""
    `;
  }
}
