# ADR 006: CSV as Data Source of Truth with Generated JSON

## Status

Accepted

## Context

The application displays career competency data: attributes, theme groupings, and per-level descriptions for both IC and EM tracks. This data changes occasionally as the career ladder evolves.

Two formats are required:
- A human-editable format for maintaining the data
- A machine-readable format with TypeScript types for the application

Storing data directly as JSON creates friction: JSON is error-prone to edit manually, has no column-alignment affordances, and requires hand-editing TypeScript type files when the shape changes.

Storing data as TypeScript or a database adds engineering overhead disproportionate to the project's scale.

## Decision

CSV files in `data/` are the source of truth:

- `data/ic.csv` — IC track level definitions
- `data/em.csv` — EM track level definitions

JSON files are generated from CSVs using `mlr` (Miller):

- `yarn ic` → `data/ic.json`
- `yarn em` → `data/em.json`
- `yarn data-types` → TypeScript type declarations from JSON

The application imports only the generated JSON/types. **Edits to `data/*.json` or `data/*.d.ts` directly are incorrect** — they will be overwritten on the next generation run. See `data/CLAUDE.md` for details.

## Consequences

- Contributors must run generation scripts after editing CSVs; forgetting produces a stale/inconsistent application
- `mlr` must be installed locally to regenerate data (see README for setup)
- TypeScript types for data shapes are always derived from the actual data, eliminating manual type maintenance
- Adding or renaming attributes requires updating both the CSV and verifying that `src/lib/ratingsEncoding.ts` encoding still covers all attribute `param` values correctly
