import type { MediaAsset } from "@motchi/brand";
import Image from "next/image";
import type { ReactNode } from "react";
import { AnimatedImage, ResponsiveVideo } from "./responsive-video";
export function MediaFrame({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`media-frame relative overflow-hidden border border-border ${className}`}
    >
      {children}
    </div>
  );
}
export function ProjectMedia({
  asset,
  sizes = "(min-width: 1024px) 55vw, 100vw",
  autoplay = false,
}: {
  asset: MediaAsset;
  sizes?: string;
  autoplay?: boolean;
}) {
  if (asset.kind === "video")
    return <ResponsiveVideo asset={asset} autoplay={autoplay} />;
  if (asset.kind === "gif") return <AnimatedImage asset={asset} />;
  return (
    <Image
      src={asset.src}
      alt={asset.alt}
      width={asset.width}
      height={asset.height}
      sizes={sizes}
      className="media-image h-auto w-full"
    />
  );
}
