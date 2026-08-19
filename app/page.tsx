import Link from "next/link";

export default function HomePage() {
  return (
    <main className="shell">
      <nav className="nav">
        <div className="brand">M Ads</div>
        <Link className="pill" href="/admin">Open admin</Link>
      </nav>

      <section className="hero">
        <div className="panel">
          <span className="tag">Privacy-first advertising</span>
          <h1>Ads without following people around.</h1>
          <p>
            M Ads lets developers trigger short, all-ages advertisements at deliberate moments in their apps and websites. No behavioral profiles, no cross-site tracking, and no creepy retargeting.
          </p>
          <div className="section code">{`<script src="https://YOUR-DOMAIN/sdk.js" data-site="SITE_ID" async></script>\n\nawait MAds.show({ placement: "quiz-complete" });`}</div>
        </div>

        <aside className="panel">
          <h2>Built around three rules</h2>
          <div className="list">
            <div className="row"><div><strong>All-ages ads</strong><div className="muted">You control every creative that enters the network.</div></div><span className="badge">Safe</span></div>
            <div className="row"><div><strong>No user profiles</strong><div className="muted">Events belong to sites and ads, not people.</div></div><span className="badge">Private</span></div>
            <div className="row"><div><strong>Developer-triggered</strong><div className="muted">Ads appear only when the app intentionally calls them.</div></div><span className="badge">Simple</span></div>
          </div>
        </aside>
      </section>

      <section className="grid">
        <div className="panel stat"><strong>3 sec</strong><span>default wait before continue</span></div>
        <div className="panel stat"><strong>0</strong><span>behavioral profiles created</span></div>
        <div className="panel stat"><strong>1 call</strong><span>to trigger an ad</span></div>
      </section>

      <footer className="footer">M Ads · Advertising without surveillance.</footer>
    </main>
  );
}
