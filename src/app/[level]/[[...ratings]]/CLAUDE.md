# src/app/[level]/[[...ratings]]/CLAUDE.md

See `src/CLAUDE.md` for overall architecture.

## URL Encoding Scheme

State is encoded entirely in path segments:

```
/{level}/{r0}/{r1}/{r2}/...

/P3                → P3 level, all attributes unrated
/P3/3/4/2          → P3 with first 3 attributes rated 3, 4, 2
```

Rules:
- **First segment**: level key (e.g. `P3`, `M4`) — from `data/ic.json` / `data/em.json`
- **Remaining segments**: rating values (1–4) in the order returned by `getAttributeParamsForLevel(level)` from `src/lib/ratingPath.ts`
- **Trailing zeros omitted** — missing segments default to 0 (unrated) on parse
- `[[...ratings]]` is an optional catch-all; no ratings segments means all unrated

Encoding/decoding utilities live in `src/lib/ratingPath.ts`.

## OG Image

`opengraph-image.tsx` receives `params: { level: string; ratings?: string[] }` directly from Next.js — no Route Handler needed.

See `docs/adr/003-satori-og-image-constraints.md` for why `AltChart.tsx` cannot be reused here and what the path to reuse would look like.

**Hardcoded colors**: The OG image uses Radix dark `*-6` hex values from `@radix-ui/colors`. If the palette changes, update `THEME_COLORS` in `opengraph-image.tsx`.

## History Behavior

| Action | Router call | History effect |
|---|---|---|
| Change level (CareerSelect) | `router.push(/{newLevel})` | New history entry |
| Change rating (RatingSelect) | `router.replace(buildRatingPath(...))` | Replaces current entry |
| Reset | `router.replace(/{level})` | Replaces current entry |
