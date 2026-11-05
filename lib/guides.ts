export const guideSlugs = ["apartment", "wellness", "auchan", "checkout"] as const;

export const guideImage: Record<GuideSlug, string> = {
  apartment: "/photos/tower-21.jpg",
  wellness: "/photos/pool.jpg",
  auchan: "/photos/auchan-door.jpg",
  checkout: "/photos/key-inside.jpg",
};

export type GuideSlug = (typeof guideSlugs)[number];

export function isGuide(value: string): value is GuideSlug {
  return guideSlugs.some((slug) => slug === value);
}
