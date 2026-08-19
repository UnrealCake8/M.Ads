import { NextRequest, NextResponse } from "next/server";

export type PublisherUser = {
  id: string;
  email?: string;
};

type AuthSession = {
  access_token: string;
  refresh_token: string;
  expires_in?: number;
  user?: PublisherUser;
};

const ACCESS_COOKIE = "mads_publisher_access";
const REFRESH_COOKIE = "mads_publisher_refresh";

function authConfig() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error("Missing Supabase server credentials");
  return { url: url.replace(/\/$/, ""), key };
}

async function authRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const { url, key } = authConfig();
  const response = await fetch(`${url}/auth/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      "Content-Type": "application/json",
      ...init.headers,
    },
    cache: "no-store",
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = payload?.msg || payload?.message || payload?.error_description || payload?.error || "Authentication failed";
    throw new Error(String(message));
  }
  return payload as T;
}

export async function signInPublisher(email: string, password: string): Promise<AuthSession> {
  return authRequest<AuthSession>("token?grant_type=password", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function signUpPublisher(email: string, password: string): Promise<AuthSession & { identities?: unknown[] }> {
  const redirectTo = encodeURIComponent("https://ads.mplace.cc/publisher");
  return authRequest<AuthSession & { identities?: unknown[] }>(`signup?redirect_to=${redirectTo}`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

async function getUser(accessToken: string): Promise<PublisherUser> {
  return authRequest<PublisherUser>("user", {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

async function refreshSession(refreshToken: string): Promise<AuthSession> {
  return authRequest<AuthSession>("token?grant_type=refresh_token", {
    method: "POST",
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
}

export async function authenticatePublisher(request: NextRequest): Promise<{ user: PublisherUser | null; refreshed?: AuthSession }> {
  const access = request.cookies.get(ACCESS_COOKIE)?.value;
  const refresh = request.cookies.get(REFRESH_COOKIE)?.value;

  if (access) {
    try {
      return { user: await getUser(access) };
    } catch {
      // Fall through to refresh below.
    }
  }

  if (!refresh) return { user: null };

  try {
    const session = await refreshSession(refresh);
    const user = session.user || await getUser(session.access_token);
    return { user, refreshed: session };
  } catch {
    return { user: null };
  }
}

export function setPublisherSession(response: NextResponse, session: AuthSession) {
  const secure = process.env.NODE_ENV === "production";
  const common = { httpOnly: true, secure, sameSite: "lax" as const, path: "/" };

  response.cookies.set(ACCESS_COOKIE, session.access_token, {
    ...common,
    maxAge: Math.max(60, Number(session.expires_in || 3600)),
  });
  response.cookies.set(REFRESH_COOKIE, session.refresh_token, {
    ...common,
    maxAge: 60 * 60 * 24 * 30,
  });
}

export function clearPublisherSession(response: NextResponse) {
  const secure = process.env.NODE_ENV === "production";
  const common = { httpOnly: true, secure, sameSite: "lax" as const, path: "/", maxAge: 0 };
  response.cookies.set(ACCESS_COOKIE, "", common);
  response.cookies.set(REFRESH_COOKIE, "", common);
}

export function attachRefreshedSession(response: NextResponse, refreshed?: AuthSession) {
  if (refreshed?.access_token && refreshed?.refresh_token) setPublisherSession(response, refreshed);
  return response;
}
