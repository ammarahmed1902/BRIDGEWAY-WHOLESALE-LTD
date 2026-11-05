# QA report — 5 November 2026

## Status

**Development implementation tested; not ready for public launch.** Real stock photographs still need to download and be visually verified, the original logo file needs importing, and business email delivery is intentionally pending the owner's domain setup. The running site uses clearly labelled photography placeholders when image files are unavailable. These are not warehouse illustrations or substitute stock photographs.

## Browser coverage

System Chromium, headless real-browser automation. All six pages opened directly and refreshed. Tested each page at widths 320, 375, 390, 550, 640, 768, 900, 1024, 1280, 1440 and 1920 px. An additional 844 × 390 landscape viewport was checked. Enlarged text at 200% was checked on Home at 320, 768 and 1440 px. Full-page screenshots were captured at 1440 × 1000, 768 × 1024 and 390 × 844. No physical devices, Firefox or WebKit were available; those have not been validated. Touch keyboard behaviour was checked through semantic input attributes, not a physical mobile keyboard.

## Passed

- Six Chromium test cases: direct loads, refreshes, all internal navigation and category destinations, visible current-page links, responsive overflow checks, mobile menu opening/Escape closure/navigation, keyboard skip link and focus styling, empty/invalid-email validation, preserved input on missing delivery configuration, loading/disabled state and repeated-click prevention.
- Browser success and provider-failure UI paths tested with explicitly mocked responses. These do not establish live email delivery.
- Three server integration tests: invalid input/honeypot rejection; a real HTTP submission delivered to an isolated local test receiver with expected reply-to and message; duplicate prevention and provider failure handling. No external email was sent.
- Horizontal overflow found at 320 px and with enlarged text was corrected and retested. Mobile headings were adjusted to retain spaces when line breaks are removed.
- Desktop and mobile screenshots were visually inspected; screenshot evidence covers layout only until photographs are available.

## Outstanding / limitations

- **Photography:** actual download attempts received proxy HTTP 403. `images.unsplash.com` and `unsplash.com` were added to the configuration draft, but the running policy still reports no custom domains. Apply the settings, run `npm run images:download`, inspect all five image files and crops, then repeat resource/visual QA. Placeholder images must not pass launch review.
- **Original logo:** the uploaded chat image has no downloadable workspace file. Current SVG is a vector interpretation, not the exact original artwork. Import the original file before branding sign-off.
- **Email:** no real receiving email, verified sender or API credential exists yet. The actual unconfigured API returned HTTP 503 and the browser explained that nothing was sent. Real recipient delivery has not been tested, per the owner's instruction to finish this after domain setup.
- **Privacy:** hosting provider, retention period, international-transfer arrangements (if applicable) and privacy contact need business confirmation before launch. Missing details are identified in the policy.
- **Preview:** server runs on port 3000. No externally reachable preview/publication tool is available in this session, so no public URL has been created or claimed.
- Memory-based spam/idempotency protection is appropriate for the supplied single-process development server; use shared storage and trusted proxy configuration if scaling production instances.

## Evidence

`artifacts/desktop.png`, `artifacts/tablet.png`, `artifacts/mobile.png`, `artifacts/test-results.json`, and `artifacts/resource-audit.json`.

## Vercel compatibility follow-up

Added a dedicated `api/index.js` serverless entry point and explicit `vercel.json` builder/routing configuration. Import no longer starts a listening server. Bundled `public/**` assets and Node 24.x are declared. Two additional integration tests verify direct page/asset responses, no import-time listening side effect, and Vercel-preparsed request validation/body limits. The six Chromium checks were rerun against the imported serverless handler on a separate local port. This is local compatibility evidence, not a Vercel build or production deployment result. No Vercel token, project binding or deployment/log connector was available. Production status remains unverified. The existing image, branding and live-email limitations remain unchanged.

## Photography integration follow-up

The five missing image routes now redirect to their specific, optimised Unsplash photograph when a local JPEG is absent. Downloaded local JPEGs still take precedence automatically. The shared source module is used by both the server and the downloader. There is no generated warehouse imagery. The privacy policy now explicitly describes direct external image requests. Browser error handling retains an obvious unavailable-photography label if the external source fails.

The runtime still denies Unsplash requests (HTTP 403), although the editable draft contains the domains. Real photographs therefore remain **visually unverified in this environment**. Correct redirect destinations and local-file precedence were checked by server tests; those checks do not establish that actual photo pixels loaded. Responsive and enquiry regression checks were run in Chromium, including deliberate source failure. Applying network access and inspecting actual photo content/crops remains required before photography sign-off.

## Animated hero background

Added a slow, CSS-only wash of teal, soft gold, muted rose and blue over the ivory hero background. The decorative layer is behind the existing content and photograph and cannot intercept pointer events. Chromium checks confirmed that the transform changes over time, the enquiry CTA still navigates, no horizontal overflow appears at 320/390/768/1024/1440/1920 px, and `prefers-reduced-motion: reduce` disables the animation. New hero-only screenshots are `artifacts/hero-gradient-desktop.png` and `artifacts/hero-gradient-mobile.png`. They show this environment's photography fallback; the gradient change does not alter image sources.

## More visible gradient movement

Refined the hero palette to seafoam/teal, aqua, sage and champagne gold, with stronger soft colour areas and two independently moving CSS layers. The main layer travels in a 12-second alternating cycle (16 seconds on small screens); the gold layer travels in a separate 16-second cycle. Chromium confirmed both transforms change during actual playback. Two screenshots four seconds apart showed a mean RGB change of 7.1 in the left-hand hero region, confirming visible colour movement rather than merely a declared animation. Overflow checks passed at 320/375/390/768/1024/1440/1595/1920 px. The CTA remained clickable and reduced-motion preference disabled both layers. Desktop/mobile hero screenshots were refreshed. Production deployment has not been verified from this network-restricted environment.
