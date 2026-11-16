# B2BT Academy public site (GitHub Pages)

Static public pages for B2BT Academy (decision 2026-11-16 in `docs/decisions.md` of the private academy repo).
Everything that stores data runs on the Academy server on Render; this site only shows pages and sends the
application form to `/api/public/apply/` there.

- `index.html` home page; the course and batch list is read live from the Academy.
- `apply.html` application form; if the Academy cannot be reached it links to the same form on the Academy.
- `assets/config.js` the Academy address (preview now; the real portal address at launch).
- `assets/b2bt-mark-reversed.svg` the chosen logo, unmodified (brief section 7.4).
- Dashed "Text from B2BT needed" boxes mark wording B2BT has not supplied yet. Nothing there is invented.

Preview address: academy-site-preview.bring2bettertech.com (see `CNAME`). The Academy must list this origin in
`ACADEMY_PUBLIC_SITE_ORIGINS`.
