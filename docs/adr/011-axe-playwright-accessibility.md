# ADR-011: Automated Accessibility Testing with @axe-core/playwright

**Status:** Accepted

## Context

The project has established e2e coverage for functional paths (Issue #76, PR #78). The next layer of quality enforcement is accessibility: verifying that the fully rendered browser DOM meets WCAG standards, not just that source attributes are present.

Static analysis tools like `eslint-plugin-jsx-a11y` catch missing attributes at the source level but cannot verify:
- That Radix UI portals (dialogs, tooltips, dropdowns) render with correct ARIA roles
- That dynamic content (OpportunitiesCard, which mounts after a dynamic import) is announced correctly
- That color contrast meets WCAG thresholds in the computed style
- That heading hierarchy is correct across the full rendered page

Lighthouse CI already audits accessibility (threshold: 0.95) but only on three fixed URLs and produces a score rather than a structured violations report. It cannot be targeted at specific page states.

## Decision

Add `@axe-core/playwright` as a dev dependency and include `AxeBuilder.analyze()` assertions in the home and rated-level page e2e specs.

`@axe-core/playwright` is the official Playwright integration maintained by Deque Systems (the axe-core authors). It injects axe-core into a live Playwright browser page after navigation and returns a structured violations report with rule IDs, impact levels, and DOM selectors for each violation.

**Why `@axe-core/playwright` over alternatives:**

| Option | Reason not chosen |
|---|---|
| `eslint-plugin-jsx-a11y` | Source-level only; cannot verify rendered ARIA roles, portal output, or dynamic content |
| Manual audit | Not repeatable; cannot be enforced in CI |
| Lighthouse a11y score | Score-based, not rule-based; no structured violations report; limited to fixed URLs |
| `axe-core` directly | `@axe-core/playwright` is the canonical integration; handles page context and evaluation correctly |

**Scope:** Assertions are added to `home.spec.ts` (home page) and `opportunities-card.spec.ts` (rated level page, the most complex rendered state). Other specs add coverage of specific interactions; axe assertions target fully rendered page states.

## Consequences

- New devDependency: `@axe-core/playwright`
- The peer dependency warning (`playwright-core` not directly listed) is expected — `playwright-core` is provided by `@playwright/test` which is already installed
- axe scans add latency to the affected specs (typically 200–500 ms per scan on a fast deployment)
- If Radix UI or other third-party components introduce violations, the spec will fail and require either a fix or a targeted `disableRules` exclusion with a documented rationale
