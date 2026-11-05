"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

const latitude = 49.5828408;
const longitude = 6.1250869;

export function LocationMap() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let map: import("leaflet").Map | undefined;
    let cancelled = false;

    import("leaflet").then((L) => {
      if (cancelled || !containerRef.current) return;

      map = L.map(containerRef.current, {
        scrollWheelZoom: false,
        zoomControl: true,
      }).setView([latitude, longitude], 16);

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 20,
        },
      ).addTo(map);

      const icon = L.divIcon({
        className: "",
        iconSize: [22, 22],
        iconAnchor: [11, 11],
        html: `<span style="display:block;width:22px;height:22px;border-radius:9999px;background:#1d6a8a;border:3px solid #fff;box-shadow:0 0 0 7px rgba(29,106,138,0.22),0 2px 8px rgba(0,0,0,0.2)"></span>`,
      });

      L.marker([latitude, longitude], { icon, keyboard: false })
        .addTo(map)
        .bindPopup(
          "<strong>Sky12</strong><br />T1-12-05 · Cloche d'Or",
        )
        .openPopup();
    });

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="z-0 h-[480px] w-full"
      role="img"
      aria-label="Map of Sky12 at the Cloche d'Or shopping centre"
    />
  );
}
