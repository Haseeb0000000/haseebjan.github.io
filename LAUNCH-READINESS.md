# Regional adventures review

Branch: `development/regional-adventures`, based on published main `b358acff7c07b034968a10f4a8b82206f2af580f`. This revision is for review, not automatically published. CNAME and production/DNS settings are preserved.

## Scope

- 36 pages and 12 proposed trips across Kashmir, Ladakh, and Jammu.
- Search, region/style/duration filters, guide-price sorting, date requests, detailed routes, expandable itinerary days, proposed meal/stay/inclusion/exclusion information, packing notes, FAQs, related trips, gallery dialogs, planning guides, and mobile navigation/enquiry controls.
- Phone/WhatsApp +91 99062 69900 supplied by the owner. Earlier phone number replaced everywhere in public output.
- Nine owner-authorised guide prices about 5% below observed Wildfloc benchmarks; three Jammu prices on request. No fake discounts, ratings, customer counts, seat counts, or departure dates.
- Policy drafts and legacy navigation pages use noindex. Canonical URLs, social metadata, structured data, responsive images, sitemap, reduced motion, labels, skip link, and native accessible disclosures/dialogs are included.
- Cloudflare-compatible static packaging prepared. Existing connected account inspected read-only; **no Cloudflare deployment/domain/DNS/resource writes**. Owner may connect a different account later.

## Before publishing

1. Review this revision and approve its publication.
2. Confirm supplier costing, margin, occupancy basis, named stays, vehicles, taxes/mandatory charges, activities, guide staffing, permits, and operational feasibility. Guide prices are not confirmed offers.
3. Supply actual departure dates and seats if fixed departures are desired. Current implementation is availability requests only.
4. Provide final legal/trading name, registration evidence if applicable, full office address, opening hours, email ownership confirmation, payment/cancellation/refund/privacy terms, and complaints procedure.
5. Provide owner/team content, approved founder video/social URLs, and genuine consented reviews if these sections should contain real material.
6. Confirm rights to carried-over Dal Lake/valley/motorcycle photographs or replace them. New Pangong/Patnitop images have documented Commons licences and public attribution.
7. For Cloudflare, connect and verify the chosen alternate account first; test its preview before any custom-domain cutover. Existing GitHub Pages production is unchanged.

## Validation

- Build and syntax checks pass. Static checker passes 36 pages, 1,794 local references, 227 image elements, unique page metadata, JSON-LD, labels, sitemap, responsive image references, image budgets, catalogue duration/price invariants, owner WhatsApp target, and unchanged CNAME.
- Browser functional checks: homepage search returns six Kashmir proposals; combined Ladakh/Motorcycle filters return one; incompatible duration produces the empty state; clear restores twelve; guide-price sorting puts price-on-request proposals last.
- Expand-all opens seven itinerary days. Preferred date transfers from the booking card into the enquiry form. Empty submission is blocked. Valid test data creates an encoded WhatsApp link to the owner number and an email draft. Script-shaped input remains text; copy/edit work. No external message is sent.
- Gallery opens and closes successfully. Forty responsive combinations were checked: ten representative pages at 320, 390, 768, and 1440px. A mobile trip-content overflow from grid intrinsic sizing was corrected with `min-width: 0`; all six affected combinations were rerun and now fit the viewport. No broken image was detected.
- Mobile navigation opens, destination submenu works, and navigation closes after selecting Jammu. The departure request transfers the selected destination and future date to the enquiry form. No browser warning/error log was captured in the final session.
- Desktop/mobile screenshots are kept locally in ignored `qa-artifacts/`. The preview is stopped after review; use `npm run dev` to reopen it.
- Verification does not assert inbox delivery, a real reservation, live supplier availability, real-device coverage, a formal accessibility audit, or a Lighthouse score.
