import { NextRequest, NextResponse } from "next/server";
import { chooseAd, getStore } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const siteId = request.nextUrl.searchParams.get("site");
  const placement = request.nextUrl.searchParams.get("placement") || undefined;
  if (!siteId) return NextResponse.json({ error: "Missing site" }, { status: 400 });

  const store = getStore();
  const site = store.sites.find((item) => item.id === siteId && item.active);
  if (!site) return NextResponse.json({ error: "Unknown or inactive site" }, { status: 404 });

  const ad = chooseAd(store.ads);
  if (!ad) return new NextResponse(null, { status: 204 });

  return NextResponse.json({
    ad: {
      id: ad.id,
      headline: ad.headline,
      description: ad.description,
      imageUrl: ad.imageUrl,
      destinationUrl: ad.destinationUrl,
      buttonLabel: ad.buttonLabel,
    },
    placement,
  }, {
    headers: {
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
