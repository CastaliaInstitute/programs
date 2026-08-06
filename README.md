# Programs

This repository is the public catalog for Castalia programs sold to institutions.

## Stack

- Astro site in `web/`
- Shared Castalia shell via vendored `@castalia/platform`
- **Cloudflare Pages** deployment from `.github/workflows/cloudflare-pages.yml` (`wrangler.toml`);
  serves the static site plus the repo-root `functions/` purchase-fulfillment API. The legacy
  GitHub Pages workflow (`pages.yml`) is manual-only during cutover.
- Custom domain `programs.castalia.institute`
- Purchase → repo provisioning: see `COURSE-PURCHASE-FULFILLMENT.md`, `functions/`, `fulfillment/`

## Local development

```bash
cd web
npm install
npm run dev
```

## Publishing

Push to `main` to trigger the GitHub Pages workflow. In the GitHub repository settings, enable
Pages with GitHub Actions as the source, then point DNS for `programs.castalia.institute` at the
resulting GitHub Pages target.
