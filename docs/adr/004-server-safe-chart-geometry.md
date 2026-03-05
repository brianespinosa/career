# ADR 004: Server-Safe Chart Geometry Extraction

## Status

Accepted

## Context

The radial bar chart (`RatingsChart`) is a `'use client'` component that uses React hooks, Framer Motion, and Radix CSS variables (`var(--red-6)`). Adding OG image generation required rendering the same chart server-side via `next/og` (`ImageResponse` / Satori).

Satori is a server-only JSX-to-image renderer with strict constraints:

- Cannot execute React hooks
- Cannot resolve CSS custom properties (`var(...)`)
- Cannot run Framer Motion
- Does not support `<text>` SVG elements

A naive solution — copying the arc math into the OG image route — would duplicate the scale math and create a drift risk between the visual chart and OG images.

## Decision

All arc geometry math is extracted into `src/lib/chartGeometry.ts`, a pure module with no browser APIs, no React, and no CSS variable references.

- `computeChartGeometry()` takes an array of `{ key, name, colorName, value }` and returns `ArcGeometry[]` with pre-computed start/end angles, radii, text positions, and SVG path strings
- Resolved hex colors from `@radix-ui/colors` (JS import, not CSS) are stored on each `ArcGeometry` — no CSS vars needed in the OG context
- `d3-shape` (`arc()`) is used directly for path generation; it is declared as an explicit dependency in `package.json` (previously transitive via `@visx/visx`)
- `RatingsChart` and the OG image route (`opengraph-image.tsx`) both import from `chartGeometry.ts` — one shared source of truth

## Consequences

- The interactive chart and OG images are guaranteed to use identical arc positions and proportions
- `chartGeometry.ts` must remain side-effect-free and import-safe from server routes — do not add browser APIs, React hooks, or CSS imports to it
- Arc ordering in `buildArcs()` (`src/lib/ogChart.tsx`) must match the ordering that `RatingsChart` produces via `Object.groupBy(themeGroups)`; this constraint is documented in both files
