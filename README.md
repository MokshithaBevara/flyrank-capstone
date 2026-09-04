## Project Brief

Habit Tracker solves a real gap in most habit apps: they track data but never help you act on it. This app puts an AI coach directly in the loop — it can look up your actual streak and completion numbers (via a real tool call, not a guess) and give short, concrete advice based on them. It's built for anyone trying to build a consistent habit who wants quick, specific nudges rather than generic motivational text. I chose this idea because it let me build something genuinely useful (not a throwaway demo) while giving every week's coursework — streaming, tool calls, testing, accessibility, 3D, shaders — a real, integrated home instead of a dozen disconnected exercises.

# Habit Tracker

A habit-tracking app with an AI coach built in — chat with it for habit advice, ask it to look up your streak stats, and it responds with real, structured data instead of guesses.

Built as part of the FlyRank AI Fluency internship, Frontend AI Engineering track.

## Live URL

**Production:** https://flyrank-capstone-gamma.vercel.app/

Other routes worth checking:
- `/habits` — a validated habit-entry form
- `/button-demo` — a stateful, animated button system
- `/scene` — an interactive 3D "streak orb"
- `/hero` — a custom GLSL shader hero

## Screenshots

![Dashboard with AI chat and habit stats](public/dashboard.png)
![Shader hero](public/hero.png)

## What it does

- Chat with an AI habit coach for short, practical, concrete suggestions
- The coach can call a real tool (`getHabitStats`) to look up streak/completion numbers for a habit and render them as a stat card — not hallucinated text
- Add habits through a validated form
- Handles failure gracefully: a dropped connection shows a designed error state with a working retry, not a crash
- A small interactive 3D scene and a custom shader hero, both built as part of the 3D/shader coursework and kept as real, working parts of the app rather than throwaway demos

## Architecture

- **Framework:** Next.js 16 (App Router), React 19
- **AI:** Vercel AI SDK (`streamText`, `useChat`) talking to Google's Gemini via `@ai-sdk/google`. The chat route (`app/api/chat/route.ts`) defines a Zod-typed tool (`getHabitStats`) and streams a UI message stream back to the client.
- **State:** all client state is local React state — no global store, since the app doesn't need one yet
- **Styling:** Tailwind CSS
- **3D/shaders:** React Three Fiber + drei for the streak orb, a hand-written GLSL fragment shader for the hero
- **Testing:** Vitest + React Testing Library for component tests (chat states, tool-result rendering, form validation), Playwright for one end-to-end test of the primary flow. Both run in GitHub Actions CI on every push.

## Run it locally

git clone https://github.com/MokshithaBevara/flyrank-capstone.git
cd flyrank-capstone
npm install


Create a `.env.local` file in the project root (see the Environment Variables table below), then:

npm run dev


Open http://localhost:3000.

To run the tests:

npm test # component tests (Vitest)
npm run test:e2e # end-to-end test (Playwright)


## Environment variables

| Variable | Required | Description |
|---|---|---|
| `GOOGLE_GENERATIVE_AI_API_KEY` | Yes | API key for Google's Generative AI (Gemini), used by the chat route. Get one from Google AI Studio. Set this in `.env.local` for local dev, and in Vercel's Environment Variables settings for production. |

## Production hygiene

- `maxDuration = 30` set on the streaming chat route, so a stuck request can't run indefinitely
- A simple per-IP rate limit (10 requests/minute) and a message-length cap (2000 characters) on the chat route, so a stranger can't casually spam it and drain the API budget. This is an in-memory, best-effort limiter — it resets on cold starts and isn't shared across serverless instances, which is a known limitation of not using a persistent store (like Redis) for this. Documented honestly rather than overstated.

## Deployment checklist (signed off)

- [x] Environment variables set in Vercel (`GOOGLE_GENERATIVE_AI_API_KEY`)
- [x] Production build succeeds and deploys cleanly on every push to `main`
- [x] CI (GitHub Actions) runs the full test suite on every push and is green before considering a deploy "done"
- [x] Cross-browser pass completed: Chrome, Edge, Firefox all verified working. Safari/mobile Safari not tested — no Mac/iPhone access, documented as a known gap rather than skipped silently
- [x] AI route protected: rate limiting + input length cap in place
- [x] `maxDuration` set on the streaming route so a stuck request can't hang indefinitely
- [x] Accessibility audit run (Lighthouse + WAVE) and the one real issue found (missing input label) fixed and re-verified
- [x] README verified end-to-end: a clean clone + `npm install` + `npm run dev` actually works
- [ ] Custom domain — not set up; using the default Vercel domain (deliberate, not an oversight)
- [ ] Dedicated monitoring/alerting — not set up; Vercel's built-in deployment and runtime logs are the current visibility into errors

**Signed off by:** Mokshitha Bevara — September 2026

## Rollback plan

Vercel keeps every previous deployment. If a deploy to `main` breaks production: go to the Vercel dashboard → Deployments → find the last known-good deployment → "Promote to Production." This is a one-click action, no custom infrastructure involved. As a source-level alternative, `git revert` the breaking commit and push, which triggers a new clean deploy through the same CI/CD path.

## Testing evidence

- 11 component tests (Vitest + React Testing Library) across the chat component (empty/pending/streaming/error states), the tool-result component (all 4 lifecycle states), and a validated form
- 1 Playwright end-to-end test covering the primary flow, with the AI route mocked
- Both suites run in CI on every push
- Overall statement coverage: **65%** (Vitest v8 coverage), comfortably above the 50% bar.

![Test coverage report](public/coverage-report.png)

## Reflection

The hardest part of this project wasn't writing new code — it was debugging real mismatches between fast-moving package versions. The AI SDK's `ai` and `@ai-sdk/react`/`@ai-sdk/google` packages use independent version numbers that don't obviously correspond to each other, which caused two separate breaking errors (a `TypeError` from a stale package, then an `AI_UnsupportedModelVersionError`) before the chat even worked. The fix each time came from reading the actual error and checking real registry data, not from guessing based on general familiarity with the library.

If I did this again, I'd pin dependency versions more deliberately from the start instead of letting `npm install` pick whatever's latest, and I'd set up the test suite and CI earlier in the process rather than treating it as a separate later step — several of the bugs I hit (like a debug line I forgot to remove, or a file edit that silently didn't save) would have been caught immediately by a test run instead of manual clicking around.

The thing that genuinely surprised me: a browser extension quietly broke keyboard Tab navigation on my own machine during accessibility testing, which looked exactly like a real bug in my code. It took forcing pseudo-states in DevTools and testing with extensions disabled to figure out the CSS and keyboard handling were actually correct the whole time — the "bug" was in my testing environment, not my app. It was a good reminder to verify a problem is actually in the code before assuming it is.

## Cross-browser testing

Tested and working on:
- Chrome (primary development browser)
- Microsoft Edge
- Firefox

**Not tested:** Safari / mobile Safari — I don't have access to a Mac or iPhone. Mobile responsiveness was tested via Chrome DevTools' device emulation (touch, viewport sizing, `prefers-reduced-motion`), but that's not a substitute for a real Safari test, and I'm noting that gap honestly rather than claiming full cross-browser coverage.

## Decisions worth explaining

- **Sample/in-memory habit data instead of a real database:** the app doesn't have real persistent habit storage yet, so `getHabitStats` reads from a small hardcoded object in the route file. The tool's input/output contract is designed so swapping this for a real database later wouldn't require changing the tool itself.
- **In-memory rate limiting instead of a real rate-limiting service:** a proper solution (e.g. Upstash Redis) would work correctly across serverless cold starts; the in-memory version here is a reasonable stopgap for a project at this stage, not a production-grade solution, and I've said so above rather than pretending otherwise.

## How AI tools built this

I used Claude throughout this project, mostly through Claude.ai's chat interface, walking through each assignment step by step rather than having it generate the whole app unsupervised. Specifics:

- **Debugging real errors, not just writing code from scratch.** A recurring theme was the AI SDK's package versions being out of sync (`ai` package pinned to an old v4 while `@ai-sdk/react`/`@ai-sdk/google` expected v7), which caused a `TypeError` and later an `AI_UnsupportedModelVersionError`. Claude diagnosed both by reading the actual error stack and checking package registry data, rather than guessing.
- **Migrating the chat client from a hand-rolled fetch/SSE reader to the AI SDK's `useChat` hook**, when the app needed to support typed tool-call lifecycle states (input-streaming, input-available, output-available, output-error) for the FE-07 assignment.
- **Writing the GLSL shader** for the `/hero` page — Claude wrote the fragment shader and explained what each block does (the flow field, the mouse-distance "pull," the vignette, the grain pass), which I could then read back and understand well enough to explain it myself.
- **Setting up the whole test suite** (Vitest config, React Testing Library tests, mocking `useChat`, a Playwright end-to-end test with a mocked SSE response matching the AI SDK's actual wire protocol) and the GitHub Actions CI workflow, including debugging two real CI-only failures (Vitest accidentally picking up the Playwright spec file, and a Node version too old for a dependency).
- **Running and interpreting Lighthouse/WAVE audits**, then implementing the specific fixes they surfaced (a missing `aria-label` on the chat input, `aria-live` for streamed replies).
- I did not have Claude "vibe code" entire features blind — for each assignment, I ran the app myself after every change, reported back what actually happened (including several real bugs it didn't anticipate, like a debug line accidentally left in, or a file edit that silently didn't save), and it adjusted based on that real feedback rather than assuming success.

## What I'd add with more time

- Real habit persistence (a database instead of the sample in-memory data)
- A production-grade rate limiter (Upstash Redis or similar) instead of the in-memory one
- Actual Safari/mobile Safari testing on real hardware
- Wiring the 3D streak orb's color to a habit's actual real-time progress instead of being purely decorative

## Other coursework in this repo

A few things in this repo predate the capstone build and are kept as-is since they're real completed work, not clutter:

- **`WORKFLOW.md`** — a vague-vs-precise prompting comparison exercise (same feature, built twice with different prompt quality, comparing correctness, accessibility, and review effort).
- **`NOTES.md`** and **`playground/`** — a hand-built-vs-shadcn/ui accessibility comparison. `playground/Modal.tsx`, `Tabs.tsx`, and `Disclosure.tsx` are ARIA patterns implemented from scratch, then compared against `components/ui/` (shadcn primitives) to find real gaps (portal rendering, orientation support, uncontrolled state).
- **`app/calendar`, `app/health`, `app/stats`** — placeholder routes scaffolded early on, not yet built out. Only `/habits` and the dashboard chat are fully implemented.

## Adding the next case study

New projects go into this README as a new `## Project: <name>` section, using the same three-beat shape every time:

1. **Problem** — one or two sentences on what needed solving and why
2. **What I did** — the concrete approach, tools, and any real tradeoffs made
3. **What came of it** — the outcome: what shipped, what I learned, what I'd change

**Next piece of work:** Real habit persistence — replace the in-memory `SAMPLE_HABITS` object with an actual database (likely a simple hosted SQLite via Turso, or Postgres via Neon/Supabase), so habits added via the `/habits` form are real, the `getHabitStats` AI tool queries real data instead of a hardcoded object, and the Calendar/Stats/Health pages have real data to build against.