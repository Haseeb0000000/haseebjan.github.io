# The Holiday Host

Premium, buildless static website for the existing GitHub Pages repository. No hosting provider migration or production deployment is part of this development branch.

## Work locally

- `npm run dev` starts the local preview at http://127.0.0.1:4173.
- `npm run build` regenerates committed HTML, sitemap, robots.txt, and contact configuration from `scripts/build.mjs` and `site.config.json`.
- `npm run check` checks local references, fragments, labels, page metadata, image budgets, and CNAME.

Requires Node 20+ and no package installation. GitHub Pages serves the committed root HTML directly; no runtime or build action is required.

## Editing

Edit shared layout and page content in `scripts/build.mjs`, styles in `assets/site.css`, and interactions in `assets/site.js`. Run build and check, then review the resulting HTML diff. All root paths use relative links compatible with the current custom domain.

Business contact details are copied from the original homepage at `009c54a`; they are not newly verified. Set `whatsapp` in `site.config.json` to an international digits-only number **only after owner confirmation** and update the Contact/FAQ copy accordingly, then regenerate. `null` keeps WhatsApp disabled. No external message is sent by the site.

## Enquiries

The static form validates user input and prepares a reviewable email draft and copyable text locally. Nothing is posted, stored, or claimed as received. The traveller must send the email. An actual form delivery service can be added later after the business selects a destination and privacy/retention practices.

## Publishing

Keep `CNAME` exactly as supplied (`theholidayhost.in`). Keep the current production branch/source unchanged until the owner approves the PR. Do not enable automatic merge or introduce a development-branch deployment action. See `LAUNCH-READINESS.md` for outstanding content and QA evidence.

## Images

Three existing repository photographs were retained and resized to 640px and 1000/1600px JPEG variants. The motorcycle image is explicitly illustrative; a verified Ladakh photo is still needed. Original photographer/licence records were not present. The owner must confirm rights for retained images or supply licensed replacements before launch. `Readme.txt` preserves the former template attribution record; the new HTML, CSS, scripts, and SVG mark are original replacements.
