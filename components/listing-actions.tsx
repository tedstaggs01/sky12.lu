"use client";

import { useState } from "react";

export function ListingActions({
  labels,
}: {
  labels: {
    share: string;
    copied: string;
    save: string;
    saved: string;
    shareTitle: string;
  };
}) {
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: labels.shareTitle, url });
        return;
      } catch {
        return;
      }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="flex shrink-0 items-center gap-1 text-sm font-medium">
      <button
        type="button"
        onClick={share}
        className="cursor-pointer rounded-lg px-3 py-2 underline-offset-2 hover:bg-neutral-100 hover:underline"
      >
        {copied ? labels.copied : labels.share}
      </button>
      <button
        type="button"
        onClick={() => setSaved((value) => !value)}
        className="cursor-pointer rounded-lg px-3 py-2 underline-offset-2 hover:bg-neutral-100 hover:underline"
        aria-pressed={saved}
      >
        {saved ? labels.saved : labels.save}
      </button>
    </div>
  );
}
