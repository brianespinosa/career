# src/app/[level]/CLAUDE.md

## Route Structure

```
/[level]           — level with no ratings (src/app/[level]/page.tsx)
/[level]/[encoded] — level with base-36 encoded ratings (src/app/[level]/[encoded]/page.tsx)
```

Both pages validate the `level` param against `LEVELS` and call `notFound()` for unknown values. Both render `<CareerThemes />` — the level is read via `useParams()` in `useCareerParam`, and ratings are decoded from the path by `RatingsProvider`.

`/[level]/[encoded]/opengraph-image.tsx` is a Next.js file-based metadata route that generates the `og:image` PNG for the encoded ratings page. It uses `next/og` (`ImageResponse` + Satori). **Satori cannot use CSS classes or Radix components** — `OgLayout` in `src/lib/ogChart.tsx` uses inline styles exclusively for this reason.

See `src/CLAUDE.md` for the full URL scheme and encoding details.
