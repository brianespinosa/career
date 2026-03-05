# src/app/[level]/CLAUDE.md

## Route Structure

```
/[level]           — level with no ratings (src/app/[level]/page.tsx)
/[level]/[encoded] — level with base-36 encoded ratings (src/app/[level]/[encoded]/page.tsx)
```

Both pages validate the `level` param against `LEVELS` and call `notFound()` for unknown values. Both render `<CareerThemes />` — the level is read via `useParams()` in `useCareerParam`, and ratings are decoded from the path by `RatingsProvider`.

See `src/CLAUDE.md` for the full URL scheme and encoding details.
