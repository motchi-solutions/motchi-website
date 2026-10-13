import { SiteLink } from "./site-link";
import { sites as family } from "@motchi/config/sites";
import { type Branch, logos } from "@motchi/brand";
import Image from "next/image";
export function BranchMark({ branch }: { branch: Branch }) {
  const logo = logos[branch];
  return (
    <SiteLink
      href="/"
      className="brand-mark inline-flex min-h-12 items-center gap-3"
      data-branch={branch}
      aria-label={`${family[branch].name} home`}
    >
      {logo && (
        <Image
          src={logo.src}
          width={logo.width}
          height={logo.height}
          alt=""
          priority
          className="h-11 w-11 object-contain"
        />
      )}
      <span className="flex flex-col">
        <span className="text-2xl font-semibold leading-none tracking-tight">
          MOTCHI
        </span>
        <span className="branch-label mt-1.5 text-sm font-medium tracking-wide">
          {family[branch].shortName}
        </span>
      </span>
    </SiteLink>
  );
}
