# Lease Shield — Design Document

## What
AI-powered Indian rental lease analyzer. Upload lease PDF → get clause-by-clause analysis with legal references → chat with agent about your specific situation.

## Architecture
- **Flue Agent** (`lease-shield-agent`) — TypeScript agent deployed on Cloudflare Workers. Handles PDF text extraction, clause analysis via Gemini 2.5 Flash, follow-up chat.
- **Next.js Frontend** (`lease-shield-web`) — Upload UI, report display, chat interface. Calls Flue agent via HTTP.

## Flue Agent
Two endpoints:
- `POST /analyze` — receives PDF text, returns structured clause analysis JSON
- `POST /chat` — follow-up questions with lease context

Agent knowledge: Model Tenancy Act 2026, state rent control acts (MH, KA, DL, TN, UP, etc.), deposit caps, lock-in rules, eviction protections, registration requirements, common landlord tricks.

## Frontend Flow
1. **Upload** — drag-drop PDF, select "about to sign" vs "already signed", optional state selector
2. **Report** — clause cards with provision icons, law references, pushback messages / rights
3. **Chat** — iMessage-style follow-up with full lease context

## Visual Design
- Adapted from Coinbase institutional trust pattern
- Fonts: EB Garamond (display) + Lato (body)
- Colors: Navy slate bg (#0F172A), gold trust accent (#F59E0B), purple CTA (#8B5CF6)
- Icon system: Lucide SVG icons per provision category (Scale, Shield, AlertTriangle, IndianRupee, Lock, CheckCircle)
- Clause cards: left border by category, quoted clause, explanation, law reference tag, copyable pushback message
- Dark mode default, light mode toggle

## Indian Law Coverage
- Model Tenancy Act 2026 (national framework)
- State rent control acts (Maharashtra, Karnataka, Delhi, Tamil Nadu, UP, etc.)
- Security deposit caps (2mo residential, 6mo commercial)
- Lock-in period rules
- Maintenance/CAM charges
- Eviction protections
- Registration requirements (11-month rule)
- Common tricks: painting charges, arbitrary deductions, no-pet clauses, forfeit-on-early-exit
