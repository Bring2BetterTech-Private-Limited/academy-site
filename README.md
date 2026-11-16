# B2BT Academy public site (GitHub Pages)

The landing page and the application form for B2BT Academy, served instantly by GitHub Pages at
**https://academy-preview.bring2bettertech.com** (decision 2026-11-16 in the private academy repository).
Sign-in, the learner/trainer/admin portals and everything that stores data run on the Academy server at
**https://portal-preview.bring2bettertech.com** (Render).

- `index.html` landing page. Wording is B2BT's own, from bring2bettertech.com/academy. Open batches are added
  from the Academy when it answers; the page is complete without them.
- `apply.html` application form; sends to `/api/public/apply/` on the Academy. If the Academy cannot be reached,
  it links to the same form on the Academy.
- `assets/config.js` the Academy server address.
- `assets/b2bt-mark-reversed.svg` the chosen logo, unmodified (brief section 7.4).

Publish changes with `scripts/publish_site.sh` from the private academy repository. It adds a commit on top of the
live `main` branch, because GitHub commits the `CNAME` file there when the domain is changed in Settings > Pages.
