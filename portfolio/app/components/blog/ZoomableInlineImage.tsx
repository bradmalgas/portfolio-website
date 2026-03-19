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

export default function ZoomableInlineImage({
  src,
  alt,
}: ZoomableInlineImageProps) {
  const [isOpen, setIsOpen] = useState(false);

  function handleOpen(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    setIsOpen(true);
  }

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="my-8 block w-full overflow-hidden rounded-md border border-border bg-surface-raised text-left transition-all duration-250 hover:border-accent/50 hover:shadow-glow"
        aria-label={`Open image: ${alt}`}
      >
        <span className="relative block">
          <Image
            src={src}
            alt={alt}
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

      <Lightbox
        open={isOpen}
        close={() => setIsOpen(false)}
        slides={[{ src, alt }]}
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
    </>
  );
}
