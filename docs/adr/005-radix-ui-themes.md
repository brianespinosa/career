# ADR 005: Radix UI Themes for Styling

## Status

Accepted

## Context

The project needed a component and styling system that provides:

- Accessible interactive components (dropdowns, buttons, tooltips) without building them from scratch
- A consistent design token system (spacing, color, radius, typography) without a custom design system
- Dark mode support with minimal boilerplate
- Compatibility with React 19 and Next.js App Router

Alternatives considered:

- **Tailwind CSS** — utility-first, widely adopted, but requires a separate accessible component library (Headless UI, Radix primitives) and custom design token setup
- **Plain CSS / CSS Modules** — maximum control, but accessibility and design consistency burden falls entirely on the project
- **shadcn/ui** — Radix primitives + Tailwind; the Tailwind dependency adds complexity without benefit at this project's scale

## Decision

We use Radix UI Themes (`@radix-ui/themes`) as the primary styling system:

- **Component props** are used for all layout and styling (`m`, `p`, `color`, `size`, etc.) — `style` props are not used in application code
- Radix's built-in dark theme is applied globally (`appearance='dark'`)
- `@radix-ui/colors` is imported directly in `src/lib/chartGeometry.ts` to resolve theme colors to hex for server-side OG image rendering (where CSS variables are unavailable)
- SCSS (`src/app/global.scss`) handles only layout concerns that fall outside Radix's prop system

## Consequences

- Radix component API changes are a migration concern; pin the major version in `package.json`
- The Satori constraint (OG image rendering cannot use CSS vars) means any new colors used in OG layouts must be sourced from `@radix-ui/colors` directly, not from CSS custom properties
- `style` props should remain absent from application components; reaching for a `style` prop is a signal to look for the equivalent Radix prop first
