# ADR-009: Unit Testing Framework

**Status:** Accepted

## Context

Issue #38 adds a unit testing layer to complement the existing Playwright e2e suite. The framework must satisfy the same principles as the rest of the toolchain: minimal configuration, fast execution, ESM-native, and no reliance on a large plugin ecosystem.

## Decision

**Vitest** with **happy-dom** as the DOM environment, and **@testing-library/react** for component rendering.

### Framework: Vitest over Jest and node:test

- **ESM-native** — no Babel transforms or CJS interop required; aligns with the project's modern browser targets and `"type": "module"` expectations
- **Built-in TypeScript** via esbuild — no `ts-jest` or similar transform layer needed
- **Jest-compatible API** — same `describe`/`it`/`expect` surface; minimal learning curve
- **Fast parallel execution** via worker threads
- **First-class React 19 support** with `@testing-library/react`

Jest was ruled out: it is CJS-first, and ESM + TypeScript both require additional transforms that add configuration surface and maintenance burden. `node:test` was ruled out: ecosystem support for React component testing is limited and immature.

### DOM environment: happy-dom over jsdom

- Faster execution
- Sufficient API coverage for this app — no complex DOM APIs (canvas, workers, IndexedDB) are used
- If a gap is hit, switching to jsdom is a one-line config change

### Testing Library

- `@testing-library/react` — component rendering and queries
- `@testing-library/user-event` — realistic event simulation
- `@testing-library/jest-dom` — readable DOM matchers via `expect.extend`
- `@testing-library/dom` — explicit peer dependency; installed directly to satisfy Yarn 4 peer resolution

### Next.js mocking strategy

Unit tests stub `next/navigation` with simple vi.mock replacements (`useRouter`, `usePathname`, `useParams`). No framework internals beyond these lightweight stubs are mocked at the unit level.

Components loaded via `next/dynamic` with `ssr: false` (`RatingsChart`, `OpportunitiesCard`) are not unit tested — their behavior is covered by the e2e suite, which runs against a real deployment. Forcing these into unit tests would require mocking `next/dynamic` and the chart library internals, which violates the testing pyramid principle documented in `src/CLAUDE.md`.

## Consequences

- Unit tests are colocated with source files (e.g. `ratingsEncoding.test.ts` next to `ratingsEncoding.ts`)
- A `test` job runs in CI in parallel with `biome` and `typecheck`; the `build` job requires all three to pass before it runs
- The unit layer covers pure lib utilities, hooks, and components that need only simple mocks
- Behavior requiring complex mocking or multi-component URL-driven flows stays in e2e
