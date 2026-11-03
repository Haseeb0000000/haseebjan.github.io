# The Holiday Host

Original static travel website for Kashmir, Ladakh, and Jammu: 36 pages, 12 proposed journeys, guide prices, search/filters, route and itinerary pages, date requests, gallery dialogs, planning guides, and WhatsApp/email enquiries.

## Work locally

Requires Node 20+; no package installation needed.

- `npm run build` regenerates the root HTML, sitemap, contact configuration, and catalogue JSON.
- `npm run check` checks local links/fragments, page metadata, labels, image references/budgets, catalogue durations/prices, and unchanged CNAME.
- `npm run dev` serves http://127.0.0.1:4173 for local review.
- `npm run package` builds/checks and prepares allowlisted public files in ignored `dist/` for optional Cloudflare hosting. It does not deploy.

## Edit

- `data/trips.mjs`: proposed routes, itinerary days, prices, and inclusion/exclusion lists.
- `site.config.json`: owner contact and price-disclaimer settings. Phone and WhatsApp are +91 99062 69900, supplied by the owner on 3 November 2026.
- `scripts/build.mjs`: shared layout and all page content.
- `assets/site.css` and `assets/site.js`: responsive design and browser interactions.
- `data/policies.json`: policy drafts; final business-approved terms still needed.

The form prepares messages locally. It does not send data to a server, save personal data in browser storage, accept payment, reserve seats, or claim that an enquiry has been received. Required fields are disabled until the script/configuration load, so a no-JavaScript submission cannot leak user details into URL query parameters. Direct email/WhatsApp links remain available.

## Review and hosting

Work is on `development/regional-adventures`, based on the published main branch. Preserve `CNAME` (`theholidayhost.in`). GitHub Pages can serve the committed root HTML as before. Do not merge or publish this revision until approved. No Cloudflare resource or DNS changes were made; the owner may supply a different Cloudflare account later.

See `PRICING.md` for price snapshots/assumptions, `FEATURES.md` for the reference feature map and hosting decision, and `LAUNCH-READINESS.md` for validation and outstanding content.

## Photography

New Pangong and Patnitop images are attributed on `credits.html` with source/licence/adaptation details. Three prior repository photos remain pending owner licence confirmation. The former template attribution record in `Readme.txt` is retained as historical provenance; the public design/code is original.
