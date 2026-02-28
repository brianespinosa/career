# src/CLAUDE.md

## Architecture

State lives entirely in URL query params via `nuqs`. No other state management.

- `useCareerParam` — manages the `lvl` param (selected career level)
- `useRatingParam` — manages per-attribute rating params (e.g. `acc`, `ctd`)

Data flows: URL params → hooks → components → visx charts.

## Component Tree

```
layout.tsx         — header, CareerSelect, reset dialog, GitHub link
└── page.tsx       — renders CareerThemes
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
