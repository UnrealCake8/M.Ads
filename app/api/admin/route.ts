import { NextRequest, NextResponse } from "next/server";
import { createAd, createSite, getMetrics, listAds, listSites } from "@/lib/db";

function authorized(request: NextRequest) {
  const configured = process.env.MADS_ADMIN_KEY;
  if (!configured) return process.env.NODE_ENV !== "production";
  return request.headers.get("x-mads-admin-key") === configured;
}

export async function GET(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const [ads, sites, metrics] = await Promise.all([listAds(), listSites(), getMetrics()]);
    return NextResponse.json({ ads, sites, metrics });
  } catch (error) {
    console.error("M Ads admin read error", error);
    return NextResponse.json({ error: "Admin data unavailable" }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => null);
  if (!body || !body.kind) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  try {
    if (body.kind === "site") {
      if (!body.name || !body.domain) return NextResponse.json({ error: "Name and domain are required" }, { status: 400 });
      const site = await createSite({
        name: String(body.name).slice(0, 80),
        domain: String(body.domain).replace(/^https?:\/\//, "").replace(/\/$/, "").slice(0, 180),
      });
      return NextResponse.json({ site }, { status: 201 });
    }

    if (body.kind === "ad") {
      if (!body.name || !body.headline || !body.destinationUrl) return NextResponse.json({ error: "Name, headline and destination URL are required" }, { status: 400 });
      const ad = await createAd({
        name: String(body.name).slice(0, 80),
        headline: String(body.headline).slice(0, 120),
        description: String(body.description || "").slice(0, 240),
        imageUrl: body.imageUrl ? String(body.imageUrl).slice(0, 500) : undefined,
        destinationUrl: String(body.destinationUrl).slice(0, 500),
        buttonLabel: String(body.buttonLabel || "Learn more").slice(0, 40),
        active: true,
        weight: Math.max(1, Math.min(1000, Number(body.weight) || 100)),
      });
      return NextResponse.json({ ad }, { status: 201 });
    }

    return NextResponse.json({ error: "Unsupported kind" }, { status: 400 });
  } catch (error) {
    console.error("M Ads admin write error", error);
    return NextResponse.json({ error: "Could not save data" }, { status: 503 });
  }
}
