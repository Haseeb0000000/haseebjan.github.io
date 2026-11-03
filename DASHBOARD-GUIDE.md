# Owner dashboard

Start at **https://theholidayhost.in/admin.html** or **https://app.pagescms.org/**.

## First sign-in

The owner signs in with GitHub, accepts the service's account terms and connects the Pages CMS GitHub App to **only `Haseeb0000000/haseebjan.github.io`**. Choose the `main` branch. The repository already contains `.pages.yml`; do not replace it with a starter configuration.

The hosted editor is provided by Pages CMS. No website password or GitHub token is placed in the public site. Repository access is granted by the owner through GitHub.

## Editing

- **Homepage:** main headline, highlighted words, introduction, hero upload and featured trip IDs.
- **Trips & itineraries:** select a trip; edit its title, guide price, route, highlights, inclusions, exclusions, group information and each day. The itinerary length sets the displayed day/night count.
- **Trip planning details:** the same editor now includes suggested starts, sample overnight plans, hotel examples and detailed meals/vehicle/room/child/upgrade information. Suggested dates are not confirmed seats or official event dates.
- **Draft policies & payment terms:** edit booking, payment, cancellation/refund and privacy sections. Defaults are proposals for review and adoption in written quotes, not proof of supplier terms or legal certification.
- **Destination pages:** introductions, highlights and a replacement cover.
- **Page wording & SEO:** search descriptions, plain-text wording and per-page photo replacements. The original matching key is read-only; edit “Your wording”. Existing layout is preserved. Some shared trip information is edited in Trips instead.
- **Business contact details:** email, phone, WhatsApp and address. Use country-code digits for WhatsApp, for example `919906269900`.
- **Your photo library:** upload JPG, PNG or WebP from the computer. Use photos you own or have permission to publish. The public repository must not contain private customer files.

Cover uploads replace the stock cover for that trip or destination. Add a useful photo description. Uploads are rotated, stripped of embedded metadata, resized to responsive variants (up to 1280px) and compressed during the website build. Avoid selecting the same photo for multiple trips or repeating a cover in its gallery: the checks reject that.

## Publishing status

**Automatic publishing was approved by the owner on 3 November 2026.** Saving content on the main branch starts the publishing job: optimize photos, build pages, run checks, save generated pages, and request the existing GitHub Pages build.

Follow progress through **View publishing status** on the owner entry page. Pages CMS also has a **Rebuild & publish website** button for a manual retry. If validation fails, correct the reported content issue and save again. Use distinct photos and valid positive guide prices.

The owner still needs to complete GitHub sign-in and connect the Pages CMS GitHub App. Authentication and the external access grant are not performed by the website configuration.

The website's GitHub Pages hosting and CNAME are preserved. No Cloudflare account is needed for this setup.

## Verified locally

`node scripts/check-editor.mjs` exercises a reversible content change and test upload: image optimization, alt text, escaped text and the unchanged trip layout. It restores the real content and removes its fixture. The full site checker verifies unique photos, links, labels and metadata.

References: [Pages CMS quick start](https://pagescms.org/docs/quick-start/), [configuration](https://pagescms.org/docs/configuration/), [media](https://pagescms.org/docs/configuration/media/).
