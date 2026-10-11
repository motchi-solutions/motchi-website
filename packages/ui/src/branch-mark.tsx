import { type Branch, family, logos } from "@motchi/brand";
import Image from "next/image";
export function BranchMark({ branch }: { branch: Branch }) {
  const logo = logos[branch];
  return (
    <a
      href="/"
      className="brand-mark inline-flex min-h-12 items-center gap-3"
      aria-label={`${family[branch].name} home`}
    >
      {logo && (
        <Image
          src={logo.src}
          width={logo.width}
          height={logo.height}
          alt=""
          priority
          className="h-12 w-auto max-w-20 object-contain"
        />
      )}
      <span className="flex flex-col">
        <span className="text-2xl font-semibold leading-none tracking-tight">
          Motchi<span className="text-primary">.</span>
        </span>
        <span className="mt-1.5 text-xs tracking-widest uppercase">
          {branch}
        </span>
      </span>
    </a>
  );
}
