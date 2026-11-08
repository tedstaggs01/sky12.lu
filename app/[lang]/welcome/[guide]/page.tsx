import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { SavePdf } from "@/components/save-pdf";
import { fill } from "@/lib/fill";
import { guideSlugs, isGuide } from "@/lib/guides";
import { hasLocale, type Locale } from "@/lib/locale";
import { getMessages } from "@/lib/messages";
import { stay } from "@/lib/stay-details";
import { welcomeCode } from "@/lib/welcome-gate";

export function generateStaticParams() {
  return guideSlugs.map((guide) => ({ guide }));
}

export const instant = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; guide: string }>;
}): Promise<Metadata> {
  const { lang, guide } = await params;
  if (!hasLocale(lang) || !isGuide(guide)) return {};
  const t = getMessages(lang);
  return {
    title: `${t.welcome.guides[guide]} — Sky12`,
    robots: { index: false, follow: false },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ lang: string; guide: string }>;
}) {
  const { lang, guide } = await params;
  if (!hasLocale(lang) || !isGuide(guide)) notFound();
  const t = getMessages(lang);
  const keyCode = await welcomeCode();
  if (!keyCode) notFound();

  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-6 py-10">
      <Link
        href={`/${lang}/welcome`}
        className="text-sm font-medium text-muted hover:text-foreground print:hidden"
      >
        ← {t.welcome.guidesBack}
      </Link>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight">{t.welcome.guides[guide]}</h1>
      {guide === "apartment" ? (
        <Arrival lang={lang} keyCode={keyCode} />
      ) : guide === "wellness" ? (
        <Pool lang={lang} />
      ) : guide === "auchan" ? (
        <Auchan lang={lang} />
      ) : guide === "checkout" ? (
        <Checkout lang={lang} keyCode={keyCode} />
      ) : (
        <p className="mt-4 text-[16px] leading-7 text-muted">{t.welcome.guidesSoon}</p>
      )}
    </main>
  );
}

function Mark({ children }: { children: ReactNode }) {
  return <span className="font-medium tracking-wide">{children}</span>;
}

function Code({ children }: { children: ReactNode }) {
  return (
    <span className="code-chip mx-0.5 inline-block rounded-md bg-[#e7f3f7] px-2 py-0.5 align-baseline text-[1.05em] font-semibold tracking-[0.16em] text-[#1d6a8a]">
      {children}
    </span>
  );
}

function Arrival({ lang, keyCode }: { lang: Locale; keyCode: string }) {
  const t = getMessages(lang);
  const arrival = t.welcome.arrival;
  const { phone, email } = stay.host;
  const entree = <Mark>{arrival.entree}</Mark>;
  const steps: GuideStep[] = [
    {
      body: fill(arrival.park, {
        place: (
          <a
            href={stay.auchanUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline"
          >
            {t.shoppingCentre}
          </a>
        ),
      }),
    },
    {
      body: arrival.exit,
      photos: [
        shot("/photos/exit-1.jpg", 686, 1024, arrival.exit1Alt, arrival.exit1),
        shot("/photos/exit-2.jpg", 1024, 771, arrival.exit2Alt, arrival.exit2),
      ],
    },
    {
      body: fill(arrival.towers, {
        one: <Mark>{arrival.tower}</Mark>,
        two: <Mark>{arrival.other}</Mark>,
      }),
    },
    {
      body: fill(arrival.entrance, { tower: <Mark>{arrival.tower}</Mark> }),
      photos: [shot("/photos/tower-21.jpg", 755, 1024, arrival.towerAlt, arrival.towerCap)],
    },
    {
      body: fill(arrival.door, { entree, code: <Code>9371</Code> }),
      photos: [
        shot("/photos/door-pad.jpg", 768, 1024, arrival.padAlt, arrival.tapCap),
        shot("/photos/door-code.jpg", 768, 1024, arrival.codeAlt, arrival.codeCap),
      ],
    },
    {
      body: arrival.lifts,
      photos: [shot("/photos/elevator.jpg", 768, 1024, arrival.liftAlt, arrival.liftCap)],
    },
    {
      body: fill(arrival.lift, { entree, code: <Code>2607</Code>, floor: <Mark>12</Mark> }),
      photos: [
        shot("/photos/elevator-pad.jpg", 768, 1024, arrival.liftPadAlt, arrival.tapCap),
        shot("/photos/elevator-code.jpg", 768, 1024, arrival.liftCodeAlt, arrival.codeCap),
        shot("/photos/elevator-floor.jpg", 768, 1024, arrival.floorAlt, arrival.floorCap),
      ],
    },
    {
      body: fill(arrival.hall, { unit: <Mark>12.05</Mark> }),
      photos: [shot("/photos/hallway.jpg", 768, 1024, arrival.hallAlt, arrival.hallCap)],
    },
    {
      body: (
        <>
          {fill(arrival.box, { code: <Code>{keyCode}</Code> })}{" "}
          {fill(arrival.uses, {
            key: <Mark>{arrival.key}</Mark>,
            badge: <Mark>{arrival.badge}</Mark>,
            card: <Mark>{arrival.card}</Mark>,
          })}
        </>
      ),
      photos: [
        shot("/photos/key-box.jpg", 768, 1024, arrival.lockAlt, arrival.lockCap),
        shot("/photos/key-inside.jpg", 768, 1024, arrival.insideAlt, arrival.insideCap),
        shot("/photos/key-set.jpg", 768, 1024, arrival.itemsAlt, arrival.itemsCap),
      ],
    },
    {
      body: fill(arrival.checkout, { code: <Code>{keyCode}</Code> }),
    },
  ];

  return (
    <div className="guide-sheet">
      <SavePdf label={t.welcome.savePdf} hint={t.welcome.savePdfHint} />
      <Image
        src="/photos/arrival.jpg"
        alt={arrival.alt}
        width={1024}
        height={922}
        loading="eager"
        className="mt-8 h-auto w-full rounded-2xl border border-line"
        sizes="(min-width: 576px) 576px, 100vw"
      />
      <Steps steps={steps} />
      <p className="mt-10 text-[16px] leading-7">
        {fill(arrival.thanks, {
          phone: (
            <a href={`tel:${phone.replace(/\s/g, "")}`} className="font-medium underline">
              {phone}
            </a>
          ),
          email: (
            <a href={`mailto:${email}`} className="font-medium underline">
              {email}
            </a>
          ),
        })}
      </p>
    </div>
  );
}

function Pool({ lang }: { lang: Locale }) {
  const t = getMessages(lang);
  const pool = t.welcome.poolGuide;
  const steps: GuideStep[] = [
    { body: pool.lock },
    {
      body: fill(pool.level, { floor: <Code>T</Code> }),
      photos: [
        shot("/photos/elevator-t.jpg", 768, 1024, pool.pressAlt, pool.pressCap),
        shot("/photos/transition.jpg", 768, 1024, pool.signAlt, pool.signCap),
      ],
    },
    {
      body: pool.side,
      photos: [shot("/photos/transition-hall.jpg", 768, 1024, pool.linkAlt, pool.linkCap)],
    },
    {
      body: fill(pool.door, { badge: <Mark>{pool.badge}</Mark> }),
      photos: [
        shot("/photos/pool-hall.jpg", 768, 1024, pool.poolAlt, pool.poolCap),
        shot("/photos/token.jpg", 768, 1024, pool.tokenAlt, pool.tokenCap),
      ],
    },
  ];

  return (
    <div className="guide-sheet">
      <SavePdf label={t.welcome.savePdf} hint={t.welcome.savePdfHint} />
      <Steps steps={steps} />
      <section className="mt-10 border-t border-line pt-8">
        <h2 className="text-xl font-semibold tracking-tight">{pool.rulesTitle}</h2>
        <ul className="mt-4 space-y-2 text-[16px] leading-7">
          {pool.rules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Auchan({ lang }: { lang: Locale }) {
  const t = getMessages(lang);
  const auchan = t.welcome.auchanGuide;
  const steps: GuideStep[] = [
    {
      body: fill(auchan.level, { floor: <Code>A</Code> }),
      photos: [shot("/photos/elevator-a.jpg", 768, 1024, auchan.pressAlt, auchan.pressCap)],
    },
    {
      body: fill(auchan.doors, { key: <Mark>{auchan.key}</Mark> }),
      photos: [shot("/photos/auchan-door.jpg", 768, 1024, auchan.doorAlt, auchan.doorCap)],
    },
    { body: auchan.back },
  ];

  return (
    <div className="guide-sheet">
      <SavePdf label={t.welcome.savePdf} hint={t.welcome.savePdfHint} />
      <Steps steps={steps} />
    </div>
  );
}

function Checkout({ lang, keyCode }: { lang: Locale; keyCode: string }) {
  const t = getMessages(lang);
  const checkout = t.welcome.checkoutGuide;
  const steps: GuideStep[] = [
    { body: checkout.found },
    { body: fill(checkout.time, { time: <Code>11:00</Code> }) },
    {
      body: fill(checkout.box, { code: <Code>{keyCode}</Code> }),
      photos: [shot("/photos/key-inside.jpg", 768, 1024, checkout.boxAlt, checkout.boxCap)],
    },
    { body: fill(checkout.fee, { amount: <Mark>75 EUR</Mark> }) },
  ];

  return (
    <div className="guide-sheet">
      <SavePdf label={t.welcome.savePdf} hint={t.welcome.savePdfHint} />
      <Steps steps={steps} />
      <section className="mt-10 border-t border-line pt-8">
        <h2 className="text-xl font-semibold tracking-tight">{checkout.reviewTitle}</h2>
        <p className="mt-4 text-[16px] leading-7">{checkout.review}</p>
        <div className="mt-4 flex flex-col gap-3">
          <a
            href={stay.airbnbUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline"
          >
            {checkout.airbnb}
          </a>
          <a
            href={stay.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline"
          >
            {checkout.booking}
          </a>
        </div>
        <p className="mt-4 text-[16px] leading-7">{checkout.book}</p>
      </section>
    </div>
  );
}

function Steps({ steps }: { steps: GuideStep[] }) {
  return (
    <ol className="mt-8 space-y-8">
      {steps.map((step, index) => (
        <li key={index}>
          <div className="flex gap-4 text-[16px] leading-7">
            <span className="step-index mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1d6a8a] text-sm font-medium text-white">
              {index + 1}
            </span>
            <span>{step.body}</span>
          </div>
          {step.photos ? (
            <div className="mt-4 space-y-4">
              {step.photos.map((photo) => (
                <figure key={photo.src}>
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    loading="eager"
                    className="h-auto w-full rounded-2xl border border-line"
                    sizes="(min-width: 576px) 576px, 100vw"
                  />
                  <figcaption className="mt-2 text-sm font-medium">{photo.caption}</figcaption>
                </figure>
              ))}
            </div>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

type GuidePhoto = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
};

type GuideStep = {
  body: ReactNode;
  photos?: GuidePhoto[];
};

function shot(src: string, width: number, height: number, alt: string, caption: string): GuidePhoto {
  return { src, width, height, alt, caption };
}
