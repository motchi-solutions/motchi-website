import type { Branch } from "../../lib/brand.ts";
import { logos } from "../../lib/brand.ts";
import Image from "next/image";

export function RouteLoading({ branch }: { branch: Branch }) {
  const logo = logos[branch];
  return (
    <div className="route-loading">
      <div className="route-emblem" aria-hidden="true">
        <span className="route-orbit" />
        {logo ? (
          <Image
            src={logo.src}
            width={logo.width}
            height={logo.height}
            alt=""
            className="h-20 w-20"
          />
        ) : (
          <span className="font-semibold">MOTCHI</span>
        )}
      </div>
      <output className="mt-7 text-sm text-muted">
        Opening Your Next Page
      </output>
    </div>
  );
}
