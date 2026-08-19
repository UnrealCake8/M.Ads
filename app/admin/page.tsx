"use client";

import { FormEvent, useEffect, useState } from "react";

type Dashboard = {
  ads: Array<{ id: string; name: string; headline: string; active: boolean; weight: number }>;
  sites: Array<{ id: string; name: string; domain: string; active: boolean }>;
  metrics: { impressions: number; clicks: number; ctr: number };
};

export default function AdminPage() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [adminKey, setAdminKey] = useState("");
  const [status, setStatus] = useState("Enter your admin key to load M Ads data.");

  useEffect(() => {
    const saved = sessionStorage.getItem("mads_admin_key");
    if (saved) {
      setAdminKey(saved);
      void load(saved);
    }
  }, []);

  async function load(key = adminKey) {
    if (!key) {
      setStatus("Enter your admin key first.");
      return;
    }
    const response = await fetch("/api/admin", {
      cache: "no-store",
      headers: { "x-mads-admin-key": key },
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setData(null);
      setStatus(payload.error || "Could not load dashboard");
      return;
    }
    sessionStorage.setItem("mads_admin_key", key);
    setData(payload);
    setStatus("Connected");
  }

  async function submit(kind: "site" | "ad", event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Saving…");
    const form = new FormData(event.currentTarget);
    const body = Object.fromEntries(form.entries());
    const response = await fetch("/api/admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-mads-admin-key": adminKey,
      },
      body: JSON.stringify({ kind, ...body }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setStatus(payload.error || "Could not save");
      return;
    }
    event.currentTarget.reset();
    setStatus("Saved");
    await load();
  }

  async function deleteAd(id: string, name: string) {
    if (!window.confirm(`Delete ${name}? This removes it from serving, but keeps historical analytics.`)) return;
    setStatus("Deleting ad…");
    const response = await fetch(`/api/admin?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: { "x-mads-admin-key": adminKey },
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setStatus(payload.error || "Could not delete ad");
      return;
    }
    setStatus("Ad deleted");
    await load();
  }

  return (
    <main className="shell">
      <nav className="nav"><div className="brand">M Ads Admin</div><a className="pill" href="/">Back home</a></nav>

      <section className="panel section">
        <h2>Admin access</h2>
        <p>Your key stays in this browser tab/session and is sent only to the M Ads server.</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input value={adminKey} onChange={(event) => setAdminKey(event.target.value)} type="password" placeholder="MADS_ADMIN_KEY" style={{ ...inputStyle, flex: 1 }} />
          <button onClick={() => void load()} style={buttonStyle}>Load dashboard</button>
        </div>
        {status && <p className="muted">{status}</p>}
      </section>

      <section className="grid">
        <div className="panel stat"><strong>{data?.metrics.impressions ?? 0}</strong><span>impressions</span></div>
        <div className="panel stat"><strong>{data?.metrics.clicks ?? 0}</strong><span>clicks</span></div>
        <div className="panel stat"><strong>{(data?.metrics.ctr ?? 0).toFixed(2)}%</strong><span>CTR</span></div>
      </section>

      <section className="hero section">
        <div className="panel">
          <h2>Create a site</h2>
          <p>Register a website, then use its generated Site ID in the SDK snippet.</p>
          <form onSubmit={(event) => submit("site", event)} className="list">
            <input name="name" placeholder="Site name" required style={inputStyle} />
            <input name="domain" placeholder="example.com" required style={inputStyle} />
            <button style={buttonStyle}>Create site</button>
          </form>
        </div>

        <div className="panel">
          <h2>Create an ad</h2>
          <p>Only creatives you add here can ever be served by M Ads.</p>
          <form onSubmit={(event) => submit("ad", event)} className="list">
            <input name="name" placeholder="Internal name" required style={inputStyle} />
            <input name="headline" placeholder="Headline" required style={inputStyle} />
            <textarea name="description" placeholder="Description" style={{...inputStyle, minHeight: 90}} />
            <input name="imageUrl" placeholder="Image URL (optional)" style={inputStyle} />
            <input name="destinationUrl" placeholder="https://…" required style={inputStyle} />
            <input name="buttonLabel" placeholder="Learn more" style={inputStyle} />
            <label style={{ fontWeight: 700 }}>Frequency weight</label>
            <input name="weight" type="number" min="1" max="1000" defaultValue="100" style={inputStyle} />
            <p className="muted" style={{ marginTop: -6 }}>Higher weight means this ad is chosen more often relative to your other active ads. If two ads are both 100, they are roughly 50/50. If one is 200 and one is 100, the first is roughly twice as likely to appear.</p>
            <button style={buttonStyle}>Create ad</button>
          </form>
        </div>
      </section>

      <section className="hero section">
        <div className="panel">
          <h2>Sites</h2>
          <div className="list">
            {data?.sites.map((site) => <div className="row" key={site.id}><div><strong>{site.name}</strong><div className="muted">{site.domain}<br />{site.id}</div></div><span className="badge">{site.active ? "Active" : "Off"}</span></div>)}
          </div>
        </div>
        <div className="panel">
          <h2>Ads</h2>
          <div className="list">
            {data?.ads.map((ad) => (
              <div className="row" key={ad.id} style={{ alignItems: "center", gap: 14 }}>
                <div style={{ flex: 1 }}>
                  <strong>{ad.name}</strong>
                  <div className="muted">{ad.headline}<br />Frequency weight {ad.weight}</div>
                </div>
                <span className="badge">{ad.active ? "Active" : "Off"}</span>
                <button onClick={() => void deleteAd(ad.id, ad.name)} style={dangerButtonStyle}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

const inputStyle = { width: "100%", border: "1px solid #dfe3e8", borderRadius: 14, padding: "12px 14px", font: "inherit", background: "#fff" };
const buttonStyle = { border: 0, borderRadius: 999, padding: "12px 16px", background: "#111", color: "#fff", font: "inherit", fontWeight: 700, cursor: "pointer" };
const dangerButtonStyle = { border: "1px solid #fecaca", borderRadius: 999, padding: "10px 14px", background: "#fff1f2", color: "#be123c", font: "inherit", fontWeight: 700, cursor: "pointer" };
