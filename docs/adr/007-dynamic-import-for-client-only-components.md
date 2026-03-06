# ADR-007: Dynamic Import for Client-Only Components

**Status:** Accepted

## Context

Lighthouse reported ~79.9 KiB of saveable JavaScript in the initial bundle. The root cause was that `RatingsChart` (visx + motion/react) and `OpportunitiesCard` (motion/react) were statically imported in `CareerThemes`, causing their entire dependency graphs to ship on first load even though neither component is above-the-fold content.

`RatingsChart` previously used an `isClient` guard (`useState(false)` + `useEffect(() => setIsClient(true))`) to avoid visx/SVG SSR mismatches. While this deferred rendering until after hydration, it did not prevent the module from being downloaded in the initial bundle — the full visx and motion dependency trees still shipped upfront.

## Decision

Use `next/dynamic` with `ssr: false` for both `RatingsChart` and `OpportunitiesCard` in `CareerThemes.tsx`.

Both components are `'use client'` components that share `motion/react` as a dependency. Splitting only one would leave `motion` in the initial bundle via the other, so both must be split together to achieve the full bundle reduction.

The `isClient` guard in `RatingsChart` has been removed. `next/dynamic` with `ssr: false` supersedes it: the component is never server-rendered (eliminating the visx/DOM mismatch) and the module is not downloaded until needed (reducing initial bundle size).

A `<Suspense>` boundary with a `<Skeleton>` fallback wraps the `RatingsChart` in `CareerThemes` to provide a placeholder while the chunk loads.

## Consequences

- Initial JavaScript bundle is reduced by deferring visx and motion/react chunks.
- `RatingsChart` no longer contains the `isClient` pattern — hydration safety is guaranteed by `ssr: false`.
- The `<Suspense>` skeleton fallback for `RatingsChart` provides a visible loading state.
- The existing `<Suspense>` with no fallback around `OpportunitiesCard` is intentional — the card starts hidden when no ratings exist, so an empty fallback is correct.
- `chartGeometry.ts` is unaffected: it is a pure, server-safe module imported directly by the OG image route, not through `RatingsChart`.
