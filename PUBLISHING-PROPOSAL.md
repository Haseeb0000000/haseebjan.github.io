# Automatic dashboard publishing — owner approved 3 November 2026

The editor configuration saves content and uploaded photos to this repository. A saved content change needs a build before it appears in the generated website.

The approved automation will:

1. Run after an owner/editor saves `content/`, uploaded photos or business settings on `main`.
2. Install the locked image dependency, optimize uploads, regenerate the static pages and run checks.
3. Commit the generated public HTML/assets back to `main` using the repository's built-in GitHub Actions token.
4. Request a build of the existing GitHub Pages site. Domain, DNS and hosting provider remain unchanged.

Required repository-token permissions: `contents: write` to save generated pages and `pages: write` to request the Pages build. No account credentials or personal access tokens would be stored in the website.

The owner explicitly approved this scope in chat. The implementation is `.github/workflows/content-publish.yml`. It runs only for main-branch content/source changes or a manual rebuild. The initial permission block is resolved by that approval.

After saving in Pages CMS on main, follow **Publish dashboard changes** in the repository Actions page. The editor also offers a **Rebuild & publish website** button for retrying after a corrected error. Checks must pass before generated pages are saved and the Pages build is requested. No domain, DNS or hosting-provider change is made.

The owner must also sign in at https://app.pagescms.org/ and connect the GitHub App to **only Haseeb0000000/haseebjan.github.io**. That external access grant is performed by the owner, not assumed by this configuration.
