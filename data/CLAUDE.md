# data/CLAUDE.md

## Files

- `attributes.json` — the competency attributes, each with a `key`, short `param` (used as URL query param), display `name`, and `theme` grouping. Customer Support attributes are namespaced with a `cs_` key prefix and `cs`-prefixed `param`
- `themes.json` — the theme groups: the SWE set (`WHAT`, `WHO`, `WHY`, `HOW`) plus the Customer Support set (`IMPACT`, `COLLABORATION`, `GROWTH`), each with display name, description, and Radix UI `color`
- `ic.json` — IC track levels (P1–P7), each with a `key`, `name`, `experience` range, and per-attribute `attributes` descriptions
- `em.json` — EM track levels (M3–M6), same structure as `ic.json`
- `ic-ml.json` / `em-ml.json` — IC/EM ML-track levels, same structure
- `cs-ps.json` / `cs-tse.json` / `cs-em.json` — Customer Support tracks (Product Support IC `P1PS`–`P3PS`, Technical Support Engineering IC `P1TSE`–`P3TSE`, managers `M2CS`–`M5CS`). Same structure; `experience` holds the proficiency stage (e.g. `Doing → Doing+`). **JSON-native — authored directly, no CSV/`mlr` step** (see ADR-012)
- `ic.csv` / `em.csv` / `ic-ml.csv` / `em-ml.csv` — source-of-truth CSVs for the SWE tracks only; those JSON files are generated from these

## Updating Level Data

Edit the CSV files, then regenerate the JSON:

```
yarn ic    # regenerates data/ic.json from data/ic.csv
yarn em    # regenerates data/em.json from data/em.csv
```

Requires [Miller (`mlr`)](https://miller.readthedocs.io/) to be installed locally.

## Updating Attribute Types

After changing `attributes.json` or the level JSONs, regenerate TypeScript types:

```
yarn data-types
```

This runs `./json-d-ts.sh` to produce `.d.ts` files from the JSON data.

## Data Constraints

- Each attribute in `attributes.json` must have a unique `param` value — this becomes the URL query param key
- Attribute `key` values in `attributes.json` must match the keys used in each level's `attributes` object in `ic.json`/`em.json`
- Attribute `theme` values must correspond to a key in `themes.json`
