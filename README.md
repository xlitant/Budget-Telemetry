# Budget Telemetry — PWA setup

A self-contained personal web app. No build step, no npm, no account. Host these
files anywhere static and install to your Android home screen.

## Files

| File | Purpose |
|---|---|
| `index.html` | The whole app (React + d3 from CDN, Babel transpiles in-browser) |
| `manifest.json` | Makes it installable — name, icons, standalone display |
| `sw.js` | Service worker; caches everything so it works offline |
| `icon-192.png`, `icon-512.png`, `icon-512-maskable.png` | Home screen icons |
| `app.jsx` | The unminified source, for reference/editing only — not loaded at runtime |

## Deploy (GitHub Pages — free, ~5 min)

1. Create a new GitHub repo (private is fine — Pages still works on free accounts
   for public repos; use public if Pages is unavailable on yours).
2. Upload `index.html`, `manifest.json`, `sw.js`, and the three `icon-*.png` files
   to the repo root.
3. Repo **Settings → Pages → Source: Deploy from a branch → `main` / `(root)` → Save**.
4. Wait ~1 minute. Your URL will be `https://<username>.github.io/<repo>/`.

**Netlify alternative:** drag the folder onto https://app.netlify.com/drop — instant
URL, no repo needed.

HTTPS is required for service workers, which both of the above provide automatically.

## Install on Android

1. Open the URL in **Chrome** on your phone.
2. Tap **⋮ → Add to Home screen** (may appear as "Install app").
3. Launch from the home screen — it opens fullscreen with no browser UI.

After the first load it works offline, including on airplane mode.

## Your data

Saved via `localStorage` under the key `holdings:v1`, on-device only. Nothing is
transmitted anywhere. Note that clearing Chrome's site data will erase it, so if
the numbers matter, keep a copy of the figures somewhere else too.

## Editing later

Edit `index.html` directly — the app source is inline near the bottom, inside the
`<script type="text/babel">` block. After any change, **bump the `CACHE` version
string in `sw.js`** (e.g. `v1` → `v2`), or phones will keep serving the old cached
copy.

## Notes

- Babel transpiles JSX at load time, which adds roughly a second to the first paint.
  Acceptable for personal use; precompiling would remove it if it ever bothers you.
- The three CDN scripts are cached by the service worker on first run, so the app
  isn't dependent on them being reachable afterwards.
