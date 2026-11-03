# Proposed dashboard publishing connection — approval pending

The editor configuration saves content and uploaded photos to this repository. A saved content change needs a build before it appears in the generated website.

The proposed automation would:

1. Run after an owner/editor saves `content/`, uploaded photos or business settings on `main`.
2. Install the locked image dependency, optimize uploads, regenerate the static pages and run checks.
3. Commit the generated public HTML/assets back to `main` using the repository's built-in GitHub Actions token.
4. Request a build of the existing GitHub Pages site. Domain, DNS and hosting provider remain unchanged.

Required repository-token permissions: `contents: write` to save generated pages and `pages: write` to request the Pages build. No account credentials or personal access tokens would be stored in the website.

This is not enabled. Automatic approval review rejected enabling the persistent production-writing workflow without explicit owner approval of its scope. After approval, the exact workflow will be added under `.github/workflows/`, tested with a reversible content edit, and its live result verified.

Until then: saving in Pages CMS edits repository content only. It does not by itself rebuild the live pages. Ask for a website rebuild after saving.

The owner must also sign in at https://app.pagescms.org/ and connect the GitHub App to **only Haseeb0000000/haseebjan.github.io**. That external access grant is performed by the owner, not assumed by this configuration.
