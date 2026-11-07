import type { MediaAsset } from "../../lib/brand.ts";
import { getImageProps } from "next/image";
import type { ReactNode } from "react";
import { AnimatedImage, ResponsiveVideo } from "./responsive-video.tsx";
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
  loading = "lazy",
  fetchPriority,
}: {
  asset: MediaAsset;
  sizes?: string;
  autoplay?: boolean;
  loading?: "eager" | "lazy";
  fetchPriority?: "high" | "low" | "auto";
}) {
  if (asset.kind === "video")
    return <ResponsiveVideo asset={asset} autoplay={autoplay} />;
  if (asset.kind === "gif")
    return (
      <AnimatedImage
        asset={asset}
        loading={loading}
        fetchPriority={fetchPriority}
        sizes={sizes}
      />
    );
  // Keep static previews server-rendered with Next's optimized responsive URLs.
  const { props } = getImageProps({
    loading,
    fetchPriority,
    src: asset.src,
    alt: asset.alt,
    width: asset.width,
    height: asset.height,
    sizes,
    className: "media-image h-auto w-full",
  });
  // biome-ignore lint/performance/noImgElement: getImageProps preserves Next image optimization without a client component.
  return <img {...props} alt={asset.alt} />;
}
