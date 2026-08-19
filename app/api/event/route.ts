import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || !["impression", "click"].includes(body.type) || !body.siteId || !body.adId) {
    return NextResponse.json({ error: "Invalid event" }, { status: 400 });
  }

  const store = getStore();
  const site = store.sites.find((item) => item.id === body.siteId && item.active);
  const ad = store.ads.find((item) => item.id === body.adId && item.active);
  if (!site || !ad) return NextResponse.json({ error: "Unknown site or ad" }, { status: 404 });

  store.events.push({
    type: body.type,
    siteId: body.siteId,
    adId: body.adId,
    placement: typeof body.placement === "string" ? body.placement.slice(0, 80) : undefined,
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true }, {
    headers: { "Access-Control-Allow-Origin": "*" },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
