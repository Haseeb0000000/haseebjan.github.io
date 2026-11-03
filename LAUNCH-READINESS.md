# Review and launch readiness

Development branch: `development/premium-holiday-host`.

## Repository audit

- Baseline `009c54a` on `main`: static root HTML, Bootstrap/template CSS and JS, stock/template assets; no package setup, application backend, tracked GitHub Actions workflow, or repository AGENTS.md.
- `CNAME` contains `theholidayhost.in` and is preserved byte-for-byte. Existing production source/settings have not been changed.
- Existing homepage carried `sales@theholidayhost.in`, displayed `+91-9186210167`, and Srinagar / Jammu and Kashmir / 190003. The old phone link omitted the country code; the new `tel:` uses `+919186210167` based on the displayed number. Owner must confirm ownership/reachability.
- Other pages contained a London demo address, fake US phone numbers, placeholder email, template titles, irrelevant destinations, and sample testimonials. Replaced the public pages and removed unused template directories/assets.
- Legacy `services.html`, `blog.html`, and `single.html` remain as useful navigation pages so old links do not become dead ends.
- GitHub Pages is compatible with the committed static root. No source workflow exists in this checkout. The connected GitHub metadata and CNAME can be inspected; the exact Pages settings (branch/folder, HTTPS enforcement, build status) require owner/admin confirmation because the connector does not expose the Pages settings endpoint. No DNS, domain, or settings writes were made.

## Built

Ivory/forest/gold responsive design, original SVG brand mark, destination overviews, three sample itinerary pages with day-by-day layouts, enquiries, About/Contact, FAQs, draft policies, accessible navigation, reduced-motion support, skip link, semantic headings, responsive JPEGs, metadata, social cards, sitemap, and robots.txt. No invented prices, registrations, review scores, guarantees, or testimonials.

## Owner input still needed

1. Confirm business email, phone, WhatsApp capability, full office address, and opening hours.
2. Legal business/trading name, registration/accreditation evidence if any, invoice details, and approved owner/team story.
3. Real package inclusions/exclusions, hotel and vehicle standards, current supplier arrangements, rates if desired, and availability.
4. Final payment, cancellation, refund, disruption, complaints, and privacy terms. Current policies are explicitly drafts and must not be treated as approved booking conditions.
5. Licensed destination photography, including verified Ladakh images; ownership/licence confirmation for the three carried-over photos. Genuine guest reviews only with consent and a verifiable source.
6. Confirm whether email-draft enquiry delivery is sufficient, or select and authorise a real delivery service with a tested inbox and retention policy.
7. Owner/admin confirms Pages production source and HTTPS in repository Settings → Pages before approving a merge. Keep current CNAME/DNS intact.

## Validation

Completed on 3 November 2026:

- `node scripts/build.mjs`, syntax checks for browser/build scripts, and `git diff --check` passed.
- `node scripts/check.mjs`: 17 pages, 450 local references, 55 image elements; titles, descriptions, canonical URLs, JSON-LD, form labels, sitemap, source sets, image size budgets, and preserved CNAME passed.
- Browser width checks: index, destinations, packages, Kashmir Escape, Ladakh Discovery, Contact, About, FAQ, and Privacy at 320, 768, and 1440px. No horizontal overflow or detected broken images in those 27 combinations. Desktop and 390px homepage screenshots were visually inspected.
- Fixed a 320px headline overflow and ensured hidden WhatsApp controls remain hidden despite button display styles.
- Mobile navigation opens and closes on link selection. Itinerary disclosure expands. Trip-specific enquiry link preselects the correct journey and destination.
- Empty required form submission is blocked. Valid example input generates an encoded email draft and a text-only review (including a script-shaped string rendered harmlessly as text). Copy reports success; edit hides the old summary and focuses the name field. No external enquiry was sent.
- No browser warning/error logs were captured in the final inspected session.
- Email inbox delivery, call reachability, external email-app behaviour, and WhatsApp capability were not tested. WhatsApp remains disabled. No claim of a WCAG audit, Lighthouse score, real-device coverage, or confirmed bookings is made.

GitHub metadata reports `has_pages: true`. The exact Pages source/HTTPS settings remain an owner/admin check. Production settings and main were not modified by this redesign.
