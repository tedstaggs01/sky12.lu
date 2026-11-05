"use client";

import { useState } from "react";

export function CopyLine({
  label,
  value,
  messages,
}: {
  label: string;
  value: string;
  messages: { empty: string; copy: string; copied: string };
}) {
  const [copied, setCopied] = useState(false);
  const ready = value.trim().length > 0;

  async function copy() {
    if (!ready) return;
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-sm text-muted">{label}</p>
        <p className="mt-1 text-lg font-medium tracking-tight">
          {ready ? value : messages.empty}
        </p>
      </div>
      {ready ? (
        <button
          type="button"
          onClick={copy}
          className="cursor-pointer rounded-lg border border-line px-3 py-2 text-sm font-medium hover:bg-neutral-50"
        >
          {copied ? messages.copied : messages.copy}
        </button>
      ) : null}
    </div>
  );
}
