export class URLPromptBuilder {
  static build(url: string): string {
    return `
You are a senior cybersecurity analyst. Analyze the following URL for phishing and fraud indicators.
Look for:
- Typosquatting
- Brand impersonation
- Fake banking domains
- Credential harvesting
- URL shorteners
- Suspicious subdomains
- HTTPS usage
- Excessive parameters
- Encoded paths
- Known phishing patterns

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

URL:
"""
${url}
"""
    `;
  }
}
