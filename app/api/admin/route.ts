import { NextRequest, NextResponse } from "next/server";
import { getStore, makeId } from "@/lib/store";

function authorized(request: NextRequest) {
  const configured = process.env.MADS_ADMIN_KEY;
  if (!configured) return process.env.NODE_ENV !== "production";
  return request.headers.get("x-mads-admin-key") === configured;
}

export async function GET() {
  const store = getStore();
  const impressions = store.events.filter((event) => event.type === "impression").length;
  const clicks = store.events.filter((event) => event.type === "click").length;
  return NextResponse.json({
    ads: store.ads,
    sites: store.sites,
    metrics: { impressions, clicks, ctr: impressions ? (clicks / impressions) * 100 : 0 },
  });
}

export async function POST(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => null);
  if (!body || !body.kind) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const store = getStore();
  if (body.kind === "site") {
    if (!body.name || !body.domain) return NextResponse.json({ error: "Name and domain are required" }, { status: 400 });
    const site = {
      id: makeId("site"),
      name: String(body.name).slice(0, 80),
      domain: String(body.domain).replace(/^https?:\/\//, "").replace(/\/$/, "").slice(0, 180),
      active: true,
      createdAt: new Date().toISOString(),
    };
    store.sites.push(site);
    return NextResponse.json({ site }, { status: 201 });
  }

  if (body.kind === "ad") {
    if (!body.name || !body.headline || !body.destinationUrl) return NextResponse.json({ error: "Name, headline and destination URL are required" }, { status: 400 });
    const ad = {
      id: makeId("ad"),
      name: String(body.name).slice(0, 80),
      headline: String(body.headline).slice(0, 120),
      description: String(body.description || "").slice(0, 240),
      imageUrl: body.imageUrl ? String(body.imageUrl).slice(0, 500) : undefined,
      destinationUrl: String(body.destinationUrl).slice(0, 500),
      buttonLabel: String(body.buttonLabel || "Learn more").slice(0, 40),
      active: true,
      weight: Math.max(1, Math.min(1000, Number(body.weight) || 100)),
      createdAt: new Date().toISOString(),
    };
    store.ads.push(ad);
    return NextResponse.json({ ad }, { status: 201 });
  }

  return NextResponse.json({ error: "Unsupported kind" }, { status: 400 });
}
