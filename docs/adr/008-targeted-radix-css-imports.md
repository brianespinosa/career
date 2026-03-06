# ADR-008: Targeted Radix UI Themes CSS Imports

**Status:** Accepted

## Context

Lighthouse flagged three CSS chunks as render-blocking, with an estimated savings of 190 ms affecting both LCP and FCP:

| Chunk | Transfer Size | Duration |
|-------|--------------|----------|
| `chunks/e6f2a226439aed92.css` | 77.5 KiB | 200 ms |
| `chunks/4e1aabe40b9d049f.css` | 1.3 KiB | 120 ms |
| `chunks/5956b625b1a7d374.css` | 0.8 KiB | 120 ms |

The dominant chunk was the Radix UI Themes stylesheet, loaded via `@import url('@radix-ui/themes/styles.css')` in `src/app/global.scss`. This imports the full Radix CSS bundle (683 KB uncompressed) synchronously on every page, including styles for ~50 components, of which this project uses 16.

## Decision

Replace the monolithic `@radix-ui/themes/styles.css` import with targeted imports from `@radix-ui/themes/src/components/` for only the components this project actually uses:

- `tokens.css` — CSS variables (required for all theming)
- `reset.css`, `animations.css` — base styles
- `layout.css` — covers `Box`, `Flex`, `Grid`, `Section`, `Container`
- `skeleton.css` — must precede other components (lower border-radius specificity)
- `text.css` — must precede other components (commonly extended)
- Individual files for: `AlertDialog`, `Button`, `Card`, `DataList`, `Heading`, `IconButton`, `Link`, `Select`, `Separator`, `Tooltip`
- Inline replication of the root `Theme` stacking-context rule from `src/components/index.css`

**Approaches considered and rejected:**

- **PurgeCSS / CSS tree-shaking** — would require integrating a PostCSS plugin into the Next.js build pipeline, adding build complexity for the same outcome.
- **Non-blocking load (preload/print trick)** — defers parsing but the full file still downloads; doesn't reduce transfer size.
- **Tailwind migration** — disproportionate scope; ruled out in ADR-005.

**Result:** Total uncompressed CSS reduced from 686 KB to 208 KB (~70% reduction).

## Consequences

- **Trade-off:** The imported files live under `src/`, which Radix does not version-contract as a public API. The `dist/`-level `styles.css` and `tokens.css` are stable; the `src/components/*.css` files are not explicitly guaranteed across minor versions.
- **Mitigation:** The Radix Themes major version is pinned in `package.json`. CSS regressions during upgrades should be caught by visual review.
- **Exit path:** If Radix restructures `src/components/` in a future version, the preferred remediation is to migrate from `@radix-ui/themes` to Radix primitives with project-owned styles, rather than maintaining targeted source imports against a moving target. See ADR-005 for the original Radix Themes adoption rationale.
- **Maintenance:** When adding a new Radix component to the project, its corresponding `src/components/*.css` file must be added to `src/app/global.scss`. The component audit covers all files under `src/` as of this ADR.
