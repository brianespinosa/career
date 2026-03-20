#!/bin/bash
set -euo pipefail

# Only run in remote (cloud) environments
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# Enable corepack so the packageManager field in package.json is honored
corepack enable

# Install dependencies
cd "$CLAUDE_PROJECT_DIR"
yarn install
