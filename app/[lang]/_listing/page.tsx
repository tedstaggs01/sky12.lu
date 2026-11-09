import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { AmenityIcon, type AmenityIconName } from "@/components/amenity-icon";
import { HostCard } from "@/components/host-card";
import { ListingActions } from "@/components/listing-actions";
import { PhotoGallery, type Photo } from "@/components/photo-gallery";
import { ShoppingLink } from "@/components/shopping-link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StayCalendar } from "@/components/stay-calendar";
import { Wordmark } from "@/components/wordmark";
import { fill } from "@/lib/fill";
import { hasLocale } from "@/lib/locale";
import { getMessages } from "@/lib/messages";
import { stay } from "@/lib/stay-details";

const photoSrcs = [
  "/photos/living.jpg",
  "/photos/bedroom.jpg",
  "/photos/kitchen.jpg",
  "/photos/pool.jpg",
  "/photos/view-rainbow.jpg",
  "/photos/dining.jpg",
  "/photos/living-sofa.jpg",
  "/photos/living-tv.jpg",
  "/photos/sauna.jpg",
  "/photos/gym.jpg",
  "/photos/gym-bikes.jpg",
  "/photos/view-day.jpg",
  "/photos/view-sunset.jpg",
  "/photos/view-dusk.jpg",
  "/photos/view-night.jpg",
  "/photos/balcony.jpg",
  "/photos/panorama.jpg",
  "/photos/building.jpg",
];

const amenityIcons: AmenityIconName[] = [
  "view",
  "pool",
  "sauna",
  "fitness",
  "tram",
  "shops",
];

const wellnessSrcs = ["/photos/pool.jpg", "/photos/sauna.jpg", "/photos/gym.jpg"];

const busLines = ["4", "6", "13", "16", "18", "21", "23", "25", "CN2", "81", "82", "86", "88"];

const airbnbUrl = "https://www.airbnb.com/rooms/1800646706730982087";
const bookingUrl =
  "https://www.booking.com/hotel/lu/12th-floor-luxury-appartment.en-gb.html";

export const instant = false;

function StayLink({
  href,
  mark,
  markClass,
  label,
  block = false,
}: {
  href: string;
  mark: string;
  markClass: string;
  label: string;
  block?: boolean;
}) {
  const className = block
    ? "mt-3 flex h-12 items-center justify-center gap-2 rounded-lg border border-line text-sm font-medium"
    : "inline-flex items-center gap-2 text-sm font-medium";
  const badge = block
    ? `inline-flex h-5 items-center rounded px-1.5 text-[12px] font-semibold text-white ${markClass}`
    : `inline-flex h-6 items-center rounded-md px-2 text-[13px] font-semibold tracking-tight text-white ${markClass}`;
  const inner = (
    <>
      <span className={badge}>{mark}</span>
      {label}
    </>
  );

  if (!href) {
    return <span className={className}>{inner}</span>;
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {inner}
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
  return { title: t.meta.title, description: t.meta.description };
}

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang, t } = await load(params);
  const photos: Photo[] = photoSrcs.map((src, index) => ({
    src,
    alt: t.photoAlts[index],
  }));
  const shopping = () => <ShoppingLink>{t.shoppingCentre}</ShoppingLink>;
  const phoneHref = `tel:${stay.host.phone.replace(/\s/g, "")}`;

  return (
    <div className="flex flex-1 flex-col bg-white text-foreground">
      <SiteHeader nav={t.nav} />

      <main id="top">
        <section id="photos" className="mx-auto max-w-[1120px] scroll-mt-24 px-6 pt-6">
          <PhotoGallery photos={photos} labels={t.gallery} />
        </section>

        <section className="mx-auto mt-8 grid max-w-[1120px] gap-12 px-6 pb-16 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-muted">
                  {t.newListing} · {stay.unit}
                </p>
                <h1 className="mt-1 text-[26px] leading-tight font-semibold tracking-tight sm:text-[32px]">
                  <Wordmark className="text-[1em]" />
                </h1>
                <p className="mt-2 max-w-xl text-[16px] leading-7">{t.tagline}</p>
                <p className="mt-2 text-muted">{t.unitLine}</p>
                <p className="mt-1 text-[15px]">{t.summary}</p>
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                  <StayLink
                    href={airbnbUrl}
                    mark="Airbnb"
                    markClass="bg-[#ff5a5f]"
                    label={t.alsoOn.replace("{name}", "Airbnb")}
                  />
                  <StayLink
                    href={bookingUrl}
                    mark="Booking.com"
                    markClass="bg-[#003580]"
                    label={t.alsoOn.replace("{name}", "Booking.com")}
                  />
                </div>
              </div>
              <ListingActions labels={t.actions} />
            </div>

            <div className="mt-8 flex items-center gap-4 border-y border-line py-6">
              <div className="relative h-14 w-14 overflow-hidden rounded-full">
                <Image
                  src="/photos/host.jpg"
                  alt="Ted"
                  fill
                  className="object-cover object-[center_22%]"
                  sizes="56px"
                />
              </div>
              <div>
                <p className="font-medium">{t.hostedBy}</p>
              </div>
            </div>

            <div id="highlights" className="scroll-mt-24 divide-y divide-line">
              {t.highlights.map((item) => (
                <article key={item.title} className="py-6">
                  <h2 className="font-medium">{item.title}</h2>
                  <p className="mt-1 max-w-xl text-[15px] leading-6 text-muted">
                    {fill(item.body, { shopping: shopping() })}
                  </p>
                </article>
              ))}
            </div>

            <div className="border-t border-line py-8">
              <h2 className="text-xl font-semibold tracking-tight">{t.aboutTitle}</h2>
              <p className="mt-4 max-w-2xl text-[16px] leading-7">
                {fill(t.about, { shopping: shopping() })}
              </p>
            </div>

            <div className="border-t border-line py-8">
              <h2 className="text-xl font-semibold tracking-tight">{t.offers}</h2>
              <ul className="mt-6 grid gap-5 sm:grid-cols-2">
                {t.amenities.map((label, index) => (
                  <li key={label} className="flex items-center gap-4 text-[15px]">
                    <AmenityIcon name={amenityIcons[index]} />
                    {label}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-line py-8">
              <h2 className="text-xl font-semibold tracking-tight">{t.whereTitle}</h2>
              <p className="mt-2 font-medium">{fill(t.whereLine, { unit: stay.unit })}</p>
              <p className="mt-2 max-w-xl text-[15px] leading-6 text-muted">
                {fill(t.whereBody, { shopping: shopping(), unit: stay.unit })}
              </p>
              <a href="#location" className="mt-3 inline-block text-sm font-medium underline">
                {t.viewMap}
              </a>
            </div>

            <div id="host" className="scroll-mt-24 border-t border-line py-8">
              <h2 className="text-xl font-semibold tracking-tight">{t.aboutHost}</h2>
              <div className="max-w-xl">
                <HostCard
                  name={stay.host.name}
                  role=""
                  turn={t.turnCard}
                  turnBack={t.turnBack}
                >
                  <p className="text-[15px] leading-6 text-muted">{t.hostBio}</p>
                </HostCard>
              </div>
            </div>
          </div>

          <aside
            id="enquire"
            className="h-fit scroll-mt-24 rounded-2xl border border-line bg-white p-6 shadow-[0_6px_16px_rgba(0,0,0,0.08)] lg:sticky lg:top-24 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto"
          >
            <StayCalendar
              locale={lang}
              price={stay.nightlyPrice}
              currency={stay.currency}
              phone={stay.host.phone}
              enquireLabel={t.enquireTed}
              labels={t.calendar}
              apiUrl={process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:3001"}
            />
            <p className="mt-4 text-sm text-muted">{fill(t.floorLine, { unit: stay.unit })}</p>
            <dl className="mt-4 grid grid-cols-2 gap-y-4 border-t border-line pt-4">
              {t.facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="text-sm text-muted">{fact.label}</dt>
                  <dd className="mt-0.5 font-medium">{fact.value}</dd>
                </div>
              ))}
            </dl>
            <StayLink
              href={airbnbUrl}
              mark="Airbnb"
              markClass="bg-[#ff5a5f]"
              label={t.viewListing}
              block
            />
            <StayLink
              href={bookingUrl}
              mark="Booking.com"
              markClass="bg-[#003580]"
              label={t.viewListing}
              block
            />
            <p className="mt-4 text-center text-xs leading-5 text-muted">{t.enquireNote}</p>
          </aside>
        </section>

        <section id="direct" className="scroll-mt-20 border-t border-line">
          <div className="mx-auto max-w-[1120px] px-6 py-16 md:py-24">
            <h2 className="text-3xl font-semibold tracking-tight">{t.direct.title}</h2>
            <p className="mt-4 max-w-2xl text-[16px] leading-7 text-muted">{t.direct.intro}</p>
            <ul className="mt-10 grid gap-8 md:grid-cols-3">
              <li>
                <h3 className="font-medium">{t.direct.feesTitle}</h3>
                <p className="mt-2 text-[15px] leading-6 text-muted">{t.direct.fees}</p>
              </li>
              <li>
                <h3 className="font-medium">{t.direct.lineTitle}</h3>
                <p className="mt-2 text-[15px] leading-6 text-muted">
                  {fill(t.direct.line, {
                    phone: (
                      <a href={phoneHref} className="font-medium text-foreground underline">
                        {stay.host.phone}
                      </a>
                    ),
                  })}
                </p>
              </li>
              <li>
                <h3 className="font-medium">{t.direct.sameTitle}</h3>
                <p className="mt-2 text-[15px] leading-6 text-muted">{t.direct.same}</p>
              </li>
            </ul>
            <a
              href={phoneHref}
              className="mt-10 inline-flex h-12 items-center rounded-lg bg-neutral-950 px-5 text-sm font-medium text-white"
            >
              {t.enquireTed}
            </a>
          </div>
        </section>

        <section className="border-t border-line">
          <div className="mx-auto grid max-w-[1120px] items-center gap-10 px-6 py-16 md:grid-cols-2 md:py-24">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/photos/view-rainbow.jpg"
                alt={t.viewAlt}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </div>
            <div className="md:px-6">
              <p className="text-sm text-muted">{t.viewEyebrow}</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">{t.viewTitle}</h2>
              <p className="mt-4 max-w-md text-[16px] leading-7 text-muted">{t.viewBody}</p>
            </div>
          </div>
        </section>

        <section id="wellness" className="scroll-mt-20 border-t border-line">
          <div className="mx-auto max-w-[1120px] px-6 py-16 md:py-24">
            <p className="text-sm text-muted">{t.wellnessEyebrow}</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">{t.wellnessTitle}</h2>
            <p className="mt-4 max-w-xl text-[16px] leading-7 text-muted">{t.wellnessIntro}</p>
            <div className="mt-10 grid gap-8 sm:grid-cols-3">
              {t.wellness.map((item, index) => (
                <article key={item.title}>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                    <Image
                      src={wellnessSrcs[index]}
                      alt={item.alt}
                      fill
                      className="object-cover"
                      sizes="(min-width: 640px) 33vw, 100vw"
                    />
                  </div>
                  <h3 className="mt-4 font-medium">{item.title}</h3>
                  <p className="mt-1 text-[15px] leading-6 text-muted">{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="transport" className="scroll-mt-20 border-t border-line">
          <div className="mx-auto max-w-[1120px] px-6 py-16 md:py-24">
            <p className="text-sm text-muted">{t.transportEyebrow}</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">{t.transportTitle}</h2>
            <p className="mt-4 max-w-xl text-[16px] leading-7 text-muted">{t.transportIntro}</p>
            <div className="mt-10 grid gap-10 md:grid-cols-2">
              <article className="border-t border-line pt-6">
                <h3 className="text-xl font-semibold tracking-tight">{t.tram}</h3>
                <p className="mt-1 text-sm text-muted">{t.tramLine}</p>
                <p className="mt-4 text-[15px] leading-6 text-muted">{t.tramBody}</p>
              </article>
              <article className="border-t border-line pt-6">
                <h3 className="text-xl font-semibold tracking-tight">{t.bus}</h3>
                <p className="mt-1 text-sm text-muted">{t.busStops}</p>
                <p className="mt-4 text-[15px] leading-6 text-muted">{t.busBody}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {busLines.map((line) => (
                    <li
                      key={line}
                      className="rounded-full border border-line px-3 py-1 text-sm font-medium"
                    >
                      {line}
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          </div>
        </section>

        <section id="location" className="scroll-mt-20 border-t border-line">
          <div className="mx-auto max-w-[1120px] px-6 py-16 md:py-24">
            <p className="text-sm text-muted">{t.mapPlace}</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">{t.mapTitle}</h2>
            <p className="mt-4 max-w-xl text-[16px] leading-7 text-muted">
              {fill(t.mapBody, { shopping: shopping() })}
            </p>
            <div className="mt-8 overflow-hidden rounded-2xl border border-line">
              <iframe
                title={t.mapFrame}
                src="https://www.openstreetmap.org/export/embed.html?bbox=6.108%2C49.572%2C6.142%2C49.594&layer=mapnik&marker=49.5828408%2C6.1250869"
                className="h-[420px] w-full"
                loading="lazy"
              />
            </div>
            <a
              href="https://www.openstreetmap.org/?mlat=49.5828408&mlon=6.1250869#map=16/49.5828/6.1251"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-sm font-medium underline"
            >
              {t.openMap}
            </a>
          </div>
        </section>
      </main>

      <SiteFooter locale={lang} />
    </div>
  );
}
