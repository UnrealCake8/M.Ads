import Link from "next/link";

export default function AdvertisingStandardsPage() {
  return (
    <main className="shell">
      <nav className="nav"><Link className="brand" href="/">M Ads</Link><div style={{display:"flex",gap:10,flexWrap:"wrap"}}><Link className="pill" href="/publisher">Publishers</Link><Link className="pill" href="/terms">Terms</Link><Link className="pill" href="/privacy">Privacy</Link></div></nav>
      <section className="panel section">
        <span className="tag">Advertising Standards</span>
        <h1>Ads should be safe, clear, and suitable for everyone.</h1>
        <p>M Ads is a curated advertising network. Every advertisement is reviewed before it is activated. Approval is discretionary and does not mean M Ads endorses an advertiser, product, service, claim, or destination.</p>

        <h2>Core rules</h2>
        <div className="list">
          <div className="row"><div><strong>Clearly advertising</strong><div className="muted">Ads must be identifiable as advertising and must not impersonate system messages, warnings, notifications, or unrelated services.</div></div></div>
          <div className="row"><div><strong>Truthful and supportable</strong><div className="muted">No false, deceptive, materially incomplete, or misleading claims. Advertisers must be able to support objective claims they make.</div></div></div>
          <div className="row"><div><strong>All-ages creative</strong><div className="muted">Creative and destination pages must be appropriate for a general audience. M Ads may reject content that is frightening, sexually suggestive, graphic, profane, exploitative, or otherwise unsuitable for children.</div></div></div>
          <div className="row"><div><strong>Safe destinations</strong><div className="muted">Links must work, match the advertised offer, and must not lead to malware, deceptive downloads, phishing, forced redirects, or unexpected harmful content.</div></div></div>
        </div>

        <h2>Not accepted</h2>
        <p>M Ads does not accept advertising for pornography or sexual services; gambling or betting; tobacco, nicotine or vaping; recreational or illegal drugs; weapons or explosives; hate or extremist content; scams, phishing, malware or counterfeit goods; graphic violence; or products, services, content or conduct that is unlawful where the ad is served.</p>

        <h2>Restricted and regulated categories</h2>
        <p>Healthcare, medicines, financial services, investments, real estate, education, food and other regulated categories may require licences, permits or prior approvals. M Ads may decline these categories entirely or require evidence of all applicable approvals before publication.</p>

        <h2>Children and privacy</h2>
        <p>Advertisers and publishers must not use M Ads to send us children&apos;s personal information or sensitive personal data for advertising. M Ads does not permit advertisers to use the network for behavioural profiling or cross-site tracking of M Ads viewers.</p>

        <h2>Review and enforcement</h2>
        <p>M Ads may reject, pause or remove any ad or destination at any time, including after initial approval. Advertisers must promptly tell us if an approved creative, offer or destination materially changes. Attempts to bypass review may result in permanent rejection.</p>

        <p className="muted">These standards are platform rules, not legal advice. Advertisers remain responsible for complying with all laws, licences, permits, disclosures and approvals applicable to their advertising.</p>
      </section>
    </main>
  );
}
