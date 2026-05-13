@AGENTS.md

# Lease Shield Web

Next.js 16 frontend for AI-powered Indian rental lease analysis.

## Stack

- **Framework**: Next.js 16 (App Router, React 19)
- **Styling**: Tailwind v4 with `@custom-variant dark`, CSS variables for theming
- **Fonts**: Inter (display/body), JetBrains Mono (clause text)
- **Icons**: Lucide React
- **PDF extraction**: pdfjs-dist (legacy build, dynamic import to avoid SSR issues)
- **Design reference**: Coinbase-inspired (see `DESIGN-coinbase-ref.md`)

## Deployment

- **Platform**: Vercel
- **URL**: https://lease-shield-web.vercel.app
- **GitHub**: https://github.com/gothamdev244/lease-shield-web

### Vercel env vars

- `AGENT_API_URL` — Server-side only. Points to the Fly.io agent: `https://lease-shield-agent.fly.dev`
- `NEXT_PUBLIC_AGENT_API_URL` — (legacy, no longer used since API proxy was added)

## Backend Agent

- **URL**: https://lease-shield-agent.fly.dev
- **GitHub**: https://github.com/gothamdev244/lease-shield-agent
- **Platform**: Fly.io (Singapore region)
- **Framework**: Flue (`@flue/sdk` v0.5.3) + Gemini 2.5 Flash

## Deploy commands

```bash
npx vercel --prod --yes                               # Deploy to Vercel
npx vercel env add AGENT_API_URL production            # Set agent URL
```

## Key gotchas

- pdfjs-dist must use `legacy` build and dynamic `import()` — top-level import breaks SSR (`DOMMatrix is not defined`)
- Frontend calls `/api/analyze` and `/api/chat` (same-origin proxy), NOT the Fly.io agent directly — avoids CORS
- `LeaseProvider` wraps the entire app in `AppShell` (root layout) so state persists across page navigations
- Dark mode uses `.dark` class on `<html>` with `@custom-variant dark` in Tailwind v4
