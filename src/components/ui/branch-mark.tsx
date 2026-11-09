import { SiteLink } from "./site-link.tsx";
import { sites as family } from "../../lib/config/sites.ts";
import { type Branch, logos } from "../../lib/brand.ts";
import Image from "next/image";
export function BranchMark({
  branch,
  href = "/",
  transition = false,
  homeLabel,
}: {
  branch: Branch;
  href?: string;
  transition?: boolean;
  homeLabel?: string;
}) {
  const logo = logos[branch];
  return (
    <SiteLink
      href={href}
      className={`brand-mark inline-flex min-h-12 items-center gap-3 ${transition ? "header-brand" : ""}`}
      data-branch={branch}
      aria-label={homeLabel ?? `${family[branch].name} home`}
    >
      {transition ? (
        <span className="header-brand-art" aria-hidden="true">
          {(["solutions", "websites", "consulting"] as const).map(
            (identity) => {
              const asset = logos[identity];
              return (
                asset && (
                  <Image
                    key={identity}
                    src={asset.src}
                    width={asset.width}
                    height={asset.height}
                    alt=""
                    unoptimized
                    loading="eager"
                    data-active={branch === identity}
                  />
                )
              );
            },
          )}
        </span>
      ) : (
        logo && (
          <Image
            src={logo.src}
            width={logo.width}
            height={logo.height}
            alt=""
            unoptimized
            loading="lazy"
            className="h-11 w-11 object-contain"
          />
        )
      )}
      <span className="flex flex-col">
        <span className="text-2xl font-semibold leading-none tracking-tight">
          MOTCHI
        </span>{" "}
        {transition ? (
          <span className="branch-label header-brand-label mt-1.5 text-sm font-medium tracking-wide">
            {(["solutions", "websites", "consulting"] as const).map(
              (identity) => (
                <span
                  key={identity}
                  data-active={branch === identity}
                  aria-hidden={branch !== identity}
                >
                  {family[identity].shortName}
                </span>
              ),
            )}
          </span>
        ) : (
          <span className="branch-label mt-1.5 text-sm font-medium tracking-wide">
            {family[branch].shortName}
          </span>
        )}
      </span>
    </SiteLink>
  );
}
