# .claude/CLAUDE.md

## Settings Files

- `settings.json` — shared settings committed to the repository
- `settings.local.json` — local overrides, not committed (gitignored)

## Rules

- Destructive command permissions must **never** be added to `settings.json`. If a destructive action needs to be permitted, add it to `settings.local.json` only.
- Permissions added to `settings.json` must be kept in alphabetical order.
