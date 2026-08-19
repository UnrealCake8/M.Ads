import { NextRequest, NextResponse } from "next/server";
import { createSite, getSiteMetrics, listPublisherSites } from "@/lib/db";
import { authenticatePublisher, attachRefreshedSession } from "@/lib/publisher-auth";

function normalizeDomain(value: string) {
  return value
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/\/.*$/, "")
    .replace(/\/$/, "")
    .toLowerCase()
    .slice(0, 180);
}

export async function GET(request: NextRequest) {
  const { user, refreshed } = await authenticatePublisher(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const sites = await listPublisherSites(user.id);
    const withMetrics = await Promise.all(sites.map(async (site) => ({
      ...site,
      metrics: await getSiteMetrics(site.id),
    })));
    return attachRefreshedSession(NextResponse.json({ sites: withMetrics }), refreshed);
  } catch (error) {
    console.error("M Ads publisher sites read error", error);
    return NextResponse.json({ error: "Could not load your sites" }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  const { user, refreshed } = await authenticatePublisher(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const name = String(body?.name || "").trim().slice(0, 80);
  const domain = normalizeDomain(String(body?.domain || ""));

  if (!name || !domain || !domain.includes(".")) {
    return NextResponse.json({ error: "Enter a site name and a valid domain." }, { status: 400 });
  }

  try {
    const existing = await listPublisherSites(user.id);
    if (existing.length >= 25) {
      return NextResponse.json({ error: "This account has reached the current limit of 25 sites." }, { status: 400 });
    }

    const site = await createSite({ name, domain, ownerUserId: user.id });
    return attachRefreshedSession(NextResponse.json({ site }, { status: 201 }), refreshed);
  } catch (error) {
    console.error("M Ads publisher site create error", error);
    const message = error instanceof Error && error.message.includes("duplicate")
      ? "That domain is already registered in M Ads."
      : "Could not create site.";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
