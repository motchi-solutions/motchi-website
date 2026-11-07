import { execFileSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { format, resolveConfig } from "prettier";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lock = JSON.parse(
  await readFile(path.join(root, "package-lock.json"), "utf8"),
);

let audit;
try {
  const output = execFileSync(
    "npm",
    [
      "audit",
      "--json",
      "--include=dev",
      "--include=optional",
      "--include=peer",
    ],
    {
      cwd: root,
      encoding: "utf8",
      maxBuffer: 16 * 1024 * 1024,
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  audit = JSON.parse(output);
} catch (error) {
  // npm exits nonzero for findings as well as network failures. Only a report with
  // audit metadata counts as a completed audit.
  try {
    audit = JSON.parse(error.stdout?.toString() ?? "");
  } catch {
    /* Reported below. */
  }
}
if (!audit?.metadata?.vulnerabilities)
  throw new Error(
    "npm audit did not produce a complete advisory report; the inventory was not updated.",
  );

const packages = new Map();
for (const [location, data] of Object.entries(lock.packages)) {
  if (!location.includes("node_modules/")) {
    continue;
  }
  if (data.link || !data.version) continue;
  const name = data.name ?? location.split("node_modules/").at(-1);
  const key = `${name}@${data.version}`;
  if (!packages.has(key))
    packages.set(key, {
      name,
      version: data.version,
    });
}
const today = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Toronto",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());
const rows = [...packages.values()];
const direct = new Map();
const ownerName = (location) => location || "root";
for (const location of [""]) {
  const manifest = lock.packages[location];
  for (const [type, suffix] of [
    ["dependencies", ""],
    ["devDependencies", " (dev)"],
    ["optionalDependencies", " (optional)"],
    ["peerDependencies", " (peer)"],
  ]) {
    for (const [name, range] of Object.entries(manifest[type] ?? {})) {
      const entry = direct.get(name) ?? { owners: [], ranges: new Set() };
      entry.owners.push(`${ownerName(location)}${suffix}`);
      entry.ranges.add(range);
      direct.set(name, entry);
    }
  }
}
const dependencyPurposes = {
  "@biomejs/biome":
    "Repository linting; pinned tool version keeps local and CI rules aligned.",
  "@floating-ui/react":
    "Accessible viewport-aware InfoTip positioning and dismissal; retain the existing 0.27 API range.",
  "@tailwindcss/postcss":
    "Compiles Tailwind in Next.js; keep its major aligned with Tailwind 4.",
  "@types/node":
    "Node server/tooling types; Node 24 type baseline within the supported runtime range.",
  "@types/react":
    "React component types; keep major 19 aligned with React and React DOM.",
  "@types/react-dom":
    "React DOM types; keep major 19 aligned with the React runtime and types.",
  "libphonenumber-js":
    "International phone parsing, formatting, and calling-code validation in shared contact fields; uses the smaller min entry.",
  next: "App Router rendering, routing, metadata, and builds; pinned to Next 16.4.3.",
  prettier:
    "Repository formatting and generated dependency documentation; exact version stabilizes output.",
  react: "Server/client component runtime; pinned to React 19.3.1.",
  "react-dom":
    "Browser hydration and DOM rendering; keep its version aligned with React 19.3.1.",
  "react-icons":
    "Shared Lucide icons for controls and status feedback; exact version preserves the approved icon API.",
  "server-only":
    "Build-time guard for trusted environment, metadata, and email modules; prevents accidental client imports.",
  tailwindcss:
    "Utility and token-based styling; retain major 4 with its PostCSS plugin.",
  typescript:
    "Strict TypeScript checking; exact 7.0.2 pin keeps local and CI checks consistent.",
};
const counts = audit.metadata.vulnerabilities;
const lines = [
  "# Dependency inventory and audit",
  "",
  `Inventory refreshed and npm advisory audit run: **${today} (America/Toronto)**.`,
  "",
  "Direct dependency versions and runtime/tooling classification come from [package-lock.json](../package-lock.json). The lockfile records the complete transitive tree; this document lists only direct dependencies. Use the Node 26 runtime in `.nvmrc` (26.12.1) and npm 11 or newer. The manifest permits Node >=24.22.1 <27; tests use Node native TypeScript support.",
  "",
  `The audit covered the locked dependency tree (${audit.metadata.dependencies?.total ?? "unknown"} entries reported by npm, including optional packages). Results: **${counts.total} vulnerabilities** - ${counts.critical} critical, ${counts.high} high, ${counts.moderate} moderate, ${counts.low} low, and ${counts.info} informational. The scan includes transitive dependencies and is not a source-code security review.`,
  "",
];
if (Object.keys(audit.vulnerabilities ?? {}).length) {
  lines.push("## Reported advisories", "");
  for (const [name, item] of Object.entries(audit.vulnerabilities)) {
    const links = (item.via ?? [])
      .filter(
        (v) =>
          typeof v === "object" &&
          typeof v.url === "string" &&
          v.url.startsWith("https://"),
      )
      .map((v) => `[advisory](${v.url})`);
    lines.push(
      `- **${name}** - ${item.severity}, ${item.isDirect ? "direct" : "transitive"}; affected range: \`${String(item.range).replaceAll("`", "")}\`${links.length ? `; ${links.join(", ")}` : ""}.`,
    );
  }
  lines.push("");
}
lines.push(
  "## Direct dependencies",
  "",
  "Runtime dependencies support the single Next.js application; owners marked `dev` are development tools.",
  "",
  "| Library | Used by | Purpose and notable constraints | Declared range | Locked version(s) |",
  "| --- | --- | --- | --- | --- |",
);
for (const [name, info] of [...direct].sort(([a], [b]) => a.localeCompare(b))) {
  const versions = rows.filter((item) => item.name === name);
  const purpose = dependencyPurposes[name];
  if (!purpose)
    throw new Error(`Document the purpose and constraints for ${name}.`);
  lines.push(
    `| \`${name}\` | ${info.owners.map((owner) => `\`${owner}\``).join(", ")} | ${purpose} | ${[...info.ranges].map((range) => `\`${range.replaceAll("|", "\\|")}\``).join(", ")} | ${versions.map((item) => `\`${item.version}\``).join(", ") || "Not locked"} |`,
  );
}
lines.push(
  "",
  "## Maintenance and security notes",
  "",
  "No unused direct dependency or deprecated direct API requiring replacement was identified in the source-import review. Existing Motchi controls cover the current micro-interactions; no Interior.dev source or dependencies are installed. Recheck usage and advisories when changing dependencies.",
  "",
  "The application pins Next 16 and React 19; review major upgrades together. Multiple PostCSS versions are transitive constraints, not separate applications. Keep server-only guards around trusted configuration and email code.",
  "",
);
lines.push(
  "",
  "## Refreshing this document",
  "",
  "After dependency changes, update the root lockfile, then run:",
  "",
  "```bash",
  "npm run dependencies:inventory",
  "```",
  "",
  "The command runs `npm audit` including development, optional, and peer dependencies, and regenerates this direct-dependency inventory. It exits nonzero if the audit cannot complete or vulnerabilities are reported. Review advisory details and dependency changes before upgrading; the command does not install or upgrade packages.",
  "",
);
const outputPath = path.join(root, "docs", "DEPENDENCIES.md");
const formatterOptions = await resolveConfig(outputPath);
await writeFile(
  outputPath,
  await format(lines.join("\n"), { ...formatterOptions, filepath: outputPath }),
);
console.log(
  `Updated docs/DEPENDENCIES.md: ${direct.size} direct dependencies, ${counts.total} reported vulnerabilities.`,
);
if (counts.total) process.exitCode = 1;
