export class ScreenshotPromptBuilder {
  static build(ocrText: string): string {
    return `
You are a senior cybersecurity analyst. Analyze the following text extracted via OCR from a screenshot.
The screenshot might be an email, a login page, a chat (WhatsApp/SMS), or a payment request (UPI).
Look for:
- Fake login pages
- Banking scams
- WhatsApp/SMS scams
- OTP requests
- Fake invoices
- UPI scams
- Social engineering
- Urgency
- Fake support messages
- Brand impersonation
- Credential harvesting
- QR bait

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

OCR Text:
"""
${ocrText}
"""
    `;
  }
}
