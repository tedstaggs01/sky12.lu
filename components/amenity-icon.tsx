import type { ReactNode } from "react";

const iconProps = {
  viewBox: "0 0 24 24",
  "aria-hidden": true,
  className: "h-6 w-6 shrink-0",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function AmenityIcon({ name }: { name: AmenityIconName }) {
  const paths = icons[name];

  return (
    <svg {...iconProps}>
      {paths}
    </svg>
  );
}

export type AmenityIconName =
  | "view"
  | "pool"
  | "sauna"
  | "fitness"
  | "tram"
  | "shops";

const icons: Record<AmenityIconName, ReactNode> = {
  view: (
    <>
      <path d="M3 20h18" />
      <path d="M5 20V11h3.5v9" />
      <path d="M10.5 20V7H15v13" />
      <path d="M17 20v-6h3v6" />
      <circle cx="18.5" cy="6" r="1.25" fill="currentColor" stroke="none" />
    </>
  ),
  pool: (
    <>
      <path d="M3 8c1.6 1.2 2.6 1.2 4 0s2.4-1.2 4 0 2.4 1.2 4 0 2.4-1.2 4 0 2.4 1.2 4 0" />
      <path d="M3 13c1.6 1.2 2.6 1.2 4 0s2.4-1.2 4 0 2.4 1.2 4 0 2.4-1.2 4 0 2.4 1.2 4 0" />
      <path d="M3 18c1.6 1.2 2.6 1.2 4 0s2.4-1.2 4 0 2.4 1.2 4 0 2.4-1.2 4 0 2.4 1.2 4 0" />
    </>
  ),
  sauna: (
    <>
      <path d="M4 19h16" />
      <path d="M7 19v-2.5h10V19" />
      <path d="M8 12.5c.6-1.2.6-1.8 0-3S7.4 7.7 8 6.5" />
      <path d="M12 12.5c.6-1.2.6-1.8 0-3s-.6-1.8 0-3" />
      <path d="M16 12.5c.6-1.2.6-1.8 0-3s-.6-1.8 0-3" />
    </>
  ),
  fitness: (
    <>
      <path d="M6 9v6" />
      <path d="M8.5 7v10" />
      <path d="M8.5 12h7" />
      <path d="M15.5 7v10" />
      <path d="M18 9v6" />
    </>
  ),
  tram: (
    <>
      <path d="M12 3V1.5" />
      <path d="M8 3h8" />
      <rect x="5" y="3" width="14" height="14" rx="2" />
      <path d="M5 11h14" />
      <path d="M8 19.5 6.5 22" />
      <path d="M16 19.5 17.5 22" />
      <circle cx="8.5" cy="14.5" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="14.5" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  shops: (
    <>
      <path d="M4 9 6.2 4.5h11.6L20 9" />
      <path d="M4 9h16" />
      <path d="M5 9v10h14V9" />
      <path d="M10 19v-5h4v5" />
      <path d="M4 9c.4 1.3 1.4 2 2.6 2 1.4 0 2-.8 2.7-2" />
      <path d="M9.3 9c.5 1.2 1.4 2 2.7 2s2.2-.8 2.7-2" />
      <path d="M14.7 9c.7 1.2 1.3 2 2.7 2 1.2 0 2.2-.7 2.6-2" />
    </>
  ),
};
