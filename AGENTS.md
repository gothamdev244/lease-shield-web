<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Lease Shield Web

Next.js 16 frontend for the Lease Shield rental lease analyzer.

## Screens

- `/` — Upload screen: drag-drop PDF, stage selector (pre-sign/post-sign), state dropdown, PDF text extraction via pdfjs-dist
- `/report` — Report screen: clause cards with severity-colored borders, summary bar, law references, copyable action scripts
- `/chat` — Chat screen: iMessage-style UI with suggested questions, streaming responses from the agent
- `/demo` — Demo page: loads mock analysis data and redirects to report (for testing without a PDF)

## API Proxy Routes

- `POST /api/analyze` — Proxies to Fly.io agent (analyze mode). Avoids CORS.
- `POST /api/chat` — Proxies to Fly.io agent (chat mode). Streams response back.

## State Management

`LeaseProvider` in the root layout holds lease text, analysis results, and session ID across page navigations via React context.
