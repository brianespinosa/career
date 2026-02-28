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
        ├── AltChart      — radial bar chart (primary visualization)
        ├── PropertyList  — key/value display (Radford level, experience)
        └── CareerAttribute (per attribute)
            └── RatingSelect — individual rating dropdown
```

## Known Issues

- `AltChart.tsx` has a `console.log('TODO: Scroll to', attr)` in the Arc click handler (`AltChart.tsx:122`) — scroll-to-attribute behavior is not yet implemented
- `RatingSelect.tsx` has two type assertions with `// TODO` comments — types should be tightened in `useRatingParam` so assertions aren't needed at the call site
- `CareerChart.tsx` is dead code — the radar/spider chart is fully implemented but not imported anywhere; see dead code section below

## SSR Note

`AltChart` uses `useState(false)` + `useEffect(() => setIsClient(true))` to defer rendering until after hydration. This avoids visx/SVG SSR mismatches. Do not remove this pattern without testing hydration.
