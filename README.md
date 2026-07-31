# PhishShield AI 🛡️

**AI-Powered Security Operations Center for Everyday Users**

PhishShield AI is a comprehensive threat intelligence platform built for hackathons. It analyzes Emails, URLs, Screenshots (via OCR), and QR codes to detect phishing, social engineering, and cyber fraud.

## Features
- **Email Analysis:** Detects credential harvesting and brand impersonation.
- **URL Analysis:** Detects typosquatting and malicious domains.
- **Screenshot Analysis:** Extracts text via Tesseract OCR to find fake login pages and chat scams.
- **QR Code Analysis:** Decodes QR codes using jsQR to find embedded malicious links.
- **Security Operations Dashboard:** Live analytics powered by Recharts.
- **Threat History:** View past scans and threat scores.

## Architecture
- **Frontend:** Next.js 15, React 19, Tailwind CSS, Recharts, Lucide React.
- **Backend:** Next.js API Routes, Zod Validation, Google Gemini 2.5 Flash, Deterministic Risk Engine.

## Setup Instructions
1. Clone the repository.
2. Run \`npm install\`.
3. Create a \`.env.local\` file and add your Gemini API Key:
   \`GEMINI_API_KEY=your_api_key_here\`
4. Run \`npm run dev\` to start the development server.

## Demo Mode
Click "Load Demo Data" on the Scanner page to instantly populate a High-Risk Threat Report without making a live API call. This is perfect for live hackathon presentations!
