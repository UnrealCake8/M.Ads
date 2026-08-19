import { NextRequest, NextResponse } from "next/server";
import { getActiveAd, getActiveSite, recordEvent } from "@/lib/db";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || !["impression", "click"].includes(body.type) || !body.siteId || !body.adId) {
    return NextResponse.json({ error: "Invalid event" }, { status: 400 });
  }

  try {
    const [site, ad] = await Promise.all([
      getActiveSite(String(body.siteId)),
      getActiveAd(String(body.adId)),
    ]);

    if (!site || !ad) return NextResponse.json({ error: "Unknown site or ad" }, { status: 404 });

    await recordEvent({
      type: body.type,
      siteId: String(body.siteId),
      adId: String(body.adId),
      placement: typeof body.placement === "string" ? body.placement.slice(0, 80) : undefined,
    });

    return NextResponse.json({ ok: true }, {
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  } catch (error) {
    console.error("M Ads event error", error);
    return NextResponse.json({ error: "Event service unavailable" }, { status: 503 });
  }
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
