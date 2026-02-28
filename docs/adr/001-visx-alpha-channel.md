# ADR 001: Use @visx/visx Alpha Channel

## Status

Accepted

## Context

This project uses `@visx/visx` for SVG-based data visualizations. The project also uses React 19.

## Decision

We use the alpha channel release of `@visx/visx` (`4.0.1-alpha.0`) for the following reasons:

- **React 19 compatibility**: The latest stable release (`3.12.0`) declares peer dependency ranges that do not overlap with React 19. No stable release with React 19 support exists. The alpha channel is the only published version that supports React 19.

- **4.0 major version bump rationale**: The jump from 3.x to 4.0 was driven by several breaking changes, none of which affect the components this project uses:
  - React peer dependency formalized to `^16.14.0 || ^17 || ^18 || ^19`
  - `prop-types` removed in favor of TypeScript-only type safety
  - D3 internals (`d3-shape`, `d3-path`) upgraded to v3 — consumer API unchanged
  - IE 11 support dropped; modern browser targets only
  - Node.js 22+ now required (this project runs Node 24)
  - Automatic JSX transform adopted — internal refactor, no consumer impact

## Components in use

The following visx APIs are used in this project:

- `@visx/event` — `localPoint`
- `@visx/group` — `Group`
- `@visx/point` — `Point`
- `@visx/responsive` — `ScaleSVG`
- `@visx/scale` — `scaleLinear`, `scaleBand`, `scaleRadial`
- `@visx/shape` — `Line`, `LineRadial`, `Arc`
- `@visx/text` — `Text`
- `@visx/tooltip` — `TooltipWithBounds`, `useTooltip`, `defaultStyles`

None of these have API-level breaking changes between 3.x and 4.0.

## Consequences

- We accept the risk of depending on a pre-release version of visx.
- Once a stable 4.x release is published, we should migrate off the alpha channel.
