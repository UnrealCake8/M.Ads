import { NextRequest, NextResponse } from "next/server";
import {
  authenticatePublisher,
  attachRefreshedSession,
  clearPublisherSession,
  setPublisherSession,
  signInPublisher,
  signUpPublisher,
} from "@/lib/publisher-auth";

export async function GET(request: NextRequest) {
  const { user, refreshed } = await authenticatePublisher(request);
  if (!user) {
    const response = NextResponse.json({ user: null }, { status: 401 });
    clearPublisherSession(response);
    return response;
  }
  return attachRefreshedSession(NextResponse.json({ user }), refreshed);
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body?.action) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  if (body.action === "logout") {
    const response = NextResponse.json({ ok: true });
    clearPublisherSession(response);
    return response;
  }

  const email = String(body.email || "").trim().toLowerCase().slice(0, 254);
  const password = String(body.password || "");
  if (!email || !email.includes("@") || password.length < 8) {
    return NextResponse.json({ error: "Enter a valid email and a password of at least 8 characters." }, { status: 400 });
  }

  try {
    const session = body.action === "signup"
      ? await signUpPublisher(email, password)
      : body.action === "login"
        ? await signInPublisher(email, password)
        : null;

    if (!session) return NextResponse.json({ error: "Unsupported action" }, { status: 400 });

    if (!session.access_token || !session.refresh_token) {
      return NextResponse.json({
        ok: true,
        requiresConfirmation: true,
        message: "Account created. Check your email to confirm it, then sign in.",
      });
    }

    const response = NextResponse.json({ ok: true, user: session.user || { email } });
    setPublisherSession(response, session);
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Authentication failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
