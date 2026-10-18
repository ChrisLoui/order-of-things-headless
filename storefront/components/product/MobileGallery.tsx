"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ArrowIcon } from "@/components/icons";
import { MOBILE_GALLERY } from "@/lib/gallery";
import { HeroImage } from "./HeroImage";

// Figma 14:3885: swipeable gallery with prev/next arrows, a counter and a
// segmented indicator. Built on CSS scroll snap, so touch swiping is native.
const pad = (n: number) => String(n).padStart(2, "0");

// The carousel is hidden from lg up, so it only needs a full-width image below lg.
// Saying so keeps a hidden slide from ever picking a large source on desktop.
const SIZES = "(min-width: 1024px) 1px, 100vw";

export function MobileGallery({ className }: { className?: string }) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const last = MOBILE_GALLERY.length - 1;
  // Keeps the index on a real slide: elastic overscroll can round past the ends.
  const clamp = (i: number) => Math.min(last, Math.max(0, i));

  const goTo = (i: number) => {
    const el = track.current;
    if (!el) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: clamp(i) * el.clientWidth, behavior: reduceMotion ? "auto" : "smooth" });
  };

  const onScroll = () => {
    const el = track.current;
    // Hidden from lg up (display: none), where clientWidth is 0.
    if (!el || el.clientWidth === 0) return;
    setIndex(clamp(Math.round(el.scrollLeft / el.clientWidth)));
  };

  const arrowClass =
    "flex size-11 items-center justify-center border border-ink bg-bone disabled:opacity-55";

  return (
    <section aria-roledescription="carousel" aria-label="Product photos" className={className}>
      <div className="relative">
        <div
          ref={track}
          onScroll={onScroll}
          className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none]"
        >
          {MOBILE_GALLERY.map((image, i) => (
            <div
              key={image.src}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${MOBILE_GALLERY.length}`}
              className="relative aspect-[390/488] w-full shrink-0 snap-start"
            >
              {i === 0 ? (
                <HeroImage image={image} sizes={SIZES} shownOn="mobile" />
              ) : (
                <Image src={image.src} alt={image.alt} fill sizes={SIZES} className="object-cover" />
              )}
            </div>
          ))}
        </div>

        <div className="absolute right-4 bottom-4 flex gap-2">
          <button
            type="button"
            aria-label="Previous photo"
            disabled={index === 0}
            onClick={() => goTo(index - 1)}
            className={arrowClass}
          >
            <ArrowIcon className="size-[19.2px] rotate-180" />
          </button>
          <button
            type="button"
            aria-label="Next photo"
            disabled={index === last}
            onClick={() => goTo(index + 1)}
            className={arrowClass}
          >
            <ArrowIcon className="size-[19.2px]" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-ink px-5 py-[14px]">
        <p className="flex items-center gap-3" aria-live="polite">
          <span className="text-label-mobile">
            {pad(index + 1)} / {pad(MOBILE_GALLERY.length)}
          </span>
          <span className="text-label">{MOBILE_GALLERY[index].caption}</span>
        </p>
        <div className="flex items-center gap-1" aria-hidden>
          {MOBILE_GALLERY.map((image, i) => (
            <span
              key={image.src}
              className={`h-0.5 bg-ink ${
                i === index ? "w-7" : "w-4"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
