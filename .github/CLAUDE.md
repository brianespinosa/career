# .github/CLAUDE.md

## Composite Action

Config: `.github/actions/setup/action.yml`

Shared setup used by all CI jobs after checkout: Node (from `.nvmrc`), corepack enable, `yarn install --immutable`.

Note: `actions/checkout` must remain in each job directly — local composite actions can only be resolved after the repo is checked out.

## CI Workflow

Config: `.github/workflows/ci.yml`

Runs on push and pull request to `main`. Jobs:

- **biome** and **typecheck** run in parallel on all events
- **build** runs after both pass on all events — runs `vercel build`, then conditionally deploys to production when on the default branch (checked via `github.event.repository.default_branch`, not a hardcoded branch name). Exposes `url` as a job output for downstream jobs.
- **lighthouse** runs on `pull_request` only, after `build`. Audits `/`, `/P1`, and `/P1/3ckmgrhn` against the Vercel preview URL using `treosh/lighthouse-ci-action@v12`. Runs 3 audits per URL and uploads artifacts. Thresholds defined in `lighthouserc.json` (performance/accessibility/best-practices: 1.0, SEO: 0.45). Requires `VERCEL_BYPASS_SECRET` repository secret.

Concurrency is configured to cancel in-progress runs on PRs when new commits are pushed. Runs on `main` are never cancelled.

## Vercel Deployment

The `build` job uses the Vercel CLI (`vercel` devDependency) with three required repository secrets:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

Project IDs are sourced from `.vercel/project.json` (gitignored). Re-run `vercel link` locally to regenerate if needed.

## Dependabot

Config: `.github/dependabot.yml`

Monitors `npm` dependencies weekly, targeting `main`. Commit messages use `chore(deps):` prefix via the `commit-message` config.

## Dependabot Auto-merge

Config: `.github/workflows/dependabot-auto-merge.yml`

Triggers on `pull_request_target` (runs in base branch context so `GITHUB_TOKEN` has full permissions). Checks `github.actor == 'dependabot[bot]'` and enables auto-merge via squash. `pull_request_target` is safe here because no PR code is checked out or executed.

## Notes

- Node version is pinned via `.nvmrc` — update there to change it everywhere
- Corepack must be enabled before running any `yarn` commands — handled in the composite action
