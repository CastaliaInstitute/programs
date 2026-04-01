# Programs

This repository is the public catalog for Castalia programs sold to institutions.

## Stack

- Astro site in `web/`
- Shared Castalia shell via vendored `@castalia/platform`
- GitHub Pages deployment from `.github/workflows/pages.yml`
- Custom domain via `CNAME` set to `programs.castalia.institute`

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
