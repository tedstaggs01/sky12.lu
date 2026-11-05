"use client";

export function SavePdf({ label, hint }: { label: string; hint: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="mt-6 flex w-full items-center justify-between gap-4 rounded-2xl border border-line bg-white px-5 py-4 text-left shadow-[0_8px_24px_rgba(34,34,34,0.04)] print:hidden"
    >
      <span>
        <span className="block text-[15px] font-medium">{label}</span>
        <span className="mt-1 block text-sm font-normal text-muted">{hint}</span>
      </span>
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-5 w-5 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M12 4v10" />
        <path d="m8 10 4 4 4-4" />
        <path d="M5 19h14" />
      </svg>
    </button>
  );
}
