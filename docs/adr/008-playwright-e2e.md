# ADR-008: Playwright for E2E Testing

## Status

Accepted

## Context

The project has Lighthouse CI for performance audits but no behavioral e2e tests.
Unit tests with mocks are insufficient for several key behaviors:

- **URL-driven state initialization** — `RatingsProvider` decodes ratings from the URL path on first render; a real browser and real navigation are required to exercise this.
- **Dynamic imports** — `RatingsChart` and `OpportunitiesCard` are loaded via `next/dynamic` with `ssr: false`; they are absent from the initial HTML and only mount after client hydration.
- **Radix UI portals** — `Select.Content` and `AlertDialog.Content` mount outside the component tree; testing their behavior requires a real DOM.
- **`history.replaceState`** — `setRating` and `clearRatings` update the URL without triggering a Next.js navigation; only real browser URL checks can verify this.

Six frameworks were evaluated. WebdriverIO, TestCafe, and Puppeteer were eliminated early: WebdriverIO adds significant configuration overhead with no meaningful advantage over Playwright for this use case; TestCafe is no longer actively maintained; Puppeteer lacks a built-in test runner and assertion library, requiring additional dependencies that Playwright bundles. The remaining three were evaluated in detail:

| Criterion | Playwright | Cypress | Vitest browser mode |
|---|---|---|---|
| TypeScript — first class | Yes | Partial | Yes |
| Async/await — native | Yes | No (command queue) | Yes |
| Remote URL testing | Yes | Yes | No |
| Portal / out-of-tree DOM | Yes | Yes | Yes |
| `replaceState` URL assertion | Yes | Requires workaround | N/A |
| Vercel bypass via header | Yes | Possible | N/A |
| Bundle size (CI install) | ~120 MB (chromium only) | ~600 MB | Minimal |
| Active maintenance | Microsoft | Cypress.io | Vitest team |

## Decision

Use `@playwright/test` for e2e testing.

Playwright wins on every criterion that matters for this project. Its native async/await model, reliable auto-waiting, and built-in support for `extraHTTPHeaders` (used for the Vercel bypass token) make it the clear choice over Cypress. Vitest browser mode is not designed for full-page navigation flows against remote deployed URLs.

Tests run against Vercel preview deployments only — not against `next dev`. This is intentional: the tests validate the same artifact that ships to production.

## Consequences

- `@playwright/test` added as a devDependency (pinned exactly per `.yarnrc.yml` convention).
- Tests live in `e2e/` at the repository root. See `e2e/CLAUDE.md` for conventions.
- A new `e2e` CI job runs after `build`, in parallel with `lighthouse`, on `pull_request` only.
- `PLAYWRIGHT_BASE_URL` is injected from the `build` job's Vercel preview URL output.
- `VERCEL_BYPASS_SECRET` is shared with the `lighthouse` job — no new secrets required.
- The bypass token is passed as an HTTP header (`x-vercel-protection-bypass`) rather than a query parameter (contrast with the Lighthouse job, which appends it to the URL).
- Only Chromium is used in CI, matching the Lighthouse job scope.
- `playwright-report/` and `test-results/` are gitignored; the report is uploaded as a CI artifact on every run (including failures).
