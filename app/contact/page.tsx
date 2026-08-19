import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="shell">
      <nav className="nav">
        <Link className="brand" href="/">M Ads</Link>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link className="pill" href="/publisher">Publisher</Link>
          <Link className="pill" href="/payouts">Payouts</Link>
          <Link className="pill" href="/docs">API Docs</Link>
        </div>
      </nav>

      <section className="hero">
        <div className="panel">
          <span className="tag">Contact</span>
          <h1>Need help with M Ads?</h1>
          <p>
            For publisher support, payout questions, integration help, or general enquiries,
            contact us by email.
          </p>
          <div className="section">
            <a className="pill" href="mailto:hello@unrealcake8.site">hello@unrealcake8.site</a>
          </div>
        </div>

        <aside className="panel">
          <h2>When emailing us</h2>
          <p className="muted">
            If your question is about a specific M Ads website, include the Site ID so we can identify it quickly.
          </p>
          <div className="code">site_xxxxxxxxxxxx</div>
        </aside>
      </section>
    </main>
  );
}
