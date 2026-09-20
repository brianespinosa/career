# ADR-013: Migrate from Yarn Berry to pnpm

## Status

Accepted

## Context

The project used Yarn 4 (Berry, `node-modules` linker) as its package manager. Two other package managers are in use across the author's personal and open-source repos: Yarn Berry and pnpm. Standardizing on one removes the split and lets tooling, CI patterns, and Dependabot configuration be shared across repos without a per-repo package-manager branch.

pnpm was chosen over continuing with Yarn Berry because:

- pnpm's default linker is content-addressable and isolated (a symlinked `node_modules` backed by a global store), which is stricter than the `node-modules` linker this project had opted into for Yarn — it surfaces phantom dependencies (imports of packages not declared directly) instead of allowing them to work by accident.
- `pnpm-workspace.yaml` centralizes settings that Yarn split across `.yarnrc.yml` and `package.json` (`resolutions`, `packageExtensions`), including a `minimumReleaseAge` supply-chain control with no Yarn equivalent.
- `packageManager` plus pnpm's own version manager (default `pmOnFail: download`) replaces committing a `yarnPath` binary under `.yarn/releases/`.

## Decision

Migrate the project to pnpm, pinned via `"packageManager": "pnpm@12.4.2"` in `package.json`. `pnpm-workspace.yaml` carries the required baseline (`savePrefix: ''`, `strictPeerDependencies: true`, `autoInstallPeers: false`, `engineStrict: true`, `strictDepBuilds: true`, `minimumReleaseAge: 7200`), the `overrides` block (replacing `resolutions`, using `parent>child` selectors), and `packageExtensions` (same shape as the Yarn equivalent).

`.yarnrc.yml`, `yarn.lock`, and `.yarn/` are deleted. All `yarn` invocations in `package.json`, `.github/workflows/`, and documentation are converted to `pnpm`.

CI caching changes from the explicit corepack + `actions/cache` workaround in ADR-002 to `pnpm/action-setup` followed by `actions/setup-node`'s built-in `cache: pnpm` — pnpm does not have the corepack-ordering problem that ruled out `cache: yarn`, since `pnpm/action-setup` puts a working `pnpm` binary on `PATH` before `setup-node` needs to resolve the store path. See `docs/adr/002-github-actions-yarn-cache.md`, now superseded by this ADR.

The Dependabot `npm` ecosystem entry gets a `cooldown.default-days: 7`, kept at or below `pnpm-workspace.yaml`'s `minimumReleaseAge` (5 days) so Dependabot never proposes a version pnpm's frozen-lockfile install would refuse.

## Consequences

- pnpm's isolated linker exposed one phantom dependency set: `src/components/RatingsChart.tsx` and `src/lib/chartGeometry.ts` import `@visx/event`, `@visx/group`, `@visx/responsive`, `@visx/scale`, `@visx/shape`, and `@visx/tooltip` directly, but only the `@visx/visx` meta-package was an explicit dependency. Yarn's `node-modules` linker hoists transitive packages flat, so these sub-package imports resolved by accident; pnpm's isolated linker only resolves declared dependencies, so `next build` failed with `Module not found` until all six were added as explicit `dependencies` at the same pinned version as `@visx/visx` (see `docs/adr/001-visx-alpha-channel.md`, which already documents this pattern for `d3-shape`).
- None of the six `packageExtensions` entries carried over from `.yarnrc.yml` currently gate an install failure when removed individually and `pnpm install` is re-run — in every case the peer they declare is already satisfied by a real, non-optional package present elsewhere in the tree (`react-dom` and `@react-spring/web` as top-level `dependencies`; `typescript` as a top-level `devDependency`; `playwright-core` and `@emnapi/core`/`@emnapi/runtime` as transitive dependencies of `@playwright/test` and `@oxc-resolver`/`sharp` respectively). They are kept anyway: `pnpm-workspace.yaml`'s `packageExtensions` is the only place these peer relationships are declared at all, and losing that declaration would silently stop protecting against a future change (e.g. dropping `react-dom` as a direct dependency) that would otherwise reintroduce an unmet peer. Since pnpm does not flag unused or redundant `packageExtensions` the way Yarn's `YN0068`/`YN0069` log filters did (per the Yarn-to-pnpm mapping in issue #429), this list needs periodic manual review — this migration's audit is the first pass.
- `strictDepBuilds: true` requires explicitly approving any dependency's install/postinstall script via `pnpm-workspace.yaml`'s `allowBuilds` (or interactively via `pnpm approve-builds`); this is a new gate that Yarn's `node-modules` linker did not impose. Three packages needed approval: `@parcel/watcher` (native file-watcher binding), `esbuild` (platform binary download), and `lefthook` (installs the git hook manager and wires `.git/hooks`).
