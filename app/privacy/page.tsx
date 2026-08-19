import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="shell">
      <nav className="nav"><Link className="brand" href="/">M Ads</Link><div style={{display:"flex",gap:10,flexWrap:"wrap"}}><Link className="pill" href="/advertising-standards">Ad Standards</Link><Link className="pill" href="/terms">Terms</Link></div></nav>
      <section className="panel section">
        <span className="tag">Privacy Policy</span>
        <h1>Privacy without pretending we collect nothing.</h1>
        <p><strong>Last updated: 19 August 2026.</strong> M Ads is designed to deliver and measure advertising without building behavioural advertising profiles or tracking people across unrelated websites.</p>

        <h2>Information we process</h2>
        <p>For publisher accounts, we process account information such as email address, authentication information handled through our authentication provider, registered site names/domains and Site IDs. For advertising operations, we record limited event information needed to count impressions and clicks, associate those events with a Site ID and ad, record a placement label when supplied, operate the service, detect abuse and produce aggregate analytics.</p>

        <h2>What M Ads is not designed to do</h2>
        <p>M Ads does not intentionally create behavioural advertising profiles, sell viewer profiles, or follow viewers across unrelated websites for personalised ad targeting. A Site ID identifies a publisher website, not an individual viewer.</p>

        <h2>Technical data</h2>
        <p>Like most internet services, hosting, security and infrastructure providers may process ordinary request data such as IP addresses, timestamps, user-agent information and security logs when requests reach M Ads. This information may be used for security, reliability, fraud prevention and service operation rather than behavioural ad targeting.</p>

        <h2>Cookies and authentication</h2>
        <p>M Ads may use necessary authentication cookies for publisher accounts. These cookies are used to keep a publisher signed in and secure their account, not to build an advertising profile of viewers.</p>

        <h2>Service providers and disclosure</h2>
        <p>We may use infrastructure, database, authentication and hosting providers to operate M Ads. Information may also be disclosed when reasonably necessary to comply with law, protect users or the service, investigate abuse, or enforce our terms.</p>

        <h2>Children</h2>
        <p>M Ads advertising is intended to be suitable for general audiences, but publishers and advertisers must not intentionally send M Ads children&apos;s personal information for advertising or use M Ads to behaviourally profile children.</p>

        <h2>Retention and security</h2>
        <p>We retain information for as long as reasonably needed to operate M Ads, maintain analytics and records, prevent abuse, resolve disputes and meet legal obligations. We use reasonable technical and organisational safeguards, but no online service can guarantee absolute security.</p>

        <h2>Your requests</h2>
        <p>For privacy questions or requests concerning information associated with your publisher account, contact <a href="mailto:hello@unrealcake8.site">hello@unrealcake8.site</a>. We may need to verify your identity before acting on a request.</p>

        <h2>Changes</h2>
        <p>We may update this policy as M Ads changes or legal requirements develop. The current version will be published on this page with an updated date.</p>
      </section>
    </main>
  );
}
