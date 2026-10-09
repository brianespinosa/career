# career

See `README.md` for the repository overview. Area-specific guidance lives in subdirectory `CLAUDE.md` files; keep this root file minimal.

## pnpm Install Warnings

`pnpm install` may produce warnings. All warnings MUST be resolved before closing any PR — investigate the cause and fix it (e.g. add or remove a `packageExtensions` entry in `pnpm-workspace.yaml`, pin a transitive dependency via `overrides`, or update the offending package). Use `peerDependencyRules` only as a last resort, with a comment naming the package, the upstream reason, and why a real fix is not possible.
