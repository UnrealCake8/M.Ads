export type AdFormat = "text" | "image" | "mixed" | "custom";

export type Ad = {
  id: string;
  name: string;
  headline: string;
  description: string;
  imageUrl?: string;
  destinationUrl: string;
  buttonLabel: string;
  format: AdFormat;
  customHtml?: string;
  waitSeconds: number;
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

type Row = Record<string, unknown>;

function config() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error("Missing Supabase server credentials");
  return { url: url.replace(/\/$/, ""), key };
}

async function rest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const { url, key } = config();
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", ...init.headers },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Supabase ${response.status}: ${await response.text()}`);
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

function adFromRow(row: Row): Ad {
  const rawFormat = String(row.format || "mixed");
  const format: AdFormat = ["text", "image", "mixed", "custom"].includes(rawFormat) ? rawFormat as AdFormat : "mixed";
  return {
    id: String(row.id), name: String(row.name), headline: String(row.headline || ""),
    description: String(row.description || ""), imageUrl: row.image_url ? String(row.image_url) : undefined,
    destinationUrl: String(row.destination_url || ""), buttonLabel: String(row.button_label || "Learn more"),
    format, customHtml: row.custom_html ? String(row.custom_html) : undefined,
    waitSeconds: Math.max(0, Math.min(30, Number(row.wait_seconds ?? 3))),
    active: Boolean(row.active), weight: Number(row.weight), createdAt: String(row.created_at),
  };
}

function siteFromRow(row: Row): Site {
  return { id: String(row.id), name: String(row.name), domain: String(row.domain), active: Boolean(row.active), createdAt: String(row.created_at) };
}

export async function listAds(): Promise<Ad[]> { return (await rest<Row[]>("mads_ads?select=*&deleted_at=is.null&order=created_at.desc")).map(adFromRow); }
export async function listSites(): Promise<Site[]> { return (await rest<Row[]>("mads_sites?select=*&order=created_at.desc")).map(siteFromRow); }
export async function getActiveSite(id: string): Promise<Site | null> {
  const rows = await rest<Row[]>(`mads_sites?select=*&id=eq.${encodeURIComponent(id)}&active=eq.true&limit=1`);
  return rows[0] ? siteFromRow(rows[0]) : null;
}
export async function getActiveAd(id: string): Promise<Ad | null> {
  const rows = await rest<Row[]>(`mads_ads?select=*&id=eq.${encodeURIComponent(id)}&active=eq.true&deleted_at=is.null&limit=1`);
  return rows[0] ? adFromRow(rows[0]) : null;
}

export async function createSite(input: { name: string; domain: string }): Promise<Site> {
  const rows = await rest<Row[]>("mads_sites", { method: "POST", headers: { Prefer: "return=representation" }, body: JSON.stringify({ ...input, active: true }) });
  return siteFromRow(rows[0]);
}

export async function createAd(input: Omit<Ad, "id" | "createdAt">): Promise<Ad> {
  const rows = await rest<Row[]>("mads_ads", {
    method: "POST", headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      name: input.name, headline: input.headline, description: input.description, image_url: input.imageUrl || null,
      destination_url: input.destinationUrl, button_label: input.buttonLabel, format: input.format,
      custom_html: input.customHtml || null, wait_seconds: input.waitSeconds, active: input.active, weight: input.weight,
    }),
  });
  return adFromRow(rows[0]);
}

export async function softDeleteAd(id: string) {
  await rest<void>(`mads_ads?id=eq.${encodeURIComponent(id)}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ active: false, deleted_at: new Date().toISOString() }) });
}

export async function recordEvent(event: Omit<MetricEvent, "createdAt">) {
  await rest<void>("mads_events", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ type: event.type, site_id: event.siteId, ad_id: event.adId, placement: event.placement || null }) });
}

export async function getMetrics() {
  const [impressions, clicks] = await Promise.all([rest<Row[]>("mads_events?select=id&type=eq.impression"), rest<Row[]>("mads_events?select=id&type=eq.click")]);
  return { impressions: impressions.length, clicks: clicks.length, ctr: impressions.length ? (clicks.length / impressions.length) * 100 : 0 };
}

export function chooseAd(ads: Ad[]): Ad | null {
  const active = ads.filter((ad) => ad.active && ad.weight > 0);
  if (!active.length) return null;
  const total = active.reduce((sum, ad) => sum + ad.weight, 0);
  let pick = Math.random() * total;
  for (const ad of active) { pick -= ad.weight; if (pick <= 0) return ad; }
  return active[active.length - 1];
}
