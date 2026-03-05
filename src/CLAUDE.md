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
        ├── AltChart          — radial bar chart; arc click scrolls to attribute heading
        ├── OpportunitiesCard — lists low-rated attributes; hidden until ratings are made
        ├── PropertyList      — key/value display (Radford level, experience)
        └── CareerAttribute (per attribute)
            └── RatingSelect — individual rating dropdown
```

## Shared Utilities

- `src/lib/attributeId.ts` — `toAttributeId(name)` converts an attribute name to a kebab-case element ID; used by `CareerAttribute`, `AltChart`, and `OpportunitiesCard` to connect scroll targets to headings

## Styling

This project uses Radix for component styling. There is almost never a scenario to use `style` props — use only what is available from Radix component props.

## Accessibility

This project uses Ariakit for accessibility. Evaluate all changes and additions against current accessibility guidelines. Always use semantically correct HTML tags.

## SSR Note

`AltChart` uses `useState(false)` + `useEffect(() => setIsClient(true))` to defer rendering until after hydration. This avoids visx/SVG SSR mismatches. Do not remove this pattern without testing hydration.
