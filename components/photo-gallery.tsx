"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export type Photo = {
  src: string;
  alt: string;
};

export function PhotoGallery({
  photos,
  labels,
}: {
  photos: Photo[];
  labels: { showAll: string; close: string; count: string; dialog: string };
}) {
  const [open, setOpen] = useState(false);
  const main = photos[0];
  const side = photos.slice(1, 5);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <div className="relative">
      <div className="grid grid-cols-1 gap-2 md:h-[480px] md:grid-cols-4 md:grid-rows-2">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="relative h-[280px] cursor-pointer overflow-hidden rounded-2xl sm:h-[360px] md:col-span-2 md:row-span-2 md:h-full"
        >
          <Image
            src={main.src}
            alt={main.alt}
            fill
            priority
            className="object-cover transition duration-300 hover:brightness-95"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        </button>
        {side.map((photo) => (
          <button
            key={photo.src}
            type="button"
            onClick={() => setOpen(true)}
            className="relative hidden cursor-pointer overflow-hidden rounded-2xl md:block"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className="object-cover transition duration-300 hover:brightness-95"
              sizes="25vw"
            />
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="absolute right-4 bottom-4 cursor-pointer rounded-lg border border-neutral-900 bg-white px-4 py-2 text-sm font-medium shadow-sm"
      >
        {labels.showAll}
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-white"
          role="dialog"
          aria-modal="true"
          aria-label={labels.dialog}
        >
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-white px-6 py-4">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="cursor-pointer rounded-lg px-3 py-2 text-sm font-medium hover:bg-neutral-100"
            >
              {labels.close}
            </button>
            <p className="text-sm text-muted">{labels.count.replace("{count}", String(photos.length))}</p>
          </div>
          <div className="mx-auto grid max-w-5xl gap-3 px-6 py-6">
            {photos.map((photo) => (
              <figure key={photo.src}>
                {/* Native img keeps each photo's own shape in the full gallery. */}
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full rounded-2xl"
                />
                <figcaption className="mt-2 text-sm text-muted">{photo.alt}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
