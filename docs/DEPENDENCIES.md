# Dependency inventory and audit

Inventory refreshed and npm advisory audit run: **2026-11-06 (America/Toronto)**.

Direct dependency versions and runtime/tooling classification come from [package-lock.json](../package-lock.json). The lockfile records the complete transitive tree; this document lists only direct dependencies. Use the Node 26 runtime in `.nvmrc` (26.12.1) and npm 11 or newer. The manifest permits Node >=24.22.1 <27; tests use Node native TypeScript support.

The audit covered the locked dependency tree (147 entries reported by npm, including optional packages). Results: **0 vulnerabilities** - 0 critical, 0 high, 0 moderate, 0 low, and 0 informational. The scan includes transitive dependencies and is not a source-code security review.

## Direct dependencies

Runtime dependencies support the single Next.js application; owners marked `dev` are development tools.

| Library                | Used by      | Purpose and notable constraints                                                                                            | Declared range | Locked version(s) |
| ---------------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------- | -------------- | ----------------- |
| `@biomejs/biome`       | `root (dev)` | Repository linting; pinned tool version keeps local and CI rules aligned.                                                  | `2.6.3`        | `2.6.3`           |
| `@floating-ui/react`   | `root`       | Accessible viewport-aware InfoTip positioning and dismissal; retain the existing 0.27 API range.                           | `^0.27.20`     | `0.27.20`         |
| `@tailwindcss/postcss` | `root (dev)` | Compiles Tailwind in Next.js; keep its major aligned with Tailwind 4.                                                      | `^4.3.3`       | `4.3.3`           |
| `@types/node`          | `root (dev)` | Node server/tooling types; Node 24 type baseline within the supported runtime range.                                       | `^24.19.2`     | `24.19.2`         |
| `@types/react`         | `root (dev)` | React component types; keep major 19 aligned with React and React DOM.                                                     | `^19.3.0`      | `19.3.0`          |
| `@types/react-dom`     | `root (dev)` | React DOM types; keep major 19 aligned with the React runtime and types.                                                   | `^19.3.0`      | `19.3.0`          |
| `libphonenumber-js`    | `root`       | International phone parsing, formatting, and calling-code validation in shared contact fields; uses the smaller min entry. | `^1.13.15`     | `1.13.15`         |
| `next`                 | `root`       | App Router rendering, routing, metadata, and builds; pinned to Next 16.4.3.                                                | `16.4.3`       | `16.4.3`          |
| `prettier`             | `root (dev)` | Repository formatting and generated dependency documentation; exact version stabilizes output.                             | `3.9.10`       | `3.9.10`          |
| `react`                | `root`       | Server/client component runtime; pinned to React 19.3.1.                                                                   | `19.3.1`       | `19.3.1`          |
| `react-dom`            | `root`       | Browser hydration and DOM rendering; keep its version aligned with React 19.3.1.                                           | `19.3.1`       | `19.3.1`          |
| `react-icons`          | `root`       | Shared Lucide icons for controls and status feedback; exact version preserves the approved icon API.                       | `5.7.0`        | `5.7.0`           |
| `server-only`          | `root`       | Build-time guard for trusted environment, metadata, and email modules; prevents accidental client imports.                 | `^0.0.1`       | `0.0.1`           |
| `tailwindcss`          | `root (dev)` | Utility and token-based styling; retain major 4 with its PostCSS plugin.                                                   | `^4.3.3`       | `4.3.3`           |
| `typescript`           | `root (dev)` | Strict TypeScript checking; exact 7.0.2 pin keeps local and CI checks consistent.                                          | `7.0.2`        | `7.0.2`           |

## Maintenance and security notes

No unused direct dependency or deprecated direct API requiring replacement was identified in the source-import review. Existing Motchi controls cover the current micro-interactions; no Interior.dev source or dependencies are installed. Recheck usage and advisories when changing dependencies.

The application pins Next 16 and React 19; review major upgrades together. Multiple PostCSS versions are transitive constraints, not separate applications. Keep server-only guards around trusted configuration and email code.

## Refreshing this document

After dependency changes, update the root lockfile, then run:

```bash
npm run dependencies:inventory
```

The command runs `npm audit` including development, optional, and peer dependencies, and regenerates this direct-dependency inventory. It exits nonzero if the audit cannot complete or vulnerabilities are reported. Review advisory details and dependency changes before upgrading; the command does not install or upgrade packages.
