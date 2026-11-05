import type { ReactNode } from "react";

const iconProps = {
  viewBox: "0 0 24 24",
  "aria-hidden": true,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export type NavIconName = "photos" | "wellness" | "transport" | "map" | "enquire";

export function NavIcon({
  name,
  className = "h-4 w-4 shrink-0",
}: {
  name: NavIconName;
  className?: string;
}) {
  return (
    <svg {...iconProps} className={className}>
      {icons[name]}
    </svg>
  );
}

const icons: Record<NavIconName, ReactNode> = {
  photos: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="8.5" cy="10" r="1.3" fill="currentColor" stroke="none" />
      <path d="m3 16 5-4 3.5 3L14 13l7 5" />
    </>
  ),
  wellness: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M7.5 13.2c1.1.8 1.7.8 2.6 0s1.5-.8 2.6 0 1.5.8 2.6 0" />
    </>
  ),
  transport: (
    <>
      <path d="M12 3.5V2" />
      <path d="M8.5 3.5h7" />
      <rect x="5" y="3.5" width="14" height="13" rx="2" />
      <path d="M5 10.5h14" />
      <path d="m8 18.5-1.5 2.5" />
      <path d="m16 18.5 1.5 2.5" />
    </>
  ),
  map: (
    <>
      <path d="M12 21s6.5-5.6 6.5-10.2a6.5 6.5 0 1 0-13 0C5.5 15.4 12 21 12 21Z" />
      <circle cx="12" cy="10.8" r="2" />
    </>
  ),
  enquire: (
    <>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3.5v3.5" />
      <path d="M16 3.5v3.5" />
      <path d="M4 10h16" />
    </>
  ),
};
