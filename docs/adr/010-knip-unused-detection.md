# ADR-010: knip for Unused Dependency, File, and Export Detection

## Status

Accepted

## Context

The project had no automated tooling to detect unused dependencies, files, or exports. Unused deps accumulate silently over time — they inflate install size, add noise to audits, and carry hidden maintenance cost. Detecting them via manual review is unreliable.

Three broad approaches were considered:

1. **No tooling** — Rely on code review to catch unused deps. Unreliable; has already allowed `postcss`, `next-themes`, and `@bjeco/blocks` to go undetected.
2. **depcheck** — Detects unused npm dependencies, but does not detect unused files or exports, and lacks framework-aware plugins for Next.js and Vitest.
3. **knip** — Detects unused dependencies, devDependencies, files, and exports. Ships with built-in plugins for Next.js, Vitest, Playwright, and Biome — the project's full toolchain — which eliminates false positives from framework conventions without requiring custom configuration.

## Decision

Use **knip** as the tool for detecting unused code and dependencies.

- Added as a devDependency (`knip@5.86.0`)
- Runs as a CI job parallel to `biome`, `typecheck`, and `test`; required by `build`
- Uses `--reporter github-actions` for inline PR annotations
- Not added to lefthook pre-commit: the per-commit latency cost is not justified when the primary value (PR annotations) is CI-specific

### Intentional exceptions (`knip.ignoreDependencies` / `ignoreBinaries`)

Some packages are legitimately present but undetectable by static import analysis. These are tracked in the `"knip"` config block in `package.json`:

| Entry | Reason |
|---|---|
| `@react-spring/web` | Required peer dependency of `@visx/xychart` (bundled in `@visx/visx`). `.yarnrc.yml` enforces peer deps as errors (`YN0002`); removing it breaks `yarn install`. No direct source import exists because only `@visx/*` sub-packages are imported directly. |
| `@visx/*` | Code imports individual `@visx/` sub-packages (e.g. `@visx/shape`, `@visx/scale`), all of which are installed via the `@visx/visx` meta-package. knip cannot correlate sub-package import paths with the meta-package entry in `package.json`. |
| `normalize.css` | Imported via `@import url('normalize.css')` in `src/app/global.scss`. knip does not parse SCSS files, so the reference is invisible to static analysis. |
| `mlr` | External system binary (Miller) used in `em` and `ic` npm scripts. It is not an npm package; no `node_modules` entry exists for knip to resolve. |

**When adding a new exception:** document the reason as a comment in the `"knip"` block (use `knip.jsonc` if inline JSON comments are needed) and keep this ADR's table updated.

## Consequences

- Unused dependencies, files, and exports are caught automatically on every PR
- The `build` job is gated on `knip` passing, so a clean knip result is required to deploy
- First run surfaced and removed `postcss`, `next-themes`, and `@bjeco/blocks`
- The `ignoreDependencies` / `ignoreBinaries` lists must be maintained; stale entries should be removed when the underlying reason no longer applies
