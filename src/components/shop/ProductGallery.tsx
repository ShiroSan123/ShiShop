/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  title: string;
}

export const ProductGallery = ({ images, title }: ProductGalleryProps) => {
  const [active, setActive] = useState(0);
  const safeImages = images.length > 0 ? images : [""];
  const current = safeImages[active] ?? safeImages[0];

  return (
    <div className="space-y-3">
      <div className="aspect-[4/3] overflow-hidden rounded-[24px] border border-slate-200 bg-slate-100 shadow-lg">
        {current ? (
          <img src={current} alt={title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            Нет фото
          </div>
        )}
      </div>
      <div className="flex gap-2">
        {safeImages.map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            onClick={() => setActive(index)}
            className={cn(
              "h-16 w-20 overflow-hidden rounded-xl border",
              index === active ? "border-[var(--accent)]" : "border-slate-200"
            )}
          >
            {image ? (
              <img
                src={image}
                alt={`${title} ${index + 1}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-slate-400">
                —
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
