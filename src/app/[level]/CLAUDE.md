# src/app/[level]/CLAUDE.md

## Route Structure

```
/[level]           — level with no ratings (src/app/[level]/page.tsx)
/[level]/[encoded] — level with base-36 encoded ratings (src/app/[level]/[encoded]/page.tsx)
```

Both pages validate the `level` param against `LEVELS` and call `notFound()` for unknown values. Both render `<CareerThemes />` — the level is read via `useParams()` in `useCareerParam`, and ratings are decoded from the path by `RatingsProvider`.

`/[level]/opengraph-image.tsx` and `/[level]/[encoded]/opengraph-image.tsx` are Next.js file-based metadata routes that generate `og:image` PNGs. Both use `next/og` (`ImageResponse` + Satori). **Satori cannot use CSS classes or Radix components** — `OgLayout` and `OgSimpleLayout` in `src/lib/ogChart.tsx` use inline styles exclusively for this reason. The root `/opengraph-image.tsx` follows the same pattern for the home page.

See `src/CLAUDE.md` for the full URL scheme and encoding details.
