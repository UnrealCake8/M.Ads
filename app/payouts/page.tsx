import Link from "next/link";

const subject = "POKIP and M Ads Payout Request";
const body = `Hello,

I would like to request an M Ads payout through POKIP.

POKIP account email: YOUR_POKIP_EMAIL
M Ads Site ID: site_xxxxxxxxxxxx

Thank you.`;

const mailto = `mailto:hello@unrealcake8.site?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

export default function PayoutsPage() {
  return (
    <main className="shell">
      <nav className="nav">
        <Link className="brand" href="/">M Ads</Link>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link className="pill" href="/publisher">Publisher</Link>
          <Link className="pill" href="/contact">Contact</Link>
          <Link className="pill" href="/docs">API Docs</Link>
        </div>
      </nav>

      <section className="hero">
        <div className="panel">
          <span className="tag">Payouts</span>
          <h1>Turn M Ads performance into POKIP points.</h1>
          <p>
            M Ads payouts are handled manually through POKIP. POKIP is a loyalty program that lets you convert points into rewards at select places.
          </p>
          <p>
            The number of points you receive is decided based on your site&apos;s M Ads performance, including impressions, clicks, and CTR.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 }}>
            <a className="pill" href="https://pokip.unrealcake8.site" target="_blank" rel="noreferrer">Open POKIP</a>
            <a className="pill" href={mailto}>Email payout request</a>
          </div>
        </div>

        <aside className="panel">
          <h2>How to request a payout</h2>
          <div className="list">
            <div className="row"><div><strong>1. Create a POKIP account</strong><div className="muted">Go to pokip.unrealcake8.site and register an account.</div></div></div>
            <div className="row"><div><strong>2. Get your M Ads Site ID</strong><div className="muted">You can find it in your M Ads Publisher Portal.</div></div></div>
            <div className="row"><div><strong>3. Email us</strong><div className="muted">Send the POKIP email used for your account and your M Ads Site ID.</div></div></div>
          </div>
        </aside>
      </section>

      <section className="section panel">
        <h2>Email template</h2>
        <p className="muted">Send this to <strong>hello@unrealcake8.site</strong>.</p>
        <div className="code" style={{ whiteSpace: "pre-wrap" }}>{`Subject: ${subject}\n\n${body}`}</div>
      </section>

      <section className="grid">
        <div className="panel stat"><strong>Impressions</strong><span>How many times ads were shown</span></div>
        <div className="panel stat"><strong>Clicks</strong><span>How many ad interactions were recorded</span></div>
        <div className="panel stat"><strong>CTR</strong><span>Clicks relative to impressions</span></div>
      </section>
    </main>
  );
}
