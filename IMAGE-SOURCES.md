# Photography source and licence record

**Status: linked for direct Unsplash CDN delivery when local copies are absent. Local downloads and visual verification remain blocked by runtime egress policy.** No generated warehouse imagery is used. Stock imagery must be labelled illustrative and must not imply ownership of pictured premises.

Source: Unsplash. Licence: https://unsplash.com/license (standard Unsplash licence; commercial use permitted, attribution appreciated but generally not required; no sale of unmodified photographs or compilation into a competing image service). Review the current licence and any subject-specific rights before launch. No Unsplash API is used.

| Local file | Source photograph URL | Intended use |
|---|---|---|
| `public/images/warehouse.jpg` | https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d | Warehouse hero/About image |
| `public/images/warehouse-contact.jpg` | Same photograph, smaller derivative | Contact composition |
| `public/images/electronics.jpg` | https://images.unsplash.com/photo-1546435770-a3e426bf472b | Headphones/category context |
| `public/images/household.jpg` | https://images.unsplash.com/photo-1507473885765-e6ed057f782c | Lighting/household context |
| `public/images/general.jpg` | https://images.unsplash.com/photo-1586023492125-27b2c045efd7 | General home goods context |

The download script requests JPEG output, 1600 px for the hero and 1000 px for other files at quality 82. Images are served locally, with dimensions specified and secondary images lazy loaded. Inspect subjects/crops once downloaded and correct alternative text if the source content differs. Downloaded image files and any source/author metadata should be retained with the site.

## Delivery

`public/image-sources.js` is the shared source of image IDs and optimisation parameters. The server first serves a downloaded local JPEG, if present. Otherwise it returns a temporary redirect to the exact Unsplash URL for that photograph. Browsers request Unsplash directly in that case; no image proxy or access-policy bypass is used. If the source cannot load, the browser shows an explicitly labelled unavailable-photography fallback. This fallback is not a successful photograph load. Run `npm run images:download` after runtime permission is applied to make delivery local without changing page markup.

## Product showcase artwork

The seven SVGs under `public/products/` (watch, car-charger, cable, earplugs, mouse, fm-p4, fm-q6) are original vector illustrations authored for this website, not third-party stock photographs or actual product photography. No brand logos, packaging artwork or product-specific certification marks are included. Cards and alternative text identify them as illustrations; exact models require owner confirmation. Their purpose is consistent interim presentation until actual product photos are supplied.

## Apple Watch charger studio image — 6 November 2026

`public/products/apple-watch-charger-studio.webp` replaces the watch illustration in rendered product cards. Source: the owner's attached charger image in this chat. The image-editing tool produced an AI-assisted studio-style edit preserving the recognisable white charging puck, USB-A plug and cable, removing promotional badges/text and arranging a coiled cable on warm ivory with soft shadows. This is edited product imagery, not an untouched source photograph. No series compatibility, cable-length, certification or official-brand claims were copied into the website.

The generated full-size PNG remains at `/workspace/generated_images/exec-694459bd-586b-4f14-9dda-77519dbabd71.png`. The web derivative is 1000 × 714 WebP, approximately 15 KB, converted with ImageMagick for delivery. Other products retain their labelled vector illustrations. The unused `watch.svg` is retained as a legacy asset.

## Generic studio illustrations — 6 November 2026

The following are AI-generated illustrative visuals, not downloaded online product photographs. The edited watch charger was used only as a style reference. Research was blocked; no exact product/connector configuration is confirmed. All three cards retain the visible “Illustrative image” label and descriptive alt text. Full source PNGs remain outside the checkout, with optimised 1000 px WebP derivatives committed for delivery.

| Website asset | Generated source PNG | Approximate size |
|---|---|---|
| `public/products/mini-car-charger-studio-illustration.webp` | `/workspace/generated_images/exec-2c43089e-67ae-411b-8918-3622cb39b747.png` | 22 KB |
| `public/products/yellow-cable-studio-illustration.webp` | `/workspace/generated_images/exec-e5d6822d-d946-4871-beff-848101a2efd4.png` | 25 KB |
| `public/products/rgb-mouse-studio-illustration.webp` | `/workspace/generated_images/exec-359f8270-b3ff-4399-86a0-92bcab637aca.png` | 23 KB |

3M earplugs, P4 and Q6 retain their existing vector illustrations pending model/reference confirmation. See PRODUCT-IMAGE-RESEARCH.md for the blocked research and remaining inputs.
