export type Ad = {
  id: string;
  name: string;
  headline: string;
  description: string;
  imageUrl?: string;
  destinationUrl: string;
  buttonLabel: string;
  active: boolean;
  weight: number;
  createdAt: string;
};

export type Site = {
  id: string;
  name: string;
  domain: string;
  active: boolean;
  createdAt: string;
};

export type MetricEvent = {
  type: "impression" | "click";
  siteId: string;
  adId: string;
  placement?: string;
  createdAt: string;
};

type Store = {
  ads: Ad[];
  sites: Site[];
  events: MetricEvent[];
};

declare global {
  // eslint-disable-next-line no-var
  var __mAdsStore: Store | undefined;
}

const seed: Store = {
  ads: [
    {
      id: "ad_demo_mads",
      name: "M Ads Demo",
      headline: "A calmer kind of advertising.",
      description: "Privacy-first, all-ages ads without behavioral profiling.",
      destinationUrl: "/",
      buttonLabel: "Learn more",
      active: true,
      weight: 100,
      createdAt: new Date().toISOString(),
    },
  ],
  sites: [
    {
      id: "site_demo",
      name: "Demo site",
      domain: "localhost",
      active: true,
      createdAt: new Date().toISOString(),
    },
  ],
  events: [],
};

export function getStore(): Store {
  if (!global.__mAdsStore) global.__mAdsStore = structuredClone(seed);
  return global.__mAdsStore;
}

export function makeId(prefix: string) {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`;
}

export function chooseAd(ads: Ad[]): Ad | null {
  const active = ads.filter((ad) => ad.active && ad.weight > 0);
  if (!active.length) return null;

  const total = active.reduce((sum, ad) => sum + ad.weight, 0);
  let pick = Math.random() * total;
  for (const ad of active) {
    pick -= ad.weight;
    if (pick <= 0) return ad;
  }
  return active[active.length - 1];
}
