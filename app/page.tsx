import Link from "next/link";

const MPLACE_LOGO = "https://unrealcake8.github.io/cdn-hls/mplace.png";

export default function HomePage() {
  return (
    <main className="shell">
      <nav className="nav">
        <Link className="brand-lockup" href="/" aria-label="MPlace Ads home">
          <img src={MPLACE_LOGO} alt="MPlace" className="mplace-logo" />
          <span className="product-name">ADS</span>
          <span className="product-short">M.Ads</span>
        </Link>
        <div className="nav-actions">
          <Link className="pill" href="/publisher">Publishers</Link>
          <Link className="pill" href="/payouts">Payouts</Link>
          <Link className="pill" href="/contact">Contact</Link>
          <Link className="pill" href="/docs">API Docs</Link>
          <Link className="pill primary-pill" href="/login">MPlace ID</Link>
          <a className="pill mplace-link" href="https://mplace.cc">MPlace</a>
        </div>
      </nav>

      <section className="hero">
        <div className="panel hero-panel">
          <span className="tag">MPlace privacy-first advertising</span>
          <h1>Ads without following people around.</h1>
          <p>MPlace Ads, or M.Ads, lets developers trigger short, all-ages advertisements at deliberate moments in their apps and websites. No behavioral profiles, no cross-site tracking, and no creepy retargeting.</p>
          <div className="brand-stripe" aria-hidden="true"><i/><i/><i/><i/><i/></div>
          <div className="section code">{`<script src="https://ads.mplace.cc/sdk.js" data-site="SITE_ID"></script>\n\nawait MAds.show({ placement: "quiz-complete" });`}</div>
          <div className="cta-row"><Link className="pill primary-pill" href="/publisher">Create a publisher account →</Link><Link className="pill" href="/docs">Read the API docs →</Link></div>
        </div>
        <aside className="panel"><p className="eyebrow">Part of MPlace</p><h2>Built around three rules</h2><div className="list"><div className="row"><div><strong>All-ages ads</strong><div className="muted">Every creative is reviewed before it enters the network.</div></div><span className="badge safe">Safe</span></div><div className="row"><div><strong>No user profiles</strong><div className="muted">Events belong to sites and ads, not people.</div></div><span className="badge private">Private</span></div><div className="row"><div><strong>Developer-triggered</strong><div className="muted">Ads appear only when the app intentionally calls them.</div></div><span className="badge simple">Simple</span></div></div></aside>
      </section>

      <section className="grid"><div className="panel stat"><strong>3 sec</strong><span>default wait before continue</span></div><div className="panel stat"><strong>0</strong><span>behavioral profiles created</span></div><div className="panel stat"><strong>1 call</strong><span>to trigger an ad</span></div></section>

      <footer className="footer">
        <div><strong>MPlace Ads</strong> · M.Ads · Advertising without surveillance.</div>
        <div className="footer-links"><Link href="/advertising-standards">Advertising Standards</Link><Link href="/terms">Publisher Terms</Link><Link href="/privacy">Privacy</Link><Link href="/contact">Contact</Link><a href="https://mplace.cc">MPlace</a></div>
      </footer>
    </main>
  );
}
