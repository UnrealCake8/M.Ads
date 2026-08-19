import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="shell">
      <nav className="nav"><Link className="brand" href="/">M Ads</Link><div style={{display:"flex",gap:10,flexWrap:"wrap"}}><Link className="pill" href="/advertising-standards">Ad Standards</Link><Link className="pill" href="/privacy">Privacy</Link></div></nav>
      <section className="panel section">
        <span className="tag">Publisher Terms</span>
        <h1>Terms for using M Ads.</h1>
        <p><strong>Last updated: 19 August 2026.</strong> These terms govern publisher use of the M Ads website, publisher portal, SDK, Site IDs, APIs and related services. By creating an account or integrating M Ads, you agree to these terms.</p>

        <h2>Publisher accounts and sites</h2>
        <p>You must provide accurate account and site information, keep your account secure, and only register sites you own or are authorised to operate. Site IDs are identifiers, not passwords. You must not use another publisher&apos;s Site ID or misrepresent traffic as belonging to another site.</p>

        <h2>Using the SDK</h2>
        <p>You may integrate the official M Ads SDK and call it at appropriate moments in your product. You must not alter M Ads creatives to mislead users, conceal required advertising identification, fabricate impressions or clicks, interfere with measurement, automatically click ads, or incentivise fraudulent interaction.</p>

        <h2>Traffic quality</h2>
        <p>Automated, artificial, duplicated, manipulated, bot-generated or otherwise invalid impressions and clicks may be excluded from analytics and reward calculations. We may investigate unusual traffic and suspend a site while doing so.</p>

        <h2>POKIP points and rewards</h2>
        <p>M Ads may make publishers eligible for POKIP points based on factors including valid impressions, valid clicks and CTR. Displayed analytics do not create a guaranteed cash entitlement or fixed conversion rate. Reward decisions may account for traffic validity, abuse, corrections and program rules. POKIP rewards are subject to the applicable POKIP program and participating reward availability.</p>

        <h2>Acceptable use</h2>
        <p>You may not use M Ads in connection with unlawful content or activity; malware, phishing or fraud; deceptive interfaces; infringement of others&apos; rights; attempts to compromise M Ads; or any use that could expose M Ads, advertisers, publishers or viewers to unreasonable harm.</p>

        <h2>Availability and changes</h2>
        <p>M Ads may change, suspend or discontinue features, ads, sites, accounts or integrations. We do not promise uninterrupted availability or that an ad will be available for every request. Publisher integrations should fail open so a missing ad does not trap or block the end user.</p>

        <h2>Third-party services</h2>
        <p>M Ads may link to or depend on third-party services, including advertiser destinations and POKIP. Those services have their own terms and privacy practices. M Ads does not control every third-party service merely because it is linked from an ad or page.</p>

        <h2>Responsibility and liability</h2>
        <p>You remain responsible for your website, app, integration and compliance with laws applicable to you. To the extent permitted by applicable law, M Ads is provided on an as-available basis and is not liable for indirect or consequential losses arising solely from service interruption, unavailable ads or publisher misuse of the service.</p>

        <h2>Suspension and termination</h2>
        <p>We may restrict or terminate access for violations of these terms, fraud, security risk, legal requirements or conduct that threatens the integrity of M Ads. You may stop using the SDK at any time.</p>

        <h2>Contact</h2>
        <p>Questions about these terms can be sent to <a href="mailto:hello@unrealcake8.site">hello@unrealcake8.site</a>.</p>

        <p className="muted">These terms are a practical platform baseline and should be reviewed by a qualified lawyer before M Ads accepts significant commercial business or relies on them for a legal dispute.</p>
      </section>
    </main>
  );
}
