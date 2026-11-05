import { LanguageSelector } from "@/components/language-selector";
import { Wordmark } from "@/components/wordmark";
import type { Locale } from "@/lib/locale";
import { getMessages } from "@/lib/messages";
import { stay } from "@/lib/stay-details";

export function SiteFooter({
  locale,
  narrow = false,
}: {
  locale: Locale;
  narrow?: boolean;
}) {
  const t = getMessages(locale);

  return (
    <footer className="mt-auto px-4 pt-4 pb-4 sm:px-6 sm:pb-6">
      <div
        className={`mx-auto flex flex-col gap-6 rounded-3xl border border-line bg-white px-6 py-8 shadow-[0_8px_24px_rgba(34,34,34,0.04)] sm:px-10 sm:py-10 ${
          narrow ? "max-w-xl" : "max-w-[1120px]"
        }`}
      >
        <p
          className="text-[1.85rem] leading-tight text-foreground"
          style={{ fontFamily: 'var(--font-hand), "Apple Color Emoji", cursive' }}
        >
          {t.footer.note}
        </p>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[17px]">
            <Wordmark />
          </p>
          <a
            href={stay.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram, sky12.lu"
            className="mt-2 inline-flex items-center gap-2 text-sm text-muted hover:text-foreground"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
            sky12.lu
          </a>
          <p className="mt-1 text-sm text-muted">
            {stay.unit} · Cloche d&apos;Or, Luxembourg
          </p>
        </div>
        <div className="flex flex-col items-start gap-3 sm:items-end">
          <LanguageSelector label={t.footer.language} />
          <p className="text-sm text-muted">© 2026 sky12.lu. {t.footer.rights}</p>
        </div>
        </div>
      </div>
    </footer>
  );
}
