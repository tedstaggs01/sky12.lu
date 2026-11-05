import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HostCard } from "@/components/host-card";
import { ShoppingLink } from "@/components/shopping-link";
import { fill } from "@/lib/fill";
import { guideImage, guideSlugs } from "@/lib/guides";
import { hasLocale } from "@/lib/locale";
import { getMessages } from "@/lib/messages";
import { stay } from "@/lib/stay-details";

export const instant = false;

function telHref(phone: string) {
  return `tel:${phone.replace(/\s/g, "")}`;
}

function External({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-foreground underline"
    >
      {children}
    </a>
  );
}

async function load(params: Promise<{ lang: string }>) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return { lang, t: getMessages(lang) };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { t } = await load(params);
  return {
    title: t.meta.welcomeTitle,
    description: t.meta.welcomeDescription,
    robots: { index: false, follow: false },
  };
}

export default async function WelcomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await load(params);
  return <WelcomeDetails lang={lang} />;
}

async function WelcomeDetails({ lang }: { lang: "en" | "de" | "fr" }) {
  const t = getMessages(lang);
  const { phone, email, alternatePhone, name } = stay.host;
  const shopping = () => <ShoppingLink>{t.shoppingCentre}</ShoppingLink>;

  return (
      <main className="mx-auto w-full max-w-xl flex-1 px-6 py-10">
        <p className="text-sm text-muted">{t.welcome.place}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{t.welcome.title}</h1>
        <p className="mt-4 text-[16px] leading-7 text-muted">
          {fill(t.welcome.intro, { unit: stay.unit, shopping: shopping() })}
        </p>

        <section className="mt-8 text-[15px] leading-6">
          <p className="font-semibold">{t.welcome.rules.parties}</p>
          <p className="mt-2 text-muted">{t.welcome.rules.neighbours}</p>
          <p className="mt-3">
            {fill(t.welcome.rules.loss, {
              amount: <span className="font-semibold">75 EUR</span>,
            })}
          </p>
        </section>

        <p className="mt-8 rounded-2xl border border-line px-5 py-4 text-[15px] leading-6">
          {fill(t.welcome.parking, {
            auchan: (
              <span className="inline-flex items-center gap-1 font-medium">
                <svg
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                  className="h-3.5 w-3.5 text-[#1d6a8a]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                >
                  <rect x="1.2" y="1.2" width="13.6" height="13.6" rx="3" />
                  <path d="M6 12V4.2h3.1a2.5 2.5 0 0 1 0 5H6" />
                </svg>
                Auchan
              </span>
            ),
          })}
        </p>

        <nav className="mt-4 flex flex-col gap-3" aria-label={t.welcome.guidesLabel}>
          {guideSlugs.map((slug) => (
            <Link
              key={slug}
              href={`/${lang}/welcome/${slug}`}
              className="flex items-center gap-4 rounded-2xl border border-line bg-white p-3 pr-5 text-[17px] font-medium leading-6 shadow-[0_8px_24px_rgba(34,34,34,0.04)] transition-colors hover:border-[#1d6a8a]"
            >
              <Image
                src={guideImage[slug]}
                alt={t.welcome.guideAlt[slug]}
                width={768}
                height={1024}
                className="h-28 w-28 shrink-0 rounded-xl object-cover"
              />
              <span className="min-w-0 flex-1">{t.welcome.guides[slug]}</span>
              <svg
                viewBox="0 0 16 16"
                aria-hidden="true"
                className="h-4 w-4 shrink-0 text-muted"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M6 3.5 10.5 8 6 12.5" />
              </svg>
            </Link>
          ))}
        </nav>

        <section className="mt-12">
          <h2 className="text-xl font-semibold tracking-tight">{t.welcome.host}</h2>
          <HostCard name={name} role={t.pilot} turn={t.turnCard} turnBack={t.turnBack}>
            <p className="text-[15px] leading-6 text-muted">
              {fill(t.welcome.hostBio, {
                name,
                pilotflows: <External href="https://pilotflows.com">Pilotflows</External>,
                flight: <External href="https://flight.lu">flight.lu</External>,
              })}
            </p>
            <p className="mt-4 text-[15px] leading-6">
              {fill(t.welcome.contact, {
                phone: (
                  <a href={telHref(phone)} className="font-medium underline">
                    {phone}
                  </a>
                ),
                email: (
                  <a href={`mailto:${email}`} className="font-medium underline">
                    {email}
                  </a>
                ),
                alt: (
                  <a href={telHref(alternatePhone)} className="font-medium underline">
                    {alternatePhone}
                  </a>
                ),
              })}
            </p>
          </HostCard>
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-semibold tracking-tight">{t.welcome.emergencies}</h2>
          <p className="mt-2 text-[15px] leading-6 text-muted">{t.welcome.emergenciesIntro}</p>
          <ul className="mt-4 space-y-3 text-[15px] leading-6">
            <li className="flex items-baseline justify-between gap-4">
              <span>{t.welcome.ambulance}</span>
              <a href="tel:112" className="text-lg font-medium">
                112
              </a>
            </li>
            <li className="flex items-baseline justify-between gap-4">
              <span>{t.welcome.police}</span>
              <a href="tel:113" className="text-lg font-medium">
                113
              </a>
            </li>
            <li className="flex items-baseline justify-between gap-4">
              <span>{fill(t.welcome.yourHost, { name })}</span>
              <a href={telHref(phone)} className="text-lg font-medium">
                {phone}
              </a>
            </li>
            <li className="flex items-baseline justify-between gap-4">
              <span>{t.welcome.alternative}</span>
              <a href={telHref(alternatePhone)} className="text-lg font-medium">
                {alternatePhone}
              </a>
            </li>
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-semibold tracking-tight">{t.welcome.address}</h2>
          <p className="mt-4 text-[15px] leading-7">
            {t.welcome.addressLines.map((line) => (
              <span key={line} className="block">
                {fill(line, { shopping: shopping() })}
              </span>
            ))}
          </p>
        </section>
      </main>
  );
}
