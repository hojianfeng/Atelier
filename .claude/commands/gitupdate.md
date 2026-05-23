---
description: "Safely push to GitHub: scan for secrets, rewrite README in reference style, verify Pages workflow, update repo About, then commit and push."
---

You are running the `/gitupdate` command for this project. Execute every step below in order. Stop and report to the user if any step fails before continuing.

## Step 1 — Secret scan (MANDATORY — abort if anything is found)

Run the following grep patterns against all git-tracked files (use `git ls-files`). Flag any match that looks like a real secret — not an example, not a placeholder, not a public-facing contact email used in a form action.

Patterns to scan for:
- Private keys or tokens: `sk-`, `pk-`, `Bearer `, `api_key`, `apikey`, `API_KEY`, `access_token`, `secret_key`, `private_key`, `-----BEGIN`
- Hardcoded passwords: `password\s*=\s*["'][^"']{4,}`, `passwd\s*=`
- Auth/session secrets: `AUTH_SECRET`, `JWT_SECRET`, `SESSION_SECRET`
- Cloud credentials: `AKIA` (AWS key prefix), `ghp_`, `gho_`, `github_pat_`
- `.env` files committed by mistake: any file literally named `.env` or `.env.local` tracked by git

Run this scan:
```bash
git ls-files | xargs grep -rlE "(sk-ant|sk-|pk-|Bearer [a-zA-Z0-9]{20}|api_key\s*=|API_KEY\s*=|access_token\s*=|secret_key\s*=|private_key\s*=|AUTH_SECRET\s*=|JWT_SECRET\s*=|AKIA[A-Z0-9]{16}|ghp_[a-zA-Z0-9]{36}|github_pat_|-----BEGIN (RSA|EC|OPENSSH|PGP) PRIVATE)" 2>/dev/null
```

Also check for accidentally tracked sensitive files:
```bash
git ls-files | grep -E "^\.env(\.local|\.production|\.development)?$"
```

**If any real secret is found:** Stop immediately. Tell the user exactly which file and line contains the suspected secret, and do NOT proceed with the push. Suggest they run `git rm --cached <file>` and add it to `.gitignore`.

**If nothing is found:** Proceed to Step 2.

## Step 2 — Rewrite README.md

Read the current `index.html` to understand project content (sections, features, tech). Then rewrite `README.md` following this exact structure and style (adapted from https://github.com/alfredang/ai-cms):

```markdown
<div align="center">

# Lumière Interiors

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2020-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Font Awesome](https://img.shields.io/badge/Font_Awesome-6-528DD7?logo=fontawesome&logoColor=white)](https://fontawesome.com/)
[![FormSubmit](https://img.shields.io/badge/FormSubmit.co-Form_API-4CAF50)](https://formsubmit.co/)
[![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-Live-222222?logo=github)](https://pages.github.com/)
[![License](https://img.shields.io/badge/License-MIT-blue)](#license)

**A luxury interior design studio landing page — no frameworks, no build step. Pure HTML, CSS, and vanilla JavaScript with dark-mode, scroll animations, a filterable portfolio gallery with lightbox, and a live enquiry form.**

🌐 **Live site:** _your GitHub Pages URL here_

</div>

## Screenshot

<!-- Replace with an actual screenshot once the site is live -->
![Screenshot](screenshot.png)

## About

Lumière Interiors is a single-page marketing site for a luxury interior design studio. Every visual detail — the gold accent palette (`#C9A96E`), the glassmorphism hero stats bar, the parallax image zoom — is designed to communicate high-end craft.

The entire design system is driven by CSS custom properties so a rebrand is a one-line change. Dark mode is persisted to `localStorage` and toggled without a flash. Scroll-triggered animations (`fade-up`, `fade-left`, `fade-right`) use a single `IntersectionObserver` with staggered CSS delays. The portfolio filter and lightbox share a live item list so previous/next navigation always cycles only the currently-visible category.

No jQuery, no framework, no bundler. Open `index.html` and it works.

## Key Features

### Portfolio & Lightbox
- Filterable grid across four categories (Living Room, Bedroom, Office, Kitchen)
- Hover overlays reveal project title and category with a gradient lift effect
- Lightbox with keyboard navigation (← → Esc) and touch-swipe support
- Lightbox item list rebuilt from visible items on every filter change

### Testimonials Slider
- Auto-advancing carousel at 5 000 ms intervals with dot indicators
- Pauses on `mouseenter`, resumes on `mouseleave` and manual navigation
- CSS `translateX` driven — no JS animation loop

### Scroll Animations
- `fade-up`, `fade-left`, `fade-right` classes — invisible and off-axis by default
- Single `IntersectionObserver` adds `.visible` when element enters viewport
- Staggered delays via inline `--delay` CSS custom property

### Enquiry Form
- Client-side validation on name, email, and message
- POSTs JSON to FormSubmit.co via `fetch()` with loading state, success banner, and error fallback
- Honeypot field (`_honey`) for spam protection; `_captcha: false` suppresses reCAPTCHA

### UI Polish
- Dark / light mode toggle persisted to `localStorage`, zero flash on load
- Sticky frosted-glass navbar (backdrop-filter on scroll)
- Animated statistics counter (eased `requestAnimationFrame`) in the hero section
- Floating WhatsApp button and back-to-top button at z-index 800

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Markup** | HTML5 (semantic sectioning elements) |
| **Styling** | CSS3 — custom properties, Grid, Flexbox, `clamp()` |
| **Behaviour** | Vanilla JavaScript ES2020+ (no framework, no jQuery) |
| **Icons** | Font Awesome 6 (CDN) |
| **Fonts** | Google Fonts — Playfair Display + Inter |
| **Form backend** | FormSubmit.co (no server required) |
| **Hosting** | GitHub Pages via GitHub Actions |

## Architecture

Three files, no build step:

| File | Role |
|------|------|
| `index.html` | All markup. Sections in DOM order: navbar → hero → about → services → portfolio → testimonials → contact → footer → lightbox modal (hidden) → floating buttons. |
| `style.css` | All styles. Organized top-to-bottom matching section order. CSS custom properties drive every color, font, spacing, and shadow. |
| `script.js` | All behaviour, wrapped in a single `DOMContentLoaded` listener. `$`/`$$` micro-helpers replace jQuery. |

### Theming system
All colors are CSS custom properties on `:root` (light) and `[data-theme="dark"]`. The `data-theme` attribute lives on `<html>`. Gold accent `--clr-primary: #C9A96E` is the brand color used for highlights, icons, and CTAs.

### z-index layers
navbar 900 → mobile overlay 1000 → lightbox backdrop 1100 → lightbox 1200 → lightbox controls 1300. Floating buttons at 800.

## Quick Start

No installation required.

```bash
# Open directly in your default browser
open index.html

# Force a specific browser
open -a "Google Chrome" index.html

# Serve locally (recommended for testing the enquiry form — avoids fetch() CORS issues on file://)
python3 -m http.server 8080
# then visit http://localhost:8080
```

### Enquiry form note
FormSubmit.co requires a **one-time email confirmation** on the very first submission before it delivers messages. Check the inbox for the configured recipient email after the first test submission.

## Deployment

The site deploys automatically to GitHub Pages on every push to `main` via `.github/workflows/pages.yml`.

To deploy manually:
1. Push to `main` — the workflow triggers automatically.
2. After the first push, enable GitHub Pages in **Settings → Pages → Source: GitHub Actions**.
3. The live URL will be `https://<username>.github.io/<repo>/`.

## Adding Content

### New portfolio item
Copy an existing `.portfolio-item` div in `index.html`. Set `data-category` to one of `living-room`, `bedroom`, `office`, `kitchen`. Update `src`, `alt`, `.portfolio-cat`, and `.portfolio-title`. The filter and lightbox pick it up automatically — no JS changes needed.

### New section
Give it a unique `id` matching a `href="#id"` in the navbar. Use `.section-eyebrow` + `.section-heading` + `.section-sub` for consistent heading typography.

### New color
Always add a CSS custom property in `:root` (and a `[data-theme="dark"]` override if needed). Never use a hard-coded hex value outside the variable declaration.

## Security Notes

- **No secrets in the repo** — the FormSubmit recipient email is a public-facing contact address, not a credential.
- **Spam protection** — the enquiry form includes a honeypot field (`name="_honey"`) and submits with `_captcha: false` to suppress reCAPTCHA while still blocking bots.
- **No server-side code** — there is no backend, no database, and no authentication surface. The attack surface is limited to the static HTML/CSS/JS served over GitHub Pages.

## License

MIT
```

Write exactly this README (adjusting the live site URL once you know the GitHub Pages URL from the remote — see Step 4). Do not leave placeholder text; replace `_your GitHub Pages URL here_` with the actual Pages URL derived from the remote.

## Step 3 — Verify GitHub Actions Pages workflow

Check that `.github/workflows/pages.yml` (or any file in `.github/workflows/`) contains a job that:
- Triggers on push to `main`
- Has `pages: write` and `id-token: write` permissions
- Uses `actions/deploy-pages`

If the workflow file already exists and is correct (it does in this project), leave it unchanged. If it is missing or broken, create `.github/workflows/pages.yml` with this content:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: .

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## Step 4 — Determine repo details and Pages URL

Run:
```bash
gh repo view --json name,owner,description,homepageUrl,repositoryTopics
```

From the output, derive:
- `OWNER` — the login field inside `owner`
- `REPO` — the `name` field
- `PAGES_URL` — `https://<OWNER>.github.io/<REPO>/`

Use `PAGES_URL` to fill in the README live site badge and link (go back and update the README if needed).

## Step 5 — Update repo About (description, website, topics)

Run this command (fill in the actual owner/repo from Step 4):
```bash
gh repo edit \
  --description "Luxury interior design studio landing page — pure HTML, CSS & vanilla JS. Dark mode, filterable portfolio gallery, lightbox, scroll animations, live enquiry form. No frameworks, no build step." \
  --homepage "<PAGES_URL>" \
  --add-topic "landing-page" \
  --add-topic "interior-design" \
  --add-topic "html5" \
  --add-topic "css3" \
  --add-topic "vanilla-javascript" \
  --add-topic "dark-mode" \
  --add-topic "github-pages" \
  --add-topic "portfolio"
```

If `gh repo edit` returns an error about topics (GitHub limits repos to 20 topics), reduce the list.

## Step 6 — Stage, commit, and push

```bash
git add README.md .github/workflows/pages.yml
git status
```

Check `git status` output. If there are other modified files the user likely wants to push (e.g., `index.html`, `style.css`, `script.js`), stage those too — but **never** stage:
- `.env`, `.env.*`, `.env.local`
- Any file containing secrets found in Step 1

Commit:
```bash
git commit -m "$(cat <<'EOF'
chore: update README, verify Pages workflow, update repo About

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

Then push:
```bash
git push origin main
```

## Step 7 — Report results

After pushing, tell the user:
1. Whether any secrets were found (and which files if so)
2. The README was updated and what changed
3. Whether the Pages workflow was already present or was created
4. The repo About fields that were set
5. The GitHub Pages URL where the site will be live
6. A reminder that GitHub Pages must be enabled once under **Settings → Pages → Source: GitHub Actions** if this is the first deploy
