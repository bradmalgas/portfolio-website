"use client";

import Image from "next/image";
import { useState, type MouseEvent } from "react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

interface ZoomableInlineImageProps {
  src: string;
  alt: string;
}

const SIZE_CLASSES: Record<string, string> = {
  sm: "max-w-[40%]",
  md: "max-w-[65%]",
  lg: "max-w-[80%]",
};

function parseAlt(raw: string) {
  const [text, ...rest] = raw.split("|");
  const hints = rest.join("").toLowerCase().trim().split(/\s+/);
  const size = hints.find((h) => h in SIZE_CLASSES);
  const zoomable = hints.includes("zoom");
  return { displayAlt: text.trim(), size, zoomable };
}

export default function ZoomableInlineImage({
  src,
  alt,
}: ZoomableInlineImageProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isGif = src.toLowerCase().split("?")[0].endsWith(".gif");
  const { displayAlt, size, zoomable } = parseAlt(alt);

  const accessibleAlt = displayAlt || "Illustration from the article";
  const sizeClass = size ? `${SIZE_CLASSES[size]} mx-auto` : "w-full";
  const mediaClass = `block overflow-hidden rounded-md border border-border ${sizeClass}`;

  function handleOpen(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    setIsOpen(true);
  }

  const caption = displayAlt ? (
    <span className="mt-3 block text-center text-sm italic text-ink-tertiary">
      {displayAlt}
    </span>
  ) : null;

  // GIFs must bypass next/image — the optimiser strips animation frames.
  if (isGif) {
    return (
      <span className="my-8 block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={accessibleAlt} className={`${mediaClass} h-auto`} />
        {caption}
      </span>
    );
  }

  if (!zoomable) {
    return (
      <span className="my-8 block">
        <span className={`${mediaClass} bg-surface-raised`}>
          <Image
            src={src}
            alt={accessibleAlt}
            width={1200}
            height={675}
            className="h-auto w-full"
            sizes="(max-width: 1024px) 100vw, 960px"
          />
        </span>
        {caption}
      </span>
    );
  }

  return (
    <span className="my-8 block">
      <button
        type="button"
        onClick={handleOpen}
        className={`${mediaClass} bg-surface-raised text-left transition-all duration-250 hover:border-accent/50 hover:shadow-glow`}
        aria-label={`Open image: ${accessibleAlt}`}
      >
        <span className="relative block">
          <Image
            src={src}
            alt={accessibleAlt}
            width={1200}
            height={675}
            className="h-auto w-full object-cover"
            sizes="(max-width: 1024px) 100vw, 960px"
          />
          <span className="absolute bottom-3 right-3 rounded-full border border-border bg-background/85 px-3 py-1 text-xs font-medium text-ink-secondary backdrop-blur-sm">
            Tap to zoom
          </span>
        </span>
      </button>
      {caption}

      <Lightbox
        open={isOpen}
        close={() => setIsOpen(false)}
        slides={[{ src: src, alt: accessibleAlt }]}
        plugins={[Zoom]}
        carousel={{ finite: true }}
        controller={{ closeOnBackdropClick: true }}
        animation={{ fade: 180, swipe: 220 }}
        zoom={{
          maxZoomPixelRatio: 4,
          zoomInMultiplier: 2,
          pinchZoomDistanceFactor: 80,
          wheelZoomDistanceFactor: 120,
          doubleTapDelay: 280,
          keyboardMoveDistance: 40,
        }}
        render={{
          buttonPrev: () => null,
          buttonNext: () => null,
        }}
      />
    </span>
  );
}
