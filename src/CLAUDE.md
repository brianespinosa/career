# src/CLAUDE.md

## Architecture

State lives entirely in path segments. No query params, no external state management.

- `useCareerParam` — reads `params.level`; level changes call `router.push(/{newLevel})`
- `useRatingParam` — reads a single attribute's rating from parsed `params.ratings`; rating changes call `router.replace(buildRatingPath(...))`
- `src/lib/ratingPath.ts` — pure encode/decode utilities (`getAttributeParamsForLevel`, `buildRatingPath`, `parseRatings`)

Data flows: URL path segments → hooks → components → visx charts.

## Component Tree

```
layout.tsx         — header, CareerSelect, ResetButton, GitHub link
└── [level]/[[...ratings]]/page.tsx  — renders CareerThemes
    └── CareerThemes — main orchestrator; reads level, groups attributes by theme
        ├── AltChart          — radial bar chart; arc click scrolls to attribute heading
        ├── OpportunitiesCard — lists low-rated attributes; hidden until ratings are made
        ├── PropertyList      — key/value display (Radford level, experience)
        └── CareerAttribute (per attribute)
            └── RatingSelect — individual rating dropdown
```

## OG Image

`src/app/[level]/[[...ratings]]/opengraph-image.tsx` — Next.js file-based OG image. Receives params directly; no Route Handler needed. See `docs/adr/003-satori-og-image-constraints.md` for Satori constraints.

## Shared Utilities

- `src/lib/attributeId.ts` — `toAttributeId(name)` converts an attribute name to a kebab-case element ID; used by `CareerAttribute`, `AltChart`, and `OpportunitiesCard` to connect scroll targets to headings
- `src/lib/ratingPath.ts` — path encode/decode utilities shared by hooks, OG image, and navigation

## Styling

This project uses Radix for component styling. There is almost never a scenario to use `style` props — use only what is available from Radix component props.

## Accessibility

This project uses Ariakit for accessibility. Evaluate all changes and additions against current accessibility guidelines. Always use semantically correct HTML tags.

## SSR Note

`AltChart` uses `useState(false)` + `useEffect(() => setIsClient(true))` to defer rendering until after hydration. This avoids visx/SVG SSR mismatches. Do not remove this pattern without testing hydration.
