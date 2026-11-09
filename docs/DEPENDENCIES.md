# Dependency inventory and audit

Inventory refreshed and npm advisory audit run: **2026-11-09 (America/Toronto)**.

Direct dependency versions and runtime/tooling classification come from [package-lock.json](../package-lock.json). The lockfile records the complete transitive tree; this document lists only direct dependencies. Use the Node 26 runtime in `.nvmrc` (26.12.1) and npm 11 or newer. The manifest permits Node >=24.22.1 <27; tests use Node native TypeScript support.

The audit covered the locked dependency tree (152 entries reported by npm, including optional packages). Results: **0 vulnerabilities** - 0 critical, 0 high, 0 moderate, 0 low, and 0 informational. The scan includes transitive dependencies and is not a source-code security review.

## Direct dependencies

Runtime dependencies support the single Next.js application; owners marked `dev` are development tools.

| Library                | Used by      | Purpose and notable constraints                                                                                                                                                | Declared range | Locked version(s) |
| ---------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------- | ----------------- |
| `@axe-core/playwright` | `root (dev)` | WCAG accessibility scans in the browser tests (dev only); exact version. Its playwright-core peer is satisfied by the copy @playwright/test pins, so upgrade the two together. | `4.14.0`       | `4.14.0`          |
| `@biomejs/biome`       | `root (dev)` | Repository linting; pinned tool version keeps local and CI rules aligned.                                                                                                      | `2.6.5`        | `2.6.5`           |
| `@floating-ui/react`   | `root`       | Accessible viewport-aware InfoTip positioning and dismissal; retain the existing 0.27 API range.                                                                               | `^0.27.20`     | `0.27.20`         |
| `@playwright/test`     | `root (dev)` | End-to-end, accessibility and responsive browser tests (dev only); runs the installed Google Chrome, so no browser download. Exact version.                                    | `1.64.1`       | `1.64.1`          |
| `@tailwindcss/postcss` | `root (dev)` | Compiles Tailwind in Next.js; keep its major aligned with Tailwind 4.                                                                                                          | `^4.3.4`       | `4.3.4`           |
| `@types/node`          | `root (dev)` | Node server/tooling types; aligned with the Node 26 runtime in .nvmrc.                                                                                                         | `^26.6.6`      | `26.6.6`          |
| `@types/react`         | `root (dev)` | React component types; keep major 19 aligned with React and React DOM.                                                                                                         | `^19.3.0`      | `19.3.0`          |
| `@types/react-dom`     | `root (dev)` | React DOM types; keep major 19 aligned with the React runtime and types.                                                                                                       | `^19.3.0`      | `19.3.0`          |
| `libphonenumber-js`    | `root`       | International phone parsing, formatting, and calling-code validation in shared contact fields; uses the smaller min entry.                                                     | `^1.13.15`     | `1.13.15`         |
| `next`                 | `root`       | App Router rendering, routing, metadata, and builds; pinned to Next 16.4.5.                                                                                                    | `16.4.5`       | `16.4.5`          |
| `prettier`             | `root (dev)` | Repository formatting and generated dependency documentation; exact version stabilizes output.                                                                                 | `3.9.10`       | `3.9.10`          |
| `react`                | `root`       | Server/client component runtime; pinned to React 19.3.1.                                                                                                                       | `19.3.1`       | `19.3.1`          |
| `react-dom`            | `root`       | Browser hydration and DOM rendering; keep its version aligned with React 19.3.1.                                                                                               | `19.3.1`       | `19.3.1`          |
| `react-icons`          | `root`       | Shared Lucide icons for controls and status feedback; exact version preserves the approved icon API.                                                                           | `5.7.0`        | `5.7.0`           |
| `server-only`          | `root`       | Build-time guard for trusted environment, metadata, and email modules; prevents accidental client imports.                                                                     | `^0.0.1`       | `0.0.1`           |
| `tailwindcss`          | `root (dev)` | Utility and token-based styling; retain major 4 with its PostCSS plugin.                                                                                                       | `^4.3.4`       | `4.3.4`           |
| `typescript`           | `root (dev)` | Strict TypeScript checking; exact 7.0.2 pin keeps local and CI checks consistent.                                                                                              | `7.0.2`        | `7.0.2`           |

## Maintenance and security notes

No unused direct dependency or deprecated direct API requiring replacement was identified in the source-import review. Existing Motchi controls cover the current micro-interactions; no Interior.dev source or dependencies are installed. Recheck usage and advisories when changing dependencies.

The application pins Next 16 and React 19; review major upgrades together. Multiple PostCSS versions are transitive constraints, not separate applications. Keep server-only guards around trusted configuration and email code.

## Local diagram tooling

[Stack Diagram](https://github.com/caru-ini/stack-diagram), MIT, is installed in the local Codex skills directory, outside the application dependency tree. Reviewed source: `1ed53e3e9525364ae5d82e0430f2bb3f7ef4c838`, path `skills/stack-diagram`. Future installations should use the standard skill installer with this pinned ref and repeat the review before execution. The repository does not require the skill to run or build.

The [application diagram](diagrams/application.html) uses the skill's geometry/template conventions, a bundled generic visitor SVG pictogram, and official Next.js, React, and Brevo logos embedded as data images, with the MIT notice embedded in the HTML. It uses system fonts; no bundled fonts or font packages are included. Initial generation executed only `scripts/build.py`: standard-library Python, explicit local input/icon/output paths, no network, subprocesses, credentials, or upload behavior. Subsequent geometry and logo updates are manually authored. Logo sources are [Next.js](https://nextjs.org/favicon.ico), [React](https://react.dev/images/brand/logo_dark.svg), and [Brevo](https://corp-backend.brevo.com/wp-content/uploads/2025/07/Brevo_logo.svg); brand marks remain their owners' trademarks. The finished HTML has no scripts or external asset requests.

Reviewed but unused: `fetch_icons.py` (public logo GETs; arbitrary explicit URLs and redirects need per-use review), `render_png.py` (Playwright/Chromium and a font-detection subprocess; passes `--no-sandbox`, so do not execute unchanged), and `share.py` (gallery requests and a local gallery key store). No Playwright/Python packages were installed. Local browser verification uses an isolated temporary profile and blocks external page requests. The gallery helper remains disabled under [AGENT_SECURITY.md](AGENT_SECURITY.md#stack-diagram).

## Repository agent skills

See [SKILLS.md](SKILLS.md) for installed skill purposes, modes, provenance, licenses, executable helpers, and network capabilities. Agent skills are outside the application dependency tree; their presence does not authorize execution or external access.

## Refreshing this document

After dependency changes, update the root lockfile, then run:

```bash
npm run dependencies:inventory
```

The command runs `npm audit` including development, optional, and peer dependencies, and regenerates this direct-dependency inventory. It exits nonzero if the audit cannot complete or vulnerabilities are reported. Review advisory details and dependency changes before upgrading; the command does not install or upgrade packages.
