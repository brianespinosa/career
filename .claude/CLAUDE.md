# .claude/CLAUDE.md

## Settings Files

- `settings.json` — shared settings committed to the repository
- `settings.local.json` — local overrides, not committed (gitignored)

## MCP Configuration

- `.mcp.json` (repo root) — project-scoped MCP servers, committed to the repository and shared with all collaborators including cloud environments
  - Currently configures the GitHub remote MCP via `https://api.githubcopilot.com/mcp`
  - Requires a `GITHUB_PAT` environment variable with the following scopes: `repo`, `read:org`, `read:packages`, `notifications`, `security_events`, `gist`, `project`

## Rules

- Destructive command permissions must **never** be added to `settings.json`. If a destructive action needs to be permitted, add it to `settings.local.json` only.
- Permissions added to `settings.json` must be kept in alphabetical order.
