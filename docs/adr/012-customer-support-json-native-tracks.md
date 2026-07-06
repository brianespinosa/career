# ADR 012: Customer Support Section with JSON-Native Tracks

## Status

Accepted

## Context

The app originally modeled Software Engineering career ladders (IC, EM, and their ML
variants), all sourced from spreadsheet exports and maintained as CSVs that generate JSON
(see ADR-006). A new **Customer Support** job architecture needed to be added, covering three
tracks — Product Support (PS), Technical Support Engineering (TSE), and Customer Support
managers (EM) — with a competency model that differs from the SWE ladders in two ways:

1. **Different grouping dimensions.** Support competencies are organized into **Impact,
   Collaboration, and Growth** categories rather than the SWE `WHAT`/`WHO`/`WHY`/`HOW` themes.
2. **Different, non-overlapping competencies.** e.g. Customer Centricity, Problem Solving,
   Technical Proficiency, Resourcefulness, Strategic Execution, Change Management. None are
   shared with the SWE attribute set, and Support reuses names like "Accountability" under a
   different category, so the attribute keys cannot be reused.

The source material was a Confluence document, not a spreadsheet, so the ADR-006 CSV pipeline
added friction with no benefit (and the committed SWE JSON has itself diverged from the
`mlr --c2j cat` scripts, which emit a flat array rather than the level-keyed nested shape the
app consumes).

## Decision

1. **Add three JSON-native track files** — `data/cs-ps.json`, `data/cs-tse.json`,
   `data/cs-em.json` — authored directly in the committed level-keyed nested shape
   (`{ key, name, experience, attributes }`). No CSV source and no `yarn` generation script.
   This is a **scoped deviation from ADR-006**: ladders sourced from a spreadsheet remain
   CSV-backed; ladders sourced from prose are authored as JSON. ADR-006 stays `Accepted` for
   the SWE tracks.
2. **Add three themes** to `data/themes.json` — `IMPACT`, `COLLABORATION`, `GROWTH` — with
   distinct Radix accent colors. The chart and theme grouping are data-driven, so no chart
   changes are required.
3. **Namespace all Support attributes** in `data/attributes.json` with a `cs_` key prefix and
   `cs`-prefixed `param`, appended after the SWE attributes so existing tracks' rating-encoding
   slots are unchanged.
4. **Level keys use the ML suffix convention** for global uniqueness (keys are the URL segment):
   `P1PS`–`P3PS`, `P1TSE`–`P3TSE`, `M2CS`–`M5CS`. Only levels present in the source competency
   tables are modeled (M1 and M6 are named in prose but omitted — no competency data).

## Consequences

- New non-spreadsheet ladders are added by writing JSON directly, then spreading the file into
  `LEVELS` (`src/lib/levels.ts`) and extending the unions in `src/types/levels.ts` and the groups
  in `src/components/CareerSelect.tsx`.
- Two data-maintenance modes now coexist (CSV-generated vs JSON-native); `data/CLAUDE.md` records
  which files are which.
- Track-dependent copy (e.g. the SMART-goals prompt) can no longer assume "engineer"; a
  `getTrackContext` helper in `src/lib/levels.ts` resolves the track label and role noun.
- Appending attributes must keep existing `param` slots stable so previously-shared encoded URLs
  still decode; verified by `src/lib/ratingsEncoding.test.ts`.
