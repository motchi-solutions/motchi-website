# Dependency inventory and audit

Inventory refreshed and npm advisory audit run: **2026-11-03 (America/Toronto)**.

The exact versions are from [package-lock.json](../package-lock.json), including transitive and platform-specific optional packages. The publication date is when that exact locked version was published to the public npm registry, shown in Toronto time. It is not the date this repository installed or updated the dependency; npm's lockfile does not record that date. Git history records committed lockfile changes.

The audit covered the locked dependency tree (155 entries reported by npm, including workspaces and optional packages). Results: **0 vulnerabilities** - 0 critical, 0 high, 0 moderate, 0 low, and 0 informational. This is an npm advisory scan, not an independent source-code audit. The audit date applies to every external package below.

## Direct dependencies

Owners marked `peer` declare a compatible host version; `dev` dependencies are tooling. Internal `@motchi/*` workspaces are listed separately.

| Library                | Used by                                                                                              | Declared range       | Locked version(s) | Version published |
| ---------------------- | ---------------------------------------------------------------------------------------------------- | -------------------- | ----------------- | ----------------- |
| `@biomejs/biome`       | `root (dev)`                                                                                         | `2.6.3`              | `2.6.3`           | 2026-10-24        |
| `@floating-ui/react`   | `packages/ui`                                                                                        | `^0.27.20`           | `0.27.20`         | 2026-07-11        |
| `@tailwindcss/postcss` | `root (dev)`                                                                                         | `^4.3.3`             | `4.3.3`           | 2026-07-16        |
| `@types/node`          | `root (dev)`                                                                                         | `^24.19.2`           | `24.19.2`         | 2026-10-09        |
| `@types/react`         | `root (dev)`                                                                                         | `^19.3.0`            | `19.3.0`          | 2026-09-09        |
| `@types/react-dom`     | `root (dev)`                                                                                         | `^19.3.0`            | `19.3.0`          | 2026-09-09        |
| `libphonenumber-js`    | `packages/ui`                                                                                        | `^1.13.15`           | `1.13.15`         | 2026-10-08        |
| `next`                 | `apps/consulting`, `apps/solutions`, `apps/websites`, `packages/config (peer)`, `packages/ui (peer)` | `16.4.3`, `>=16 <17` | `16.4.3`          | 2026-10-23        |
| `prettier`             | `root (dev)`                                                                                         | `3.9.10`             | `3.9.10`          | 2026-10-10        |
| `react`                | `apps/consulting`, `apps/solutions`, `apps/websites`, `packages/ui (peer)`                           | `19.3.1`, `>=19 <20` | `19.3.1`          | 2026-10-14        |
| `react-dom`            | `apps/consulting`, `apps/solutions`, `apps/websites`, `packages/ui (peer)`                           | `19.3.1`, `>=19 <20` | `19.3.1`          | 2026-10-14        |
| `react-icons`          | `packages/ui`                                                                                        | `5.7.0`              | `5.7.0`           | 2026-06-30        |
| `server-only`          | `packages/config`, `packages/email`                                                                  | `^0.0.1`             | `0.0.1`           | 2022-09-02        |
| `tailwindcss`          | `root (dev)`                                                                                         | `^4.3.3`             | `4.3.3`           | 2026-07-16        |
| `typescript`           | `root (dev)`                                                                                         | `7.0.2`              | `7.0.2`           | 2026-07-08        |

## Internal workspaces

These are repository-owned packages, not separately published third-party libraries. Their contents are the current checkout; npm advisory results do not constitute a source-code audit of them.

| Workspace         | Version |
| ----------------- | ------- |
| `apps/consulting` | `0.1.0` |
| `apps/solutions`  | `0.1.0` |
| `apps/websites`   | `0.1.0` |
| `packages/brand`  | `0.1.0` |
| `packages/config` | `0.1.0` |
| `packages/email`  | `0.1.0` |
| `packages/ui`     | `0.1.0` |

## Complete locked third-party inventory

141 distinct package/version entries. Some are transitive dependencies or platform-specific binaries that npm installs only on the relevant platform. The audit date above applies to this entire list.

| Library                                  | Locked version | Version published |
| ---------------------------------------- | -------------- | ----------------- |
| `@alloc/quick-lru`                       | `5.3.0`        | 2026-08-31        |
| `@biomejs/biome`                         | `2.6.3`        | 2026-10-24        |
| `@biomejs/cli-android-arm64`             | `2.6.3`        | 2026-10-24        |
| `@biomejs/cli-android-x64`               | `2.6.3`        | 2026-10-24        |
| `@biomejs/cli-darwin-arm64`              | `2.6.3`        | 2026-10-24        |
| `@biomejs/cli-darwin-x64`                | `2.6.3`        | 2026-10-24        |
| `@biomejs/cli-linux-arm64`               | `2.6.3`        | 2026-10-24        |
| `@biomejs/cli-linux-arm64-musl`          | `2.6.3`        | 2026-10-24        |
| `@biomejs/cli-linux-x64`                 | `2.6.3`        | 2026-10-24        |
| `@biomejs/cli-linux-x64-musl`            | `2.6.3`        | 2026-10-24        |
| `@biomejs/cli-win32-arm64`               | `2.6.3`        | 2026-10-24        |
| `@biomejs/cli-win32-x64`                 | `2.6.3`        | 2026-10-24        |
| `@emnapi/runtime`                        | `1.11.3`       | 2026-07-25        |
| `@floating-ui/core`                      | `1.8.0`        | 2026-07-11        |
| `@floating-ui/dom`                       | `1.8.0`        | 2026-07-11        |
| `@floating-ui/react`                     | `0.27.20`      | 2026-07-11        |
| `@floating-ui/react-dom`                 | `2.1.9`        | 2026-07-11        |
| `@floating-ui/utils`                     | `0.2.12`       | 2026-07-11        |
| `@img/colour`                            | `1.1.0`        | 2026-03-01        |
| `@img/sharp-darwin-arm64`                | `0.35.5`       | 2026-09-27        |
| `@img/sharp-darwin-x64`                  | `0.35.5`       | 2026-09-27        |
| `@img/sharp-freebsd-wasm32`              | `0.35.5`       | 2026-09-27        |
| `@img/sharp-libvips-darwin-arm64`        | `1.3.4`        | 2026-09-27        |
| `@img/sharp-libvips-darwin-x64`          | `1.3.4`        | 2026-09-27        |
| `@img/sharp-libvips-linux-arm`           | `1.3.4`        | 2026-09-27        |
| `@img/sharp-libvips-linux-arm64`         | `1.3.4`        | 2026-09-27        |
| `@img/sharp-libvips-linux-ppc64`         | `1.3.4`        | 2026-09-27        |
| `@img/sharp-libvips-linux-riscv64`       | `1.3.4`        | 2026-09-27        |
| `@img/sharp-libvips-linux-s390x`         | `1.3.4`        | 2026-09-27        |
| `@img/sharp-libvips-linux-x64`           | `1.3.4`        | 2026-09-27        |
| `@img/sharp-libvips-linuxmusl-arm64`     | `1.3.4`        | 2026-09-27        |
| `@img/sharp-libvips-linuxmusl-x64`       | `1.3.4`        | 2026-09-27        |
| `@img/sharp-linux-arm`                   | `0.35.5`       | 2026-09-27        |
| `@img/sharp-linux-arm64`                 | `0.35.5`       | 2026-09-27        |
| `@img/sharp-linux-ppc64`                 | `0.35.5`       | 2026-09-27        |
| `@img/sharp-linux-riscv64`               | `0.35.5`       | 2026-09-27        |
| `@img/sharp-linux-s390x`                 | `0.35.5`       | 2026-09-27        |
| `@img/sharp-linux-x64`                   | `0.35.5`       | 2026-09-27        |
| `@img/sharp-linuxmusl-arm64`             | `0.35.5`       | 2026-09-27        |
| `@img/sharp-linuxmusl-x64`               | `0.35.5`       | 2026-09-27        |
| `@img/sharp-wasm32`                      | `0.35.5`       | 2026-09-27        |
| `@img/sharp-webcontainers-wasm32`        | `0.35.5`       | 2026-09-27        |
| `@img/sharp-win32-arm64`                 | `0.35.5`       | 2026-09-27        |
| `@img/sharp-win32-ia32`                  | `0.35.5`       | 2026-09-27        |
| `@img/sharp-win32-x64`                   | `0.35.5`       | 2026-09-27        |
| `@jridgewell/gen-mapping`                | `0.3.13`       | 2025-08-12        |
| `@jridgewell/remapping`                  | `2.3.5`        | 2025-08-12        |
| `@jridgewell/resolve-uri`                | `3.1.2`        | 2024-02-14        |
| `@jridgewell/sourcemap-codec`            | `1.6.0`        | 2026-08-27        |
| `@jridgewell/trace-mapping`              | `0.3.31`       | 2025-09-10        |
| `@next/env`                              | `16.4.3`       | 2026-10-23        |
| `@next/swc-darwin-arm64`                 | `16.4.3`       | 2026-10-23        |
| `@next/swc-darwin-x64`                   | `16.4.3`       | 2026-10-23        |
| `@next/swc-linux-arm64-gnu`              | `16.4.3`       | 2026-10-23        |
| `@next/swc-linux-arm64-musl`             | `16.4.3`       | 2026-10-23        |
| `@next/swc-linux-x64-gnu`                | `16.4.3`       | 2026-10-23        |
| `@next/swc-linux-x64-musl`               | `16.4.3`       | 2026-10-23        |
| `@next/swc-win32-arm64-msvc`             | `16.4.3`       | 2026-10-23        |
| `@next/swc-win32-x64-msvc`               | `16.4.3`       | 2026-10-23        |
| `@swc/helpers`                           | `0.5.23`       | 2026-05-27        |
| `@tailwindcss/node`                      | `4.3.3`        | 2026-07-16        |
| `@tailwindcss/oxide`                     | `4.3.3`        | 2026-07-16        |
| `@tailwindcss/oxide-android-arm64`       | `4.3.3`        | 2026-07-16        |
| `@tailwindcss/oxide-darwin-arm64`        | `4.3.3`        | 2026-07-16        |
| `@tailwindcss/oxide-darwin-x64`          | `4.3.3`        | 2026-07-16        |
| `@tailwindcss/oxide-freebsd-x64`         | `4.3.3`        | 2026-07-16        |
| `@tailwindcss/oxide-linux-arm-gnueabihf` | `4.3.3`        | 2026-07-16        |
| `@tailwindcss/oxide-linux-arm64-gnu`     | `4.3.3`        | 2026-07-16        |
| `@tailwindcss/oxide-linux-arm64-musl`    | `4.3.3`        | 2026-07-16        |
| `@tailwindcss/oxide-linux-x64-gnu`       | `4.3.3`        | 2026-07-16        |
| `@tailwindcss/oxide-linux-x64-musl`      | `4.3.3`        | 2026-07-16        |
| `@tailwindcss/oxide-wasm32-wasi`         | `4.3.3`        | 2026-07-16        |
| `@tailwindcss/oxide-win32-arm64-msvc`    | `4.3.3`        | 2026-07-16        |
| `@tailwindcss/oxide-win32-x64-msvc`      | `4.3.3`        | 2026-07-16        |
| `@tailwindcss/postcss`                   | `4.3.3`        | 2026-07-16        |
| `@types/node`                            | `24.19.2`      | 2026-10-09        |
| `@types/react`                           | `19.3.0`       | 2026-09-09        |
| `@types/react-dom`                       | `19.3.0`       | 2026-09-09        |
| `@typescript/typescript-aix-ppc64`       | `7.0.2`        | 2026-07-08        |
| `@typescript/typescript-darwin-arm64`    | `7.0.2`        | 2026-07-08        |
| `@typescript/typescript-darwin-x64`      | `7.0.2`        | 2026-07-08        |
| `@typescript/typescript-freebsd-arm64`   | `7.0.2`        | 2026-07-08        |
| `@typescript/typescript-freebsd-x64`     | `7.0.2`        | 2026-07-08        |
| `@typescript/typescript-linux-arm`       | `7.0.2`        | 2026-07-08        |
| `@typescript/typescript-linux-arm64`     | `7.0.2`        | 2026-07-08        |
| `@typescript/typescript-linux-loong64`   | `7.0.2`        | 2026-07-08        |
| `@typescript/typescript-linux-mips64el`  | `7.0.2`        | 2026-07-08        |
| `@typescript/typescript-linux-ppc64`     | `7.0.2`        | 2026-07-08        |
| `@typescript/typescript-linux-riscv64`   | `7.0.2`        | 2026-07-08        |
| `@typescript/typescript-linux-s390x`     | `7.0.2`        | 2026-07-08        |
| `@typescript/typescript-linux-x64`       | `7.0.2`        | 2026-07-08        |
| `@typescript/typescript-netbsd-arm64`    | `7.0.2`        | 2026-07-08        |
| `@typescript/typescript-netbsd-x64`      | `7.0.2`        | 2026-07-08        |
| `@typescript/typescript-openbsd-arm64`   | `7.0.2`        | 2026-07-08        |
| `@typescript/typescript-openbsd-x64`     | `7.0.2`        | 2026-07-08        |
| `@typescript/typescript-sunos-x64`       | `7.0.2`        | 2026-07-08        |
| `@typescript/typescript-win32-arm64`     | `7.0.2`        | 2026-07-08        |
| `@typescript/typescript-win32-x64`       | `7.0.2`        | 2026-07-08        |
| `baseline-browser-mapping`               | `2.11.32`      | 2026-10-23        |
| `caniuse-lite`                           | `1.0.30001819` | 2026-10-22        |
| `client-only`                            | `0.0.1`        | 2022-09-02        |
| `csstype`                                | `3.2.3`        | 2025-11-17        |
| `detect-libc`                            | `2.1.2`        | 2025-10-05        |
| `enhanced-resolve`                       | `5.26.0`       | 2026-09-29        |
| `graceful-fs`                            | `4.2.11`       | 2023-03-16        |
| `jiti`                                   | `2.7.0`        | 2026-05-05        |
| `libphonenumber-js`                      | `1.13.15`      | 2026-10-08        |
| `lightningcss`                           | `1.32.0`       | 2026-03-09        |
| `lightningcss-android-arm64`             | `1.32.0`       | 2026-03-09        |
| `lightningcss-darwin-arm64`              | `1.32.0`       | 2026-03-09        |
| `lightningcss-darwin-x64`                | `1.32.0`       | 2026-03-09        |
| `lightningcss-freebsd-x64`               | `1.32.0`       | 2026-03-09        |
| `lightningcss-linux-arm-gnueabihf`       | `1.32.0`       | 2026-03-09        |
| `lightningcss-linux-arm64-gnu`           | `1.32.0`       | 2026-03-09        |
| `lightningcss-linux-arm64-musl`          | `1.32.0`       | 2026-03-09        |
| `lightningcss-linux-x64-gnu`             | `1.32.0`       | 2026-03-09        |
| `lightningcss-linux-x64-musl`            | `1.32.0`       | 2026-03-09        |
| `lightningcss-win32-arm64-msvc`          | `1.32.0`       | 2026-03-09        |
| `lightningcss-win32-x64-msvc`            | `1.32.0`       | 2026-03-09        |
| `magic-string`                           | `0.30.21`      | 2025-10-23        |
| `nanoid`                                 | `3.3.20`       | 2026-10-05        |
| `next`                                   | `16.4.3`       | 2026-10-23        |
| `picocolors`                             | `1.1.1`        | 2024-10-16        |
| `postcss`                                | `8.5.23`       | 2026-07-24        |
| `postcss`                                | `8.5.31`       | 2026-10-18        |
| `prettier`                               | `3.9.10`       | 2026-10-10        |
| `react`                                  | `19.3.1`       | 2026-10-14        |
| `react-dom`                              | `19.3.1`       | 2026-10-14        |
| `react-icons`                            | `5.7.0`        | 2026-06-30        |
| `scheduler`                              | `0.28.0`       | 2026-09-09        |
| `semver`                                 | `7.8.5`        | 2026-06-19        |
| `server-only`                            | `0.0.1`        | 2022-09-02        |
| `sharp`                                  | `0.35.5`       | 2026-09-27        |
| `source-map-js`                          | `1.2.2`        | 2026-09-30        |
| `styled-jsx`                             | `5.1.6`        | 2024-05-24        |
| `tabbable`                               | `6.5.1`        | 2026-10-24        |
| `tailwindcss`                            | `4.3.3`        | 2026-07-16        |
| `tapable`                                | `2.3.3`        | 2026-04-21        |
| `tslib`                                  | `2.8.1`        | 2024-10-31        |
| `typescript`                             | `7.0.2`        | 2026-07-08        |
| `undici-types`                           | `7.24.6`       | 2026-03-25        |

## Refreshing this document

After dependency changes, update the root lockfile, then run:

```bash
npm run dependencies:inventory
```

The command runs `npm audit` including development, optional, and peer dependencies; retrieves public npm publication dates; and regenerates this file. It exits nonzero if the audit cannot complete, a public version date cannot be retrieved, or vulnerabilities are reported. Review advisory details and dependency changes before upgrading; the command does not install or upgrade packages.
