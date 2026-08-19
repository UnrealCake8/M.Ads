import Link from "next/link";

const Code = ({ children }: { children: string }) => (
  <pre className="code docs-code"><code>{children}</code></pre>
);

export default function DocsPage() {
  return (
    <main className="shell docs-shell">
      <nav className="nav">
        <Link className="brand" href="/">M Ads</Link>
        <div className="docs-nav-actions">
          <Link className="pill" href="/">Home</Link>
          <Link className="pill" href="/admin">Admin</Link>
        </div>
      </nav>

      <section className="docs-layout">
        <aside className="panel docs-sidebar">
          <strong>API Docs</strong>
          <a href="#quickstart">Quickstart</a>
          <a href="#show">MAds.show()</a>
          <a href="#placements">Placements</a>
          <a href="#returns">Return values</a>
          <a href="#examples">Examples</a>
          <a href="#formats">Ad formats</a>
          <a href="#failure">Failure behavior</a>
          <a href="#rest">REST API</a>
        </aside>

        <article className="docs-content">
          <section className="panel docs-hero">
            <span className="tag">M Ads Developer API</span>
            <h1>Integrate ads with one script and one function.</h1>
            <p>
              M Ads is designed to be deliberately small. Add the SDK once, then call
              <code className="inline-code">MAds.show()</code> whenever your app reaches a moment where an ad should appear.
            </p>
          </section>

          <section id="quickstart" className="panel docs-section">
            <h2>Quickstart</h2>
            <p>Add the SDK to your page using the Site ID from the M Ads dashboard.</p>
            <Code>{`<script
  src="https://ads.mplace.cc/sdk.js"
  data-site="site_your_id_here">
</script>`}</Code>
            <p>Then trigger an ad:</p>
            <Code>{`await MAds.show();`}</Code>
          </section>

          <section id="show" className="panel docs-section">
            <h2>MAds.show()</h2>
            <p>
              <code className="inline-code">MAds.show()</code> requests an eligible ad, renders it, waits for the user to finish the ad flow, and then resolves.
            </p>
            <Code>{`const result = await MAds.show({
  placement: "lesson-complete"
});`}</Code>
            <div className="docs-table-wrap">
              <table className="docs-table">
                <thead><tr><th>Option</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
                <tbody>
                  <tr><td><code>placement</code></td><td>string</td><td>No</td><td>A developer-defined label for where the ad appeared.</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section id="placements" className="panel docs-section">
            <h2>Placements</h2>
            <p>
              Placements are simple labels you choose. They help you understand where ads are being shown without identifying users.
            </p>
            <Code>{`await MAds.show({ placement: "quiz-complete" });
await MAds.show({ placement: "level-finished" });
await MAds.show({ placement: "download-ready" });`}</Code>
            <p>Keep placement names short and descriptive. They are used for aggregate analytics only.</p>
          </section>

          <section id="returns" className="panel docs-section">
            <h2>Return values</h2>
            <p>The Promise resolves to an object describing whether an ad was shown.</p>
            <Code>{`{
  shown: true,
  adId: "ad_..."
}`}</Code>
            <p>If no ad is available, the SDK resolves without blocking the app:</p>
            <Code>{`{
  shown: false
}`}</Code>
          </section>

          <section id="examples" className="panel docs-section">
            <h2>Examples</h2>
            <h3>Continue after an ad</h3>
            <Code>{`async function handleContinue() {
  await MAds.show({ placement: "continue-button" });
  goToNextPage();
}`}</Code>

            <h3>Save first, then show an ad</h3>
            <Code>{`async function submitAssignment() {
  await saveAssignment();
  await MAds.show({ placement: "assignment-submitted" });
  showSuccessScreen();
}`}</Code>

            <h3>React</h3>
            <Code>{`async function handleNext() {
  await window.MAds.show({ placement: "lesson-complete" });
  setStep((step) => step + 1);
}`}</Code>
          </section>

          <section id="formats" className="panel docs-section">
            <h2>Ad formats</h2>
            <p>M Ads currently supports three creative types configured by the M Ads administrator:</p>
            <div className="docs-cards">
              <div><strong>Text + button</strong><span>Headline, description and CTA.</span></div>
              <div><strong>Image + button</strong><span>Visual creative with a CTA.</span></div>
              <div><strong>Mixed</strong><span>Image, text and CTA together.</span></div>
            </div>
            <p>The publisher integration does not need to change when the creative format changes.</p>
          </section>

          <section id="failure" className="panel docs-section">
            <h2>Failure behavior</h2>
            <p>
              M Ads is fail-open by design. A network problem, unavailable ad, or temporary M Ads outage should never break the host app.
            </p>
            <Code>{`const result = await MAds.show();

// Continue regardless of whether an ad was available.
continueAppFlow();`}</Code>
            <p>
              The SDK may also return a reason such as <code className="inline-code">missing_site_id</code> or <code className="inline-code">unavailable</code> for debugging.
            </p>
          </section>

          <section id="rest" className="panel docs-section">
            <h2>REST API</h2>
            <p>
              Most developers should use the JavaScript SDK. The public ad-serving endpoint used by the SDK is documented here for debugging and advanced integrations.
            </p>
            <Code>{`GET https://ads.mplace.cc/api/ad?site=SITE_ID&placement=PLACEMENT`}</Code>
            <p>Successful response:</p>
            <Code>{`{
  "ad": {
    "id": "ad_...",
    "format": "mixed",
    "headline": "Example",
    "description": "Example description",
    "imageUrl": "https://...",
    "destinationUrl": "https://example.com",
    "buttonLabel": "Learn more"
  },
  "placement": "lesson-complete"
}`}</Code>
            <p>A response with HTTP 204 means there is currently no eligible ad to serve.</p>
          </section>

          <footer className="footer">M Ads API Docs · ads.mplace.cc</footer>
        </article>
      </section>
    </main>
  );
}
