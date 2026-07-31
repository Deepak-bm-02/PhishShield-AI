# PhishShield AI - Architecture

## Backend Stack
- Framework: Next.js 15 (App Router - API Routes only)
- Language: TypeScript
- Validation: Zod
- AI Service: Google Gemini (gemini-2.5-flash)

## Folder Structure
```text
src/
├── app/                  # Next.js API Routes (Entry points)
├── engine/               # Threat Intelligence Engine (Core logic)
│   ├── analyzers/        # Domain-specific orchestrators
│   ├── core/             # RiskEngine (Deterministic scoring)
│   ├── formatters/       # Standardized response mappers
│   ├── prompts/          # Domain-specific prompt templates
│   └── services/         # External clients (Gemini)
├── lib/                  # Utilities
├── storage/              # Persistence layer abstraction
├── types/                # Interfaces & Schemas
└── errors/               # Centralized exception classes
```

## Threat Intelligence Pipeline
1. **Validation**: Zod schema verifies incoming payload on API edge.
2. **Analysis Orchestration**: Analyzer formats prompt.
3. **AI Generation**: Gemini returns raw indicators in structured JSON.
4. **Risk Calculation**: Deterministic math computes the final score based on AI observations.
5. **Formatting**: Output is mapped to the standard `ThreatReport` contract.
6. **Persistence**: The result is saved asynchronously to the Storage layer.
