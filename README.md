# M Ads

M Ads is a privacy-first, all-ages advertising system for websites and web apps.

The initial product is intentionally simple: M Ads controls the ads, developers register sites, install a tiny JavaScript SDK, and trigger an ad at deliberate moments with `MAds.show()`.

## Principles

- No behavioral profiles
- No cross-site tracking
- No ad-targeting cookies
- No fingerprinting
- All ads are selected and managed by M Ads
- Ads are suitable for general audiences
- Analytics are publisher/ad aggregates, not user histories

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Environment

For the built-in local JSON store, no database is required.

Set an admin key for protecting write actions:

```bash
MADS_ADMIN_KEY=change-me
NEXT_PUBLIC_MADS_BASE_URL=http://localhost:3000
```

For a hosted deployment, replace the local store with a persistent database before relying on production analytics.

## SDK integration

Add the SDK once:

```html
<script
  src="https://YOUR-M-ADS-DOMAIN/sdk.js"
  data-site="YOUR_SITE_ID"
  async>
</script>
```

Then trigger an ad from your application:

```js
await MAds.show();
```

You can optionally provide a placement:

```js
await MAds.show({ placement: "quiz-complete" });
```

M Ads fails open: if an ad cannot be loaded, your app continues normally.
