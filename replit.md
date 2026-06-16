# Berliner Küche

A secure AI-powered restaurant ordering chatbot for Berliner Küche, a German restaurant. Customers can chat with an AI concierge to explore the menu, get dish recommendations, ask about allergens, and place orders — in English or German.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/berliner-kuche run dev` — run the frontend (port 21826)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS + shadcn/ui
- API: Express 5
- AI: Groq SDK (llama-3.3-70b-versatile)
- Validation: Zod, express-rate-limit
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — API contract (source of truth)
- `lib/api-client-react/src/generated/` — generated React Query hooks
- `lib/api-zod/src/generated/` — generated Zod schemas
- `artifacts/api-server/src/routes/chat.ts` — chat + menu endpoints
- `artifacts/api-server/src/lib/menu.ts` — menu data + AI system prompt
- `artifacts/berliner-kuche/src/pages/Chat.tsx` — main chat UI

## Architecture decisions

- Contract-first: OpenAPI spec drives both client hooks and server validation schemas via Orval codegen
- Menu data is embedded in the server (no DB needed) — fast and simple for a fixed restaurant menu
- AI system prompt is built from the live menu data in `menu.ts` ensuring the AI always knows the current menu
- Rate limiting (20 req/min per IP) on the chat endpoint only; `trust proxy: 1` set for Replit's reverse proxy
- No auth required — this is a public-facing restaurant chatbot

## Product

- Full-screen dark-themed chat interface with warm amber accents
- AI concierge answers in English or German depending on the customer's language
- Quick-action chips: Show menu, Vegetarian options, Allergen info, Today's specials, Make a recommendation
- Inline scrollable menu panel with dish cards (German/English names, prices, categories, allergens)
- Typing indicator animation, auto-scroll, Enter to send

## Security

- `GROQ_API_KEY` stored as Replit secret, never in code
- Input validated with Zod on every endpoint (message max 1000 chars, history max 50 msgs)
- Rate limiting: 20 requests/minute per IP on `/api/chat`
- All errors handled gracefully — 429, 401, 500 from Groq all return safe messages
- `trust proxy: 1` ensures rate limiter reads real client IP behind Replit proxy

## User preferences

- Dark theme only (no light mode)
- No emojis in the UI
- German dish names with English translations shown side-by-side

## Gotchas

- Always run codegen after changing `lib/api-spec/openapi.yaml`
- Body schema names in openapi.yaml must be entity-shaped (e.g. `NoteInput`), not operation-shaped (e.g. `CreateNoteBody`), to avoid TS2308 collisions
- `trust proxy: 1` is required in `app.ts` because express-rate-limit reads X-Forwarded-For and Replit is a reverse proxy

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
