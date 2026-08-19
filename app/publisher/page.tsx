"use client";

import { FormEvent, useEffect, useState } from "react";

type Site = {
  id: string;
  name: string;
  domain: string;
  active: boolean;
  metrics: { impressions: number; clicks: number; ctr: number };
};

type User = { id: string; email?: string };

function snippet(siteId: string) {
  return `<script
  src="https://ads.mplace.cc/sdk.js"
  data-site="${siteId}">
</script>

<button onclick="continueAfterAd()">
  Continue
</button>

<script>
  async function continueAfterAd() {
    await MAds.show({
      placement: "continue-button"
    });

    // Your app action happens here
    alert("Continue action!");
  }
</script>`;
}

export default function PublisherPage() {
  const [user, setUser] = useState<User | null>(null);
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  useEffect(() => { void bootstrap(); }, []);

  async function bootstrap() {
    setLoading(true);
    const response = await fetch("/api/publisher/auth", { cache: "no-store" });
    const payload = await response.json().catch(() => ({}));
    if (response.ok && payload.user) {
      setUser(payload.user);
      await loadSites();
    }
    setLoading(false);
  }

  async function loadSites() {
    const response = await fetch("/api/publisher/sites", { cache: "no-store" });
    const payload = await response.json().catch(() => ({}));
    if (response.ok) setSites(payload.sites || []);
  }

  async function auth(action: "login" | "signup", event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(action === "signup" ? "Creating account…" : "Signing in…");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/publisher/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, email: form.get("email"), password: form.get("password") }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setStatus(payload.error || "Authentication failed");
      return;
    }
    if (payload.requiresConfirmation) {
      setStatus(payload.message || "Check your email to confirm your account.");
      return;
    }
    setStatus("Signed in");
    await bootstrap();
  }

  async function createSite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Creating site…");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/publisher/sites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.get("name"), domain: form.get("domain") }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setStatus(payload.error || "Could not create site");
      return;
    }
    event.currentTarget.reset();
    setStatus("Site created");
    await loadSites();
  }

  async function logout() {
    await fetch("/api/publisher/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    setUser(null);
    setSites([]);
    setStatus("");
  }

  async function copy(value: string) {
    await navigator.clipboard.writeText(value);
    setStatus("Copied to clipboard");
  }

  if (loading) {
    return <main className="shell"><div className="panel section"><h2>Loading M Ads…</h2></div></main>;
  }

  if (!user) {
    return (
      <main className="shell">
        <nav className="nav"><a className="brand" href="/">M Ads</a><a className="pill" href="/docs">API Docs</a></nav>
        <section className="hero">
          <div className="panel">
            <span className="tag">Publisher account</span>
            <h1 style={{ fontSize: 54 }}>Put M Ads on your site.</h1>
            <p>Create a publisher account, register your website, and get a Site ID plus copy-paste integration code.</p>
          </div>
          <div className="panel">
            <h2>Sign in or create account</h2>
            <form className="list" onSubmit={(event) => void auth("login", event)}>
              <input name="email" type="email" placeholder="you@example.com" required style={inputStyle} />
              <input name="password" type="password" placeholder="Password, 8+ characters" minLength={8} required style={inputStyle} />
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button type="submit" style={buttonStyle}>Sign in</button>
                <button type="button" style={secondaryButtonStyle} onClick={(event) => {
                  const form = (event.currentTarget.closest("form") as HTMLFormElement | null);
                  if (form) void auth("signup", { preventDefault() {}, currentTarget: form } as unknown as FormEvent<HTMLFormElement>);
                }}>Create account</button>
              </div>
            </form>
            {status && <p className="muted">{status}</p>}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="shell">
      <nav className="nav">
        <div><a className="brand" href="/">M Ads</a><div className="muted">Publisher portal</div></div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
          <span className="muted">{user.email}</span>
          <a className="pill" href="/docs">API Docs</a>
          <button onClick={() => void logout()} style={secondaryButtonStyle}>Sign out</button>
        </div>
      </nav>

      <section className="hero">
        <div className="panel">
          <span className="tag">Your M Ads sites</span>
          <h1 style={{ fontSize: 56 }}>Integrate once. Trigger anywhere.</h1>
          <p>Your Site ID identifies the website requesting an ad. It is safe to include in frontend code; it is not a password or secret.</p>
        </div>
        <div className="panel">
          <h2>Add a website</h2>
          <form className="list" onSubmit={(event) => void createSite(event)}>
            <input name="name" placeholder="Site name" required style={inputStyle} />
            <input name="domain" placeholder="example.com" required style={inputStyle} />
            <button style={buttonStyle}>Create site</button>
          </form>
          {status && <p className="muted">{status}</p>}
        </div>
      </section>

      <section className="section" style={{ display: "grid", gap: 18 }}>
        {sites.length === 0 && (
          <div className="panel"><h2>No sites yet</h2><p>Create your first website above and M Ads will generate a Site ID automatically.</p></div>
        )}

        {sites.map((site) => {
          const code = snippet(site.id);
          return (
            <article className="panel" key={site.id}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                <div>
                  <h2 style={{ marginBottom: 6 }}>{site.name}</h2>
                  <div className="muted">{site.domain}</div>
                  <div className="code" style={{ display: "inline-block", marginTop: 12, padding: "8px 11px" }}>{site.id}</div>
                </div>
                <span className="badge">{site.active ? "Active" : "Off"}</span>
              </div>

              <div className="grid" style={{ marginTop: 20 }}>
                <div className="panel stat" style={{ boxShadow: "none" }}><strong>{site.metrics.impressions}</strong><span>impressions</span></div>
                <div className="panel stat" style={{ boxShadow: "none" }}><strong>{site.metrics.clicks}</strong><span>clicks</span></div>
                <div className="panel stat" style={{ boxShadow: "none" }}><strong>{site.metrics.ctr.toFixed(2)}%</strong><span>CTR</span></div>
              </div>

              <div className="section">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                  <div><strong>Copy-paste example</strong><div className="muted">Loads M Ads, shows an ad, then continues your app action.</div></div>
                  <button onClick={() => void copy(code)} style={secondaryButtonStyle}>Copy code</button>
                </div>
                <pre className="code" style={{ whiteSpace: "pre-wrap" }}>{code}</pre>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}

const inputStyle = { width: "100%", border: "1px solid #dfe3e8", borderRadius: 14, padding: "12px 14px", font: "inherit", background: "#fff" };
const buttonStyle = { border: 0, borderRadius: 999, padding: "12px 16px", background: "#111", color: "#fff", font: "inherit", fontWeight: 700, cursor: "pointer" };
const secondaryButtonStyle = { border: "1px solid #d9dde4", borderRadius: 999, padding: "11px 15px", background: "#fff", color: "#111", font: "inherit", fontWeight: 700, cursor: "pointer" };
