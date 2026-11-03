# The Holiday Host

Original static travel website for Kashmir, Ladakh, and Jammu: 50 pages, 26 proposed journeys, guide prices, search/filters, route and itinerary pages, date requests, gallery dialogs, planning guides, and WhatsApp/email enquiries.

## Work locally

Requires Node 20+; no package installation needed.

- `npm run build` regenerates the root HTML, sitemap, contact configuration, and catalogue JSON.
- `npm run check` checks local links/fragments, page metadata, labels, image references/budgets, catalogue durations/prices, and unchanged CNAME.
- `npm run dev` serves http://127.0.0.1:4173 for local review.
- `npm run package` builds/checks and prepares allowlisted public files in ignored `dist/` for optional Cloudflare hosting. It does not deploy.

## Edit

- `content/trips/*.json`: editable proposed routes, itinerary days, prices, and inclusion/exclusion lists. `data/trips.mjs` loads this collection.
- `site.config.json`: owner contact and price-disclaimer settings. Phone and WhatsApp are +91 99062 69900, supplied by the owner on 3 November 2026.
- `scripts/build.mjs`: shared layout and all page content.
- `assets/site.css` and `assets/site.js`: responsive design and browser interactions.
- `data/policies.json`: policy drafts; final business-approved terms still needed.

The form prepares messages locally. It does not send data to a server, save personal data in browser storage, accept payment, reserve seats, or claim that an enquiry has been received. Required fields are disabled until the script/configuration load, so a no-JavaScript submission cannot leak user details into URL query parameters. Direct email/WhatsApp links remain available.

## Review and hosting

Work is on `development/visual-photo-correction`, based on the published main branch. Preserve `CNAME` (`theholidayhost.in`). GitHub Pages can serve the committed root HTML as before. Do not merge or publish this revision until approved. No Cloudflare resource or DNS changes were made; the owner may supply a different Cloudflare account later.

See `PRICING.md` for price snapshots/assumptions, `FEATURES.md` for the reference feature map and hosting decision, and `LAUNCH-READINESS.md` for validation and outstanding content.

## Photography

Displayed photographs are licence-verified, with 31 distinct Commons sources plus the prior licensed Pangong/Patnitop photos. Each of the 26 trips has a distinct cover; checks reject repeated photographs within a public page. Source, author, licence and adapted sizes appear on `credits.html`. The former template attribution record in `Readme.txt` is retained as historical provenance.

## Online editing update

Current development branch: `development/content-dashboard-photos`. See `DASHBOARD-GUIDE.md` for the prepared Pages CMS editor and `REFERENCE-COMPARISON.md` for the 124-page reference inventory. Homepage, destination pages, trip details and page wording/photos now use editable JSON under `content/`. Run `npm ci` once, then `npm run build` and `npm run check`; Sharp optimizes owner photo uploads during the build. `node scripts/check-editor.mjs` verifies a reversible edit/upload and restores real content.

The owner must connect the external editor's GitHub App. Automatic production rebuilding was explicitly approved on 3 November 2026 and is configured in `.github/workflows/content-publish.yml`; scope and usage are described in `PUBLISHING-PROPOSAL.md` and `DASHBOARD-GUIDE.md`. No Cloudflare, DNS or domain change was made.
