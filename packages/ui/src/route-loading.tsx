import type { Branch } from "@motchi/brand";
import { logos } from "@motchi/brand";
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
