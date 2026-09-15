/**
 * ProductPhoto — real product photography for each flavor, served from
 * /public/products/{imageKey}.jpg. Falls back to the illustrated BottleArt
 * SVG while a photo file is missing, so the UI never shows a broken image.
 *
 * Photo mapping (photo → imageKey):
 *   green liquid   → green-apple  (green-apple.jpg)
 *   yellow liquid  → lemon        (lemon.jpg)
 *   orange liquid  → orange       (orange.jpg)
 *   clear liquid   → original     (original.jpg)
 *   pink liquid    → rose         (rose.jpg)
 *   brown liquid   → cola         (cola.jpg)
 *   blue liquid    → blueberry    (blueberry.jpg)
 *
 * All 7 flavors have real photos — no SVG fallback needed in production.
 * The onError handler still catches any missing-file edge case gracefully.
 */

import { useState } from "react";
import { BottleArt } from "./BottleArt";
import { FactoryScene } from "./FactoryScene";

const REAL_PHOTO_FLAVORS = new Set([
  "cola",
  "blueberry",
  "rose",
  "orange",
  "original",
  "lemon",
  "green-apple",
]);

export function ProductPhoto({
  flavor,
  className,
  showShadow = true,
}: {
  flavor: string;
  className?: string;
  showShadow?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  // If flavor doesn't have a real photo yet or failed to load, fall back to BottleArt SVG
  if (failed || !flavor || !REAL_PHOTO_FLAVORS.has(flavor)) {
    return (
      <BottleArt flavor={flavor || "original"} className={className} showShadow={showShadow} />
    );
  }

  return (
    <img
      src={`/products/${flavor}.jpg`}
      alt={`Kick Goli Soda ${flavor} — 200 ml glass bottle`}
      loading="lazy"
      draggable={false}
      className={`object-contain ${className ?? ""}`}
      onError={() => setFailed(true)}
    />
  );
}

/**
 * FactoryBanner — the real factory/tea-garden banner photo from
 * /public/products/factory.jpg. Falls back to the illustrated FactoryScene
 * while the photo is missing.
 */
export function FactoryBanner({ className }: { className?: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <FactoryScene className={className} />;
  }

  return (
    <img
      src="/products/factory.jpg"
      alt="Vibhin Enterprises Kick Goli Soda manufacturing plant and head office at Ajjampura, Chikmagalur District"
      loading="lazy"
      draggable={false}
      className={`object-cover ${className ?? ""}`}
      onError={() => setFailed(true)}
    />
  );
}

/** Hero band: the full product family — all 7 flavors in canonical order. */
export function BottleFamily({ className }: { className?: string }) {
  const flavors = ["cola", "blueberry", "green-apple", "original", "orange", "lemon", "rose"];
  return (
    <div className={className}>
      <div className="flex items-end justify-center gap-2 sm:gap-4">
        {flavors.map((f, i) => (
          <div
            key={f}
            className="relative"
            style={{
              zIndex: flavors.length - i,
              transform: `translateY(${Math.abs(i - 3) * 2}px)`,
            }}
          >
            <ProductPhoto
              flavor={f}
              className="h-[14vw] max-h-24 min-h-[52px] w-auto"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
