# Lease Shield Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build an AI-powered Indian rental lease analyzer — upload a lease PDF, get clause-by-clause legal analysis, then chat about your specific situation.

**Architecture:** Flue agent (TypeScript, Cloudflare Workers) handles AI analysis via Gemini 2.5 Flash. Next.js frontend handles upload UI, report display, and chat. Frontend extracts PDF text via pdf.js, sends to agent API.

**Tech Stack:** Flue (@flue/sdk, @flue/cli), Gemini 2.5 Flash (google/gemini-2.5-flash), Next.js 16, React 19, Tailwind v4, Lucide React icons, pdf.js (pdfjs-dist), Valibot for schemas.

---

## Part 1: Flue Agent (`lease-shield-agent`)

### Task 1: Scaffold Flue project

**Files:**
- Create: `lease-shield-agent/package.json`
- Create: `lease-shield-agent/flue.config.ts`
- Create: `lease-shield-agent/.flue/agents/lease-analyzer.ts`
- Create: `lease-shield-agent/.flue/skills/analyze-lease.md`
- Create: `lease-shield-agent/.flue/skills/chat-about-lease.md`
- Create: `lease-shield-agent/.flue/roles/legal-advisor.md`

**Step 1: Create project and install dependencies**

```bash
mkdir -p ~/Projects/lease-shield-agent && cd ~/Projects/lease-shield-agent
npm init -y
npm install @flue/sdk valibot
npm install -D @flue/cli
```

**Step 2: Create flue.config.ts**

```typescript
// flue.config.ts
import { defineConfig } from '@flue/cli/config';

export default defineConfig({
  target: 'node',
});
```

**Step 3: Create .env**

```
GOOGLE_GENERATIVE_AI_API_KEY=<key>
```

**Step 4: Verify setup**

Run: `npx flue dev --target node`
Expected: Server starts on port 3583

**Step 5: Commit**

```bash
git init && git add -A
git commit -m "feat: scaffold flue agent project"
```

---

### Task 2: Write legal advisor role (Indian rental law knowledge)

**Files:**
- Create: `lease-shield-agent/.flue/roles/legal-advisor.md`

**Step 1: Create role with Indian rental law knowledge**

The role markdown should contain:
- Identity: Indian rental law expert, tenant advocate
- Tone: friendly but authoritative, plain English, no legalese
- Knowledge base: Model Tenancy Act 2026, state rent control acts, deposit caps (2mo residential / 6mo commercial), lock-in rules, eviction protections, registration (11-month rule), maintenance/CAM charges
- Common landlord tricks to flag: painting charges on exit, arbitrary deposit deductions, no-pet clauses without legal basis, forfeit-on-early-exit, excessive notice periods, unilateral rent escalation above 10%, vague maintenance charges, forced arbitration clauses
- State-specific knowledge: Maharashtra Rent Control Act, Karnataka Rent Act, Delhi Rent Control Act, Tamil Nadu Buildings Act, UP Urban Buildings Act
- Output rules: always cite the specific law/section, always provide actionable advice (pushback script for pre-sign, rights + remedies for post-sign)

**Step 2: Commit**

```bash
git add .flue/roles/legal-advisor.md
git commit -m "feat: add legal advisor role with Indian rental law knowledge"
```

---

### Task 3: Write analyze-lease skill

**Files:**
- Create: `lease-shield-agent/.flue/skills/analyze-lease.md`

**Step 1: Create skill markdown**

The skill should instruct the agent to:
- Receive raw lease text + stage (pre-sign / post-sign) + state (optional)
- Parse each clause/section of the lease
- For each clause, output structured JSON:
  - `clauseText`: exact text from lease
  - `category`: one of `legal-violation`, `tenant-right`, `hidden-risk`, `financial-trap`, `lock-in-issue`, `standard`
  - `title`: short label (e.g., "Excessive Security Deposit")
  - `explanation`: plain English, 1-2 sentences
  - `lawReference`: specific act + section (e.g., "Model Tenancy Act 2026, Section 8")
  - `action`: pushback message (pre-sign) or rights/remedies (post-sign)
  - `severity`: `high`, `medium`, `low`
- Return as JSON array wrapped in `{ clauses: [...], summary: { total, violations, risks, traps, safe } }`

**Step 2: Commit**

```bash
git add .flue/skills/analyze-lease.md
git commit -m "feat: add analyze-lease skill"
```

---

### Task 4: Write chat-about-lease skill

**Files:**
- Create: `lease-shield-agent/.flue/skills/chat-about-lease.md`

**Step 1: Create skill markdown**

The skill should instruct the agent to:
- Receive the full lease text as context + user question
- Answer in casual but authoritative tone (max 3 sentences)
- Always reference specific lease clauses when relevant
- Always cite the applicable law
- If asked about something not in the lease, say so
- Never make up legal advice — say "consult a lawyer" for complex situations

**Step 2: Commit**

```bash
git add .flue/skills/chat-about-lease.md
git commit -m "feat: add chat-about-lease skill"
```

---

### Task 5: Write the agent handler

**Files:**
- Create: `lease-shield-agent/.flue/agents/lease-analyzer.ts`

**Step 1: Write agent with two modes (analyze + chat)**

```typescript
import type { FlueContext } from '@flue/runtime';
import * as v from 'valibot';

export const triggers = { webhook: true };

export default async function ({ init, payload }: FlueContext) {
  const harness = await init({
    model: 'google/gemini-2.5-flash',
  });
  const session = await harness.session(payload.sessionId || 'default');

  if (payload.mode === 'analyze') {
    const { data } = await session.skill('analyze-lease', {
      args: {
        leaseText: payload.leaseText,
        stage: payload.stage, // 'pre-sign' | 'post-sign'
        state: payload.state, // 'maharashtra' | 'karnataka' | etc.
      },
      role: 'legal-advisor',
      schema: v.object({
        clauses: v.array(v.object({
          clauseText: v.string(),
          category: v.picklist(['legal-violation', 'tenant-right', 'hidden-risk', 'financial-trap', 'lock-in-issue', 'standard']),
          title: v.string(),
          explanation: v.string(),
          lawReference: v.string(),
          action: v.string(),
          severity: v.picklist(['high', 'medium', 'low']),
        })),
        summary: v.object({
          total: v.number(),
          violations: v.number(),
          risks: v.number(),
          traps: v.number(),
          safe: v.number(),
        }),
      }),
    });
    return data;
  }

  if (payload.mode === 'chat') {
    const { data } = await session.skill('chat-about-lease', {
      args: {
        leaseText: payload.leaseText,
        question: payload.question,
      },
      role: 'legal-advisor',
    });
    return data;
  }

  return { error: 'Invalid mode. Use "analyze" or "chat".' };
}
```

**Step 2: Test locally**

```bash
npx flue run lease-analyzer --target node --id test-1 \
  --payload '{"mode":"analyze","leaseText":"Security deposit of 6 months rent...","stage":"pre-sign","state":"maharashtra"}'
```

Expected: JSON with clause analysis

**Step 3: Commit**

```bash
git add .flue/agents/lease-analyzer.ts
git commit -m "feat: implement lease analyzer agent handler"
```

---

### Task 6: Deploy agent

**Step 1: Build**

```bash
npx flue build --target node
```

**Step 2: Create GitHub repo and push**

```bash
gh repo create lease-shield-agent --public --source=. --push \
  --description "AI-powered Indian rental lease analyzer — Flue agent"
```

**Step 3: Deploy to Cloudflare or Railway (TBD based on testing)**

**Step 4: Commit**

```bash
git add -A && git commit -m "feat: production build config"
```

---

## Part 2: Next.js Frontend (`lease-shield-web`)

### Task 7: Scaffold Next.js project

**Step 1: Create project**

```bash
cd ~/Projects/lease-shield-web
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --no-import-alias --use-npm
npm install pdfjs-dist lucide-react
```

**Step 2: Set up design system**

- Add EB Garamond + Lato fonts
- Configure Tailwind v4 with custom colors (navy #0F172A, gold #F59E0B, purple #8B5CF6)
- Set up dark mode with `@custom-variant dark`
- Create CSS variables for the full color palette

**Step 3: Create .env.local**

```
NEXT_PUBLIC_AGENT_API_URL=http://localhost:3583
```

**Step 4: Commit**

```bash
git init && git add -A
git commit -m "feat: scaffold next.js frontend with design system"
```

---

### Task 8: Build Upload screen

**Files:**
- Create: `src/app/page.tsx` (upload screen as default)
- Create: `src/components/FileUpload.tsx` (drag-drop PDF component)
- Create: `src/lib/pdf.ts` (PDF text extraction using pdfjs-dist)

**Step 1: Build PDF text extraction utility**

Uses `pdfjs-dist` to extract text from uploaded PDF file → returns string.

**Step 2: Build drag-drop upload component**

- Drag-drop zone with PDF icon
- File input fallback
- Stage selector: "I'm about to sign" / "I already signed"
- State dropdown: Maharashtra, Karnataka, Delhi, Tamil Nadu, UP, etc.
- "Analyze My Lease" CTA button (purple pill)
- Loading state with skeleton animation

**Step 3: Wire up — on submit, extract PDF text, call agent API, navigate to report**

**Step 4: Test upload with a sample lease PDF**

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: upload screen with PDF extraction and state selector"
```

---

### Task 9: Build Report screen

**Files:**
- Create: `src/app/report/page.tsx`
- Create: `src/components/ClauseCard.tsx`
- Create: `src/components/ReportSummary.tsx`

**Step 1: Build ClauseCard component**

Each card shows:
- Left border colored by severity
- Lucide icon by category (Scale, Shield, AlertTriangle, IndianRupee, Lock, CheckCircle)
- Category label + severity badge
- Quoted clause text (monospace block)
- Plain English explanation
- Law reference as subtle tag
- Copyable action message (pushback script or rights)
- Fade-up animation on render (staggered)

**Step 2: Build ReportSummary bar**

- Icon-based counts: "⚖️ 2 violations · ⚠️ 3 risks · 💰 1 trap · ✅ 8 standard"
- Uses Lucide icons, not emojis

**Step 3: Build report page**

- Reads analysis data from URL state or context
- Renders summary bar + clause cards
- "Chat about this lease" button at bottom
- Back to upload button

**Step 4: Test with mock data**

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: report screen with clause cards and summary"
```

---

### Task 10: Build Chat screen

**Files:**
- Create: `src/app/chat/page.tsx`
- Create: `src/components/ChatMessage.tsx`

**Step 1: Build chat UI**

Same iMessage-style pattern from the portfolio site:
- Custom streaming via fetch + ReadableStream
- Suggested questions: "can I break the lock-in?", "is the painting clause enforceable?", "what if landlord won't return deposit?"
- Full lease context sent with each message
- Agent responds using chat-about-lease skill

**Step 2: Test multi-turn chat**

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: chat screen with streaming responses"
```

---

### Task 11: Polish and deploy frontend

**Step 1: Add shared layout**

- Nav with "Lease Shield" branding + dark/light toggle
- Responsive design check (375px, 768px, 1024px)

**Step 2: Create GitHub repo**

```bash
gh repo create lease-shield-web --public --source=. --push \
  --description "Lease Shield — AI-powered Indian rental lease analyzer"
```

**Step 3: Deploy to Vercel**

```bash
npx vercel --prod --yes
npx vercel env add NEXT_PUBLIC_AGENT_API_URL production
```

**Step 4: Final commit**

```bash
git add -A && git commit -m "feat: polish and deploy"
```

---

## Execution Order

1. Tasks 1-6: Flue Agent (backend must work first)
2. Tasks 7-11: Next.js Frontend (calls agent API)

Total: ~11 tasks, each 5-15 minutes.
