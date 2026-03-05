# ADR 003: Path-Based URL State

## Status

Accepted

## Context

Career level and attribute ratings must be shareable via URL so users can link directly to a specific assessment. The initial implementation used `nuqs`, a library that syncs React state to URL query parameters.

The `nuqs` approach introduced friction:

- Query parameters produce URLs like `?c=1&e=2&...` — verbose and fragile when attribute keys change
- `nuqs` required wrapping the app in a `NuqsAdapter` provider and added a third-party dependency for what is essentially a routing concern
- Query parameters are not suited to a Next.js App Router architecture where dynamic segments are first-class

## Decision

State is encoded in the URL path, not query parameters:

- `/` redirects to `/P1` (default level)
- `/{level}` — level selected, no ratings set
- `/{level}/{encoded}` — level with base-36 encoded ratings

The encoding is handled by `src/lib/ratingsEncoding.ts` (pure encode/decode, no browser APIs). `RatingsProvider` initializes synchronously from the URL path via a lazy `useState` initializer — not `useEffect` — to avoid hydration mismatches. Updates use `window.history.replaceState` so ratings changes do not cause remounts or push history entries.

`nuqs` has been removed entirely.

## Consequences

- URLs are short and human-readable (e.g., `/P3/3f5c1zhm`)
- Path segments are valid Next.js dynamic segments, enabling file-based OG image routes (`[level]/[encoded]/opengraph-image.tsx`)
- Encoding is a custom format; `src/lib/ratingsEncoding.ts` must be kept in sync with the attribute set in `data/`
- Level navigation uses `router.push` (adds a history entry); rating changes use `replaceState` (no history entry) — this is intentional
