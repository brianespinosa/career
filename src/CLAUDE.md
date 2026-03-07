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
        │   └── SmartGoalsPrompt — read-only textarea with interpolated LLM prompt and copy button; disabled when no opportunity attributes exist
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

## SSR / Code Splitting Note

`RatingsChart` and `OpportunitiesCard` are loaded via `next/dynamic` with `ssr: false` in `CareerThemes.tsx`. This prevents their heavy dependencies (visx, motion/react) from being included in the initial bundle and eliminates visx/SVG SSR mismatches entirely. The old `isClient` guard (`useState(false)` + `useEffect`) has been removed — `next/dynamic` with `ssr: false` is the correct approach for client-only components with large dependency footprints. See ADR-007.
