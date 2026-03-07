# src/CLAUDE.md

## Architecture

State is path-based. No external state library.

- URL scheme: `/` → redirects to `/P1`; `/{level}` → level, no ratings; `/{level}/{encoded}` → level with base-36 encoded ratings
- `RatingsProvider` (`src/hooks/RatingsProvider.tsx`) — React context; initializes from URL synchronously on first render (lazy `useState` initializer, not `useEffect`), re-syncs on navigation; `setRating` calls `window.history.replaceState` (no remount)
- `useCareerParam` — reads `useParams().level`; `setLevel` calls `router.push`
- `useRatingParam` — reads/writes via `RatingsContext`
- `src/lib/ratingsEncoding.ts` — pure encode/decode utilities (base-5 with sentinel → base-36)

Data flows: URL path → RatingsProvider context → hooks → components → visx charts.

## Component Tree

```
layout.tsx         — header, CareerSelect, ResetButton, GitHub link; wraps body in RatingsProvider
├── [level]/page.tsx           — renders CareerThemes
└── [level]/[encoded]/page.tsx — renders CareerThemes
    └── CareerThemes — main orchestrator; reads level, groups attributes by theme
        ├── RatingsChart          — radial bar chart; arc click scrolls to attribute heading
        ├── OpportunitiesCard — two-tab card (Opportunities + Goal Prompt); hidden until ratings are made; receives levelKey/levelName from CareerThemes
        │   └── SmartGoalsPrompt — read-only textarea with interpolated LLM prompt and copy button; always rendered when OpportunitiesCard is visible
        ├── PropertyList      — key/value display (Radford level, experience)
        └── CareerAttribute (per attribute)
            └── RatingSelect — individual rating dropdown
```

## Shared Utilities

- `src/lib/attributeId.ts` — `toAttributeId(name)` converts an attribute name to a kebab-case element ID; used by `CareerAttribute`, `RatingsChart`, and `OpportunitiesCard` to connect scroll targets to headings
- `src/lib/chartGeometry.ts` — pure, server-safe arc geometry math (`computeChartGeometry`); shared between `RatingsChart` (client) and the OG image route (server). No browser APIs — safe to import from both contexts
- `src/lib/siteConfig.ts` — single source of truth for `SITE_TITLE`, `SITE_DESCRIPTION`, and `formatRatingDate`; used by `layout.tsx`, `ogChart.tsx`, and OG image routes

## Styling

This project uses Radix for component styling. There is almost never a scenario to use `style` props — use only what is available from Radix component props.

## Accessibility

This project uses Ariakit for accessibility. Evaluate all changes and additions against current accessibility guidelines. Always use semantically correct HTML tags.

## Testing Philosophy

Follow the testing pyramid: unit tests at the bottom (many, fast, isolated), e2e at the top (few, slow, integration).

**Unit tests** (colocated with source, e.g. `ratingsEncoding.test.ts` next to `ratingsEncoding.ts`):
- Pure functions in `src/lib/` — highest value, no mocking needed
- Hooks and components that require only simple mocks (e.g. `next/navigation` stubs)
- Do NOT unit test behavior already covered by e2e, and do NOT reach for complex mocking to make something testable at this level

**Push to e2e instead** when a test would require:
- Mocking `next/dynamic`, `next/navigation` internals beyond simple stubs, or other framework internals
- Simulating multi-component interaction or URL-driven state flows
- Verifying anything that only makes sense in a real browser environment

If a unit test is hard to write without heavy mocking, that is a signal the behavior belongs in e2e — fix the level, not the mock.

**When dropping behavior from unit tests:** always open a GitHub issue to add e2e coverage for that behavior before moving on. This ensures coverage gaps are tracked and closed at the correct level rather than left unverified.

## SSR / Code Splitting Note

`RatingsChart` and `OpportunitiesCard` are loaded via `next/dynamic` with `ssr: false` in `CareerThemes.tsx`. This prevents their heavy dependencies (visx, motion/react) from being included in the initial bundle and eliminates visx/SVG SSR mismatches entirely. The old `isClient` guard (`useState(false)` + `useEffect`) has been removed — `next/dynamic` with `ssr: false` is the correct approach for client-only components with large dependency footprints. See ADR-007.
