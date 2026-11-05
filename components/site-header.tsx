"use client";

import { useEffect, useState } from "react";
import { NavIcon, type NavIconName } from "@/components/nav-icon";
import { Wordmark } from "@/components/wordmark";

const links = [
  ["photos", "#photos"],
  ["wellness", "#wellness"],
  ["transport", "#transport"],
  ["map", "#location"],
] as const;

export function SiteHeader({
  nav,
}: {
  nav: {
    photos: string;
    wellness: string;
    transport: string;
    map: string;
    enquire: string;
  };
}) {
  const [banner, setBanner] = useState(false);

  useEffect(() => {
    const onScroll = () => setBanner(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 ${banner ? "bg-transparent px-4 pt-3 sm:px-6" : "border-b border-line bg-white"}`}
    >
      <div
        className={
          banner
            ? "mx-auto flex h-14 max-w-[1120px] items-center justify-between rounded-full border border-line bg-white px-4 shadow-[0_8px_24px_rgba(34,34,34,0.08)] sm:px-5"
            : "mx-auto flex h-[72px] max-w-[1120px] items-center justify-between px-6"
        }
      >
        <a href="#top" className="text-[17px]">
          <Wordmark />
        </a>
        {banner ? null : (
          <nav className="flex items-center gap-1 text-sm font-medium md:gap-6">
            {links.map(([name, href]) => (
              <a
                key={name}
                href={href}
                className="inline-flex items-center gap-1.5 rounded-lg p-2 hover:bg-neutral-100 md:px-0 md:hover:bg-transparent md:hover:underline"
              >
                <NavIcon name={name satisfies NavIconName} />
                <span className="sr-only md:not-sr-only">{nav[name]}</span>
              </a>
            ))}
          </nav>
        )}
        <a
          href="#enquire"
          className="inline-flex items-center gap-1.5 rounded-full bg-neutral-950 px-4 py-2 text-sm font-medium text-white"
        >
          <NavIcon name="enquire" />
          {nav.enquire}
        </a>
      </div>
    </header>
  );
}
