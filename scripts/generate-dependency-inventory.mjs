import { execFileSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { format, resolveConfig } from "prettier";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lock = JSON.parse(
  await readFile(path.join(root, "package-lock.json"), "utf8"),
);
const argumentsList = process.argv.slice(2);
const datesIndex = argumentsList.indexOf("--dates-file");
if (datesIndex !== -1 && !argumentsList[datesIndex + 1])
  throw new Error("--dates-file requires a path.");
const dates =
  datesIndex === -1
    ? {}
    : JSON.parse(await readFile(argumentsList[datesIndex + 1], "utf8")).dates;

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
const workspacePaths = [];
for (const [location, data] of Object.entries(lock.packages)) {
  if (!location.includes("node_modules/")) {
    if (location) workspacePaths.push(location);
    continue;
  }
  if (data.link || !data.version) continue;
  const name = data.name ?? location.split("node_modules/").at(-1);
  const key = `${name}@${data.version}`;
  if (!packages.has(key))
    packages.set(key, {
      name,
      version: data.version,
      publicRegistry:
        data.resolved?.startsWith("https://registry.npmjs.org/") ?? false,
    });
}
const names = [
  ...new Set(
    [...packages.values()]
      .filter((item) => item.publicRegistry)
      .map((item) => item.name),
  ),
].filter((name) => !dates[name]);
let cursor = 0;
const failed = [];
await Promise.all(
  Array.from({ length: Math.min(8, names.length) }, async () => {
    while (cursor < names.length) {
      const name = names[cursor++];
      try {
        const response = await fetch(
          `https://registry.npmjs.org/${encodeURIComponent(name).replace(/^%40/, "@")}`,
          {
            headers: { Accept: "application/json" },
            signal: AbortSignal.timeout(25000),
          },
        );
        if (!response.ok) throw new Error("Registry request failed.");
        const body = await response.json();
        dates[name] = body.time ?? {};
      } catch {
        failed.push(name);
      }
    }
  }),
);

const date = (value) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Toronto",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
const today = date(Date.now());
const rows = [...packages.values()].sort(
  (a, b) => a.name.localeCompare(b.name) || a.version.localeCompare(b.version),
);
const direct = new Map();
const ownerName = (location) => location || "root";
for (const location of ["", ...workspacePaths]) {
  const workspace = lock.packages[location];
  for (const [type, suffix] of [
    ["dependencies", ""],
    ["devDependencies", " (dev)"],
    ["optionalDependencies", " (optional)"],
    ["peerDependencies", " (peer)"],
  ]) {
    for (const [name, range] of Object.entries(workspace[type] ?? {})) {
      if (name.startsWith("@motchi/")) continue;
      const entry = direct.get(name) ?? { owners: [], ranges: new Set() };
      entry.owners.push(`${ownerName(location)}${suffix}`);
      entry.ranges.add(range);
      direct.set(name, entry);
    }
  }
}
const published = (item) => {
  const value = dates[item.name]?.[item.version];
  return value && !Number.isNaN(Date.parse(value))
    ? date(value)
    : "Not available";
};
const missing = rows.filter(
  (item) => item.publicRegistry && published(item) === "Not available",
);
const counts = audit.metadata.vulnerabilities;
const lines = [
  "# Dependency inventory and audit",
  "",
  `Inventory refreshed and npm advisory audit run: **${today} (America/Toronto)**.`,
  "",
  "The exact versions are from [package-lock.json](../package-lock.json), including transitive and platform-specific optional packages. The publication date is when that exact locked version was published to the public npm registry, shown in Toronto time. It is not the date this repository installed or updated the dependency; npm's lockfile does not record that date. Git history records committed lockfile changes.",
  "",
  `The audit covered the locked dependency tree (${audit.metadata.dependencies?.total ?? "unknown"} entries reported by npm, including workspaces and optional packages). Results: **${counts.total} vulnerabilities** - ${counts.critical} critical, ${counts.high} high, ${counts.moderate} moderate, ${counts.low} low, and ${counts.info} informational. This is an npm advisory scan, not an independent source-code audit. The audit date applies to every external package below.`,
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
  "Owners marked `peer` declare a compatible host version; `dev` dependencies are tooling. Internal `@motchi/*` workspaces are listed separately.",
  "",
  "| Library | Used by | Declared range | Locked version(s) | Version published |",
  "| --- | --- | --- | --- | --- |",
);
for (const [name, info] of [...direct].sort(([a], [b]) => a.localeCompare(b))) {
  const versions = rows.filter((item) => item.name === name);
  lines.push(
    `| \`${name}\` | ${info.owners.map((owner) => `\`${owner}\``).join(", ")} | ${[...info.ranges].map((range) => `\`${range.replaceAll("|", "\\|")}\``).join(", ")} | ${versions.map((item) => `\`${item.version}\``).join(", ") || "Not locked"} | ${versions.map(published).join(", ") || "Not available"} |`,
  );
}
lines.push(
  "",
  "## Internal workspaces",
  "",
  "These are repository-owned packages, not separately published third-party libraries. Their contents are the current checkout; npm advisory results do not constitute a source-code audit of them.",
  "",
  "| Workspace | Version |",
  "| --- | --- |",
);
for (const location of workspacePaths.sort())
  lines.push(
    `| \`${location}\` | \`${lock.packages[location].version ?? "Not specified"}\` |`,
  );
lines.push(
  "",
  "## Complete locked third-party inventory",
  "",
  `${rows.length} distinct package/version entries. Some are transitive dependencies or platform-specific binaries that npm installs only on the relevant platform. The audit date above applies to this entire list.`,
  "",
  "| Library | Locked version | Version published |",
  "| --- | --- | --- |",
);
for (const item of rows)
  lines.push(`| \`${item.name}\` | \`${item.version}\` | ${published(item)} |`);
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
  "The command runs `npm audit` including development, optional, and peer dependencies; retrieves public npm publication dates; and regenerates this file. It exits nonzero if the audit cannot complete, a public version date cannot be retrieved, or vulnerabilities are reported. Review advisory details and dependency changes before upgrading; the command does not install or upgrade packages.",
  "",
);
if (missing.length)
  lines.push(
    `Registry publication dates unavailable for: ${missing.map((item) => `\`${item.name}@${item.version}\``).join(", ")}.`,
    "",
  );
const outputPath = path.join(root, "docs", "DEPENDENCIES.md");
const formatterOptions = await resolveConfig(outputPath);
await writeFile(
  outputPath,
  await format(lines.join("\n"), { ...formatterOptions, filepath: outputPath }),
);
console.log(
  `Updated docs/DEPENDENCIES.md: ${rows.length} locked versions, ${counts.total} reported vulnerabilities, ${missing.length} missing publication dates.`,
);
if (failed.length || missing.length || counts.total) process.exitCode = 1;
