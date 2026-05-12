# Mitharva AI — PRD

## Original Problem Statement
Premium full-stack multi-page web app called **Mitharva AI** — India's first AI-powered interview preparation platform for Government Job aspirants (UPSC, SSC, Banking, Railway) and Campus Placements. Brand: navy + gold (extracted from logo). Sanskrit tagline "अभ्यासेन सिद्धिः". 13 pages including a signature live AI interview room with camera + voice + animated gold orb + 3-AI panel. Dark + light mode required.

## Architecture
- **Backend:** FastAPI + MongoDB (`/api/*` routes). JWT auth (bcrypt). Gemini 3 Flash via Emergent Universal Key (emergentintegrations). Mock Razorpay.
- **Frontend:** React Router v6 + Tailwind + shadcn/ui + Recharts + sonner. Web Speech API for STT/TTS (browser-native).
- **Theme:** Dark by default; functional light toggle.
- **Demo user:** demo@mitharva.ai / Demo@2026 (auto-seeded with 12 sessions).

## Personas
- UPSC aspirants in tier-2/3 cities who can't afford Delhi coaching
- Engineering students prepping for TCS/Infosys/Amazon campus placements
- Banking PO and SSC CGL candidates

## Core Requirements
- Multi-page React app with public + protected routes
- AI-powered live interview (voice + camera + orb)
- Live scoring across 6 dimensions
- Question bank, current affairs, profile, subscription
- Edge-to-edge wide premium UI with navy + gold palette

## Implemented (Feb 2026)
- ✅ Backend (server.py) — 19 endpoints, all `/api`-prefixed
  - Auth (signup/login/me, JWT)
  - Profile (PATCH)
  - Sessions (create/list/get/turn/complete) — Gemini 3 Flash powered
  - Practice feedback (LLM)
  - Current affairs + news questions (LLM)
  - Mock subscription + billing history
  - Dashboard stats with radar + chart data
  - Seed data on startup: 30 questions, 10 current affairs, demo user + 12 sessions
- ✅ Frontend — 13 pages built
  - Landing (9 sections), About, Pricing, Signup, Login
  - Dashboard with Recharts (line + radar), stats, recent table, weak areas
  - Interview Setup (5-step wizard)
  - **Live Interview Room** — camera feed, gold pulsing orb (idle/listening/processing/speaking), 3-AI panel with animated speaking indicator, transcript with typewriter, live analytics sidebar, end confirmation
  - Results — animated score ring, radar, transcript, body language, action plan
  - Practice — filters + modal with voice/text + AI feedback
  - Current Affairs — top 5 digest + category tabs + AI question generation
  - Profile — 4 tabs (Personal/Exam/Resume/Achievements)
  - Subscription — current plan, upgrade flow (mock Razorpay), billing history
- ✅ Dark/light theme toggle (default dark)
- ✅ Brand identity — custom SVG logo, Cormorant Garamond + Outfit + JetBrains Mono + Noto Sans Devanagari
- ✅ Animations — particle field, gold orb states, score ring draw, wave bars, typewriter, fade-up stagger
- ✅ data-testids on all interactive elements
- ✅ 31/31 backend tests passing (100%)

## Test Credentials
- demo@mitharva.ai / Demo@2026 (auto-seeded)

## Mocked Integrations
- **Razorpay** — UI + backend mock-pay endpoint (no real payment processed)
- **Voice STT/TTS** — Browser Web Speech API (not OpenAI Whisper as originally chosen, because Emergent key doesn't cover OpenAI TTS; falls back gracefully)

## Backlog (P1)
- Real Whisper STT integration on backend (upload audio file to /api/voice/stt)
- Resume PDF parsing endpoint
- Real Razorpay test mode integration
- Multi-language voice interview (Hindi/Tamil)
- PDF report download for results

## Backlog (P2)
- Onboarding wizard modal post-signup
- Bookmarks API
- Streaks daily check-in
- College enterprise dashboard

## Next Action Items
- Validate frontend UX flow with screenshot/visual test
- Real Whisper STT for crisper voice transcription on the server side
- Add deferred onboarding wizard
