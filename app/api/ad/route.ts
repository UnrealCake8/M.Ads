import { NextRequest, NextResponse } from "next/server";
import { chooseAd, getActiveSite, listAds } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const siteId = request.nextUrl.searchParams.get("site");
  const placement = request.nextUrl.searchParams.get("placement") || undefined;
  if (!siteId) return NextResponse.json({ error: "Missing site" }, { status: 400 });

  try {
    const site = await getActiveSite(siteId);
    if (!site) return NextResponse.json({ error: "Unknown or inactive site" }, { status: 404 });

    const ad = chooseAd(await listAds());
    if (!ad) return new NextResponse(null, { status: 204 });

    return NextResponse.json({
      ad: {
        id: ad.id,
        format: ad.format,
        headline: ad.headline,
        description: ad.description,
        imageUrl: ad.imageUrl,
        destinationUrl: ad.destinationUrl,
        buttonLabel: ad.buttonLabel,
        customHtml: ad.format === "custom" ? ad.customHtml : undefined,
        waitSeconds: ad.waitSeconds,
      },
      placement,
    }, {
      headers: { "Cache-Control": "no-store", "Access-Control-Allow-Origin": "*" },
    });
  } catch (error) {
    console.error("M Ads serving error", error);
    return NextResponse.json({ error: "Ad service unavailable" }, { status: 503 });
  }
}
