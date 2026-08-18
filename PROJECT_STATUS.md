# Programs project status

Updated: 2026-07-29  
Repository: `CastaliaInstitute/programs`  
Public URL: https://programs.castalia.institute/

## Current state

- **Readiness:** Active Astro catalogue and institutional procurement site.
- **Validated source:** Pages build in `web/`; catalog, AIMA, IMSCC viewer, FAQ, institutions, and purchase routes are present. GitHub Actions is the intended deployment path.
- **Change in this review:** Added an editorial reading-room hero image grounded in real academic materials and a responsive overlay that preserves copy contrast.
- **Commercial caveat:** Purchase availability is gated in source; the page must not imply a course is for sale while its gate is closed.

## Risks and next actions

1. Run the Astro build and route smoke tests before publishing.
2. Verify every displayed price and purchase link against the current institutional contract.
3. Add a last-reviewed timestamp to catalog data so stale course claims are visible.

Art provenance: generated editorial image, saved at `web/public/assets/programs-reading-room.png`.
