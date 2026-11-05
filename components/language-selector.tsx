"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { hasLocale, localeLabels, locales, type Locale } from "@/lib/locale";

export function LanguageSelector({ label }: { label: string }) {
  const pathname = usePathname();
  const segment = pathname.split("/")[1] ?? "";
  const current: Locale = hasLocale(segment) ? segment : "en";
  const rest = pathname.replace(/^\/(en|de|fr)(?=\/|$)/, "");
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointer = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-sm font-medium"
      >
        <Flag locale={current} />
        <span lang={current}>{localeLabels[current]}</span>
        <svg
          viewBox="0 0 16 16"
          aria-hidden="true"
          className={`h-3.5 w-3.5 text-muted ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M4 6.5 8 10.5 12 6.5" />
        </svg>
      </button>
      {open ? (
        <ul
          role="listbox"
          aria-label={label}
          className="absolute bottom-full left-0 z-20 mb-2 min-w-44 rounded-2xl border border-line bg-white p-1 shadow-[0_8px_24px_rgba(34,34,34,0.08)] sm:right-0 sm:left-auto"
        >
          {locales.map((locale) => {
            const active = locale === current;
            const className =
              "flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm";

            if (active) {
              return (
                <li key={locale} role="presentation">
                  <span
                    role="option"
                    aria-selected="true"
                    lang={locale}
                    className={`${className} font-medium`}
                  >
                    <Flag locale={locale} />
                    {localeLabels[locale]}
                  </span>
                </li>
              );
            }

            return (
              <li key={locale} role="presentation">
                <Link
                  role="option"
                  aria-selected="false"
                  href={`/${locale}${rest}`}
                  hrefLang={locale}
                  lang={locale}
                  onClick={() => setOpen(false)}
                  className={`${className} hover:bg-neutral-100`}
                >
                  <Flag locale={locale} />
                  {localeLabels[locale]}
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

const flags: Record<Locale, string> = {
  en: "🇬🇧",
  de: "🇩🇪",
  fr: "🇫🇷",
};

function Flag({ locale }: { locale: Locale }) {
  return (
    <span
      aria-hidden="true"
      className="text-[1.05rem] leading-none"
      style={{ fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", sans-serif' }}
    >
      {flags[locale]}
    </span>
  );
}
