# ADR 002: Explicit Yarn Cache in GitHub Actions

## Status

Accepted

## Context

We use Yarn 4 (via corepack) as our package manager. GitHub Actions CI needs to
cache the Yarn package cache to avoid re-downloading dependencies on every run.

`actions/setup-node` provides a built-in `cache` input for this purpose. However,
two separate issues make it unsuitable for our setup:

1. **Corepack ordering problem**: `cache: yarn` causes `setup-node` to run
   `yarn config get cacheFolder` during cache key resolution. When corepack is not
   yet enabled, this invokes the system Yarn (v1) rather than the project-pinned
   version, producing an incorrect cache path or failing outright.
   - Reference: [actions/setup-node#1027](https://github.com/actions/setup-node/issues/1027)
   - Proposed fix (unmerged as of 2026): [actions/setup-node#1479](https://github.com/actions/setup-node/pull/1479)

2. **v6 restricts automatic caching to npm only**: `actions/setup-node@v6`
   introduced a breaking change that disables automatic caching for all package
   managers except npm, due to the instability described above.

## Decision

We use explicit caching in the `.github/actions/setup` composite action:

1. `actions/setup-node` runs with no `cache` option
2. `corepack enable` runs to activate the project-pinned Yarn version
3. `yarn config get cacheFolder` captures the correct cache directory path
4. `actions/cache` restores/saves the cache using a key derived from
   `runner.os` + `hashFiles('**/yarn.lock')`
5. `yarn install --immutable` runs with the warm cache available

## Consequences

- Cache key is shared across all CI jobs that use the same `yarn.lock`, so the
  first job to complete install will populate the cache for subsequent runs.
- When `yarn.lock` changes, the cache key changes and a full install runs. The
  `restore-keys` fallback allows partial cache hits on the previous lock file.
- This approach must be revisited if `actions/setup-node` ships a proper fix for
  corepack + yarn caching (track [#1027](https://github.com/actions/setup-node/issues/1027)).
