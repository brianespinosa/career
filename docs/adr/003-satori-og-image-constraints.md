# ADR 003: Satori OG Image Constraints and Path to Future Reuse

## Status

Accepted

## Context

To generate OG preview images for Slack/social sharing, Next.js `ImageResponse` uses Satori to render React JSX to a PNG at build/request time. This is the canonical approach for server-side chart rendering in Next.js App Router.

The existing interactive chart (`AltChart.tsx`) cannot be passed directly to `ImageResponse` because of several Satori-specific constraints.

## Constraints Preventing Direct Reuse of `AltChart.tsx`

| Constraint | Reason |
|---|---|
| React hooks (`useState`, `useEffect`, `useParams`) | Satori renders a static snapshot; no browser runtime, no hook lifecycle |
| `motion/react` animations (`AnimatePresence`, `motion.*`) | Framer Motion depends on DOM APIs and browser animation APIs unavailable in Satori |
| `@visx` JSX components (`Arc`, `ScaleSVG`, `Group`) | Not guaranteed Satori-compatible; SVG path computation must be done manually |
| CSS custom properties (`var(--color-*)`) from Radix Themes | CSS variables are not resolved in Satori's rendering context; hex values must be hardcoded |
| `useSearchParams` / Next.js navigation | Not available in edge/server rendering context |

## Decision

Write a standalone `OgChart` computation alongside `opengraph-image.tsx` that:

1. Uses `@visx/scale` pure-JS functions (`scaleBand`, `scaleRadial`) — these are safe because they are framework-agnostic math utilities with no DOM dependencies
2. Computes SVG arc geometry with a plain `arcPath()` helper function
3. Renders inline SVG directly (no `@visx` JSX components)
4. Uses hardcoded Radix dark `*-6` hex values — see `opengraph-image.tsx` `THEME_COLORS` map
5. Reads ratings directly from `params` (no hooks, no search params)

## What Would Need to Change to Reuse `AltChart.tsx` with Satori

To enable sharing chart logic between the interactive chart and the OG image:

1. **Extract pure arc-computation math** into a separate utility (e.g., `src/lib/arcGeometry.ts`) with no DOM or React dependencies — takes scale config and attribute list, returns arc descriptors (startAngle, endAngle, outerRadius, color, label)
2. **Create a `PureAltChart` variant** that accepts pre-computed arc descriptors as props (no hooks, no animation, no CSS vars) — renders only static inline SVG elements
3. **Replace Radix color tokens** with a resolved color map injected at render time, so the same component works in both browser (CSS vars resolved) and Satori (hardcoded hex) contexts
4. **Remove animation wrappers** from the pure variant — `AnimatePresence`, `motion.*`, and `AnimatedNumber` must be absent
