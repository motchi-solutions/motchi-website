"use client";
import type { GifAsset, VideoAsset } from "@motchi/brand";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
export function ResponsiveVideo({
  asset,
  autoplay = false,
}: {
  asset: VideoAsset;
  autoplay?: boolean;
}) {
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const node = video.current;
    if (!node || !autoplay || !("IntersectionObserver" in window)) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const stop = () => {
      node.pause();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          !preference.matches &&
          document.visibilityState === "visible"
        ) {
          void node.play().catch(() => {
            /* Native controls remain available when autoplay is denied. */
          });
        } else stop();
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    preference.addEventListener("change", stop);
    document.addEventListener("visibilitychange", stop);
    return () => {
      observer.disconnect();
      stop();
      preference.removeEventListener("change", stop);
      document.removeEventListener("visibilitychange", stop);
    };
  }, [autoplay]);
  return (
    <video
      ref={video}
      aria-label={asset.label}
      controls
      muted
      playsInline
      loop={autoplay}
      preload="none"
      poster={asset.poster.src}
      width={asset.poster.width}
      height={asset.poster.height}
      className="h-auto w-full"
    >
      {asset.sources.map((source) => (
        <source key={source.src} src={source.src} type={source.type} />
      ))}
      <p>
        Your browser cannot play this preview.{" "}
        {asset.sources[0] && (
          <a href={asset.sources[0].src}>Download {asset.label}</a>
        )}
        .
      </p>
    </video>
  );
}
export function AnimatedImage({ asset }: { asset: GifAsset }) {
  const [enhanced, setEnhanced] = useState(false);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    setEnhanced(true);
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const stop = () => setPlaying(false);
    preference.addEventListener("change", stop);
    return () => preference.removeEventListener("change", stop);
  }, []);
  return (
    <div className="relative">
      <Image
        src={playing ? asset.src : asset.poster.src}
        alt={asset.label}
        width={asset.poster.width}
        height={asset.poster.height}
        sizes="(min-width: 1024px) 55vw, 100vw"
        unoptimized={playing}
        className="h-auto w-full"
      />
      {enhanced && (
        <button
          type="button"
          onClick={() => setPlaying(!playing)}
          aria-pressed={playing}
          className="button-link absolute right-3 bottom-3 min-h-11 cursor-pointer border border-border bg-background px-4 py-2 text-sm text-foreground"
        >
          {playing ? "Pause animation" : "Play animation"}
        </button>
      )}
      <noscript>
        <a
          href={asset.src}
          className="inline-flex min-h-12 items-center p-3 underline"
        >
          View {asset.label} animation
        </a>
      </noscript>
    </div>
  );
}
