# Bridgeway Wholesale Ltd website

Seven-page responsive company profile site with a Node.js server and no production dependencies. Node.js 24 or later is required.

## Develop

```sh
npm ci
npm start
```

The server binds to port 3000 (override with `PORT`). `npm run dev` restarts the server on changes. The current cloud UI does not provide an external preview URL; use an authorised port preview if your workspace offers one. Do not publish the environment or deploy the site without the user's instruction.

Pages: `/`, `/about`, `/our-business`, `/products`, `/contact`, `/privacy`, `/terms`. Routes can be opened and refreshed directly. Shared header/footer and navigation are rendered by `public/app.js`; styling is in `public/styles.css`.

## Photography — required before launch

Run `npm run images:download` after `images.unsplash.com` is allowed in the **running** environment. This downloads optimised, genuine stock photographs to `public/images`. See [IMAGE-SOURCES.md](IMAGE-SOURCES.md). Do not replace photographs with AI-generated warehouse images. Downloads are currently blocked by network policy. Missing local files now redirect to the selected genuine Unsplash photographs, so deployed visitors can load them directly from Unsplash. Blocked or unavailable photos get a clearly labelled fallback. Actual image/crop QA remains pending until the sources can be loaded and inspected. The draft domain addition does not itself apply runtime settings.

## Enquiry email — intentionally pending

The owner has confirmed that the domain and receiving email are not yet ready. Copy `.env.example` to `.env` locally and set these through secure environment settings in production:

- `RESEND_API_KEY`: valid Resend API key.
- `ENQUIRY_FROM`: sender address on a verified Resend domain.
- `ENQUIRY_TO`: actual receiving business address.

Never commit credentials. Never use a made-up sender or recipient for live email. The server uses `POST https://api.resend.com/emails` with a reply-to address, plain-text body and idempotency key. `npm start` uses Node's environment proxy support and keeps TLS verification enabled. `RESEND_API_URL` is an optional server-only override used by isolated local integration tests; leave it unset in production.

Without required settings, the form returns HTTP 503 and explicitly says the message was **not sent**. Failed submissions preserve entries. A success response requires a provider acceptance ID. Provider acceptance does not prove inbox delivery. Before launch, send one authorised test to the real destination, confirm receipt there and update the QA report. Do not log enquiry content.

Anti-spam controls: honeypot, input/body limits, same-origin check, in-memory per-address rate limit and duplicate fingerprint prevention. Deploy as one Node process, or add a shared rate-limit/idempotency store before scaling to multiple instances. Counters are in memory and reset on restart. A trusted reverse proxy may require an explicit trusted-client-IP strategy; the app deliberately does not trust arbitrary forwarded headers.

## Quality checks

With the website running:

```sh
npm test
npm run test:server
```

Browser tests use system Chromium at `/usr/bin/chromium`. Change `playwright.config.js` for another installation. The server tests use a temporary local receiver on ports 3001/3002 with test-only addresses; they never send external email. Results and screenshots are in `artifacts/`. See [QA.md](QA.md) for limitations and outstanding checks.

## Brand and launch review

The supplied logo is visible as a chat image but is not available as a downloadable file in the workspace. `public/logo.svg` is an interim vector interpretation of its interwoven BW monogram, with a reversed ivory treatment for navy backgrounds; `logo-light.svg` provides a navy version. Replace with the exact supplied artwork when its file is available. Do not claim this reconstruction is the original logo asset.

Before launch, confirm hosting/data-processing details, retention period and privacy contact in the Privacy Policy. Confirm image selections and replace the interim logo with the original. This website contains an enquiry-only product showcase and no store, pricing, checkout, analytics or tracking cookies.

## Vercel deployment

`vercel.json` explicitly builds `api/index.js` with the Vercel Node runtime, includes `public/**` in the function bundle and routes page, asset and enquiry requests through the shared handler. Node 24.x is pinned in `package.json`. Importing the handler does not start a standalone server. `npm start` continues to work for local development.

In Vercel, connect this GitHub repository (`ammarahmed1902/BRIDGEWAY-WHOLESALE-LTD`), select `main` as the Production Branch, and use the repository root as Root Directory. The checked-in Vercel configuration defines the builder and routes. A main-branch push only triggers a deployment when the Git integration is connected and authorised. If the existing Vercel project is not connected, connect it in Settings → Git and create a deployment from `main` (or import the repository as a project). If a deployment is created but fails, inspect its build/function logs before changing DNS: a correctly configured domain does not create a deployment.

Set `RESEND_API_KEY`, `ENQUIRY_FROM` and `ENQUIRY_TO` securely in Vercel when the business email is ready, and redeploy after changing environment variables. No credentials are included in the repository. The same launch limitations listed above still apply. Serverless instances do not share memory, so in-memory rate limits and short-lived duplicate caches are per-instance; provider-side idempotency supplements duplicate prevention, but shared anti-spam storage is needed for stronger production enforcement.

The serverless entry point is locally tested by `npm run test:server`. Set `PLAYWRIGHT_BASE_URL` to run browser checks against another test server. Local tests do not confirm that Vercel has built or published a deployment; that requires project access and observed deployment results.

## Product showcase

The owner approved an enquiry-only showcase for seven named items. `public/products.js` holds the names, categories, descriptions and artwork filenames. `/products` displays all seven with category filters; Home features three items and a link to the full showcase. Each enquiry button goes to `/contact?product=<known-id>#enquiry` and prefills the requirements field with that product name. Only allowlisted product IDs are accepted.

The local SVG illustrations in `public/products/` were authored for this site and are deliberately labelled indicative. They are not photographs of confirmed items or evidence of specifications, availability, Apple authorisation or 3M authorisation. Replace them with owner-supplied product photographs and confirmed model information when available, keeping aspect ratios consistent and updating alt text. No performance or safety-certification claims have been added. Product names are normalised from the owner's list (for example, “4-in-1 yellow cable”).
