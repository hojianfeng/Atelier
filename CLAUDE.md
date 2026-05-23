# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the site

No build step — open `index.html` directly in a browser:

```bash
open index.html                        # macOS default browser
open -a "Google Chrome" index.html     # force Chrome
python3 -m http.server 8080            # serve locally (avoids some fetch() CORS issues)
```

Use a local server (`python3 -m http.server`) when testing the enquiry form, because `fetch()` to FormSubmit.co is blocked by some browsers when running from a `file://` URL.

## Architecture

Three files, no framework, no bundler:

| File | Role |
|------|------|
| `index.html` | All markup and section order. Sections appear in DOM order: navbar → hero → about → services → portfolio → testimonials → contact → footer → lightbox modal (hidden) → floating buttons. |
| `style.css` | All visual styling. Organized top-to-bottom matching section order. CSS custom properties drive every color, font, spacing, and shadow value. |
| `script.js` | All behaviour, wrapped in a single `DOMContentLoaded` listener. Uses two micro-helpers (`$` / `$$`) instead of a library. |

### Theming system (`style.css`)

All colors are CSS custom properties on `:root` (light) and `[data-theme="dark"]`. The `data-theme` attribute lives on `<html>`. When adding any new color, always use a variable — never a hard-coded hex except inside the variable declaration itself. The gold accent (`--clr-primary: #C9A96E`) is the brand color used for highlights, icons, and CTAs.

### Scroll animation pattern

Any element given a class of `fade-up`, `fade-left`, or `fade-right` starts invisible and off-axis. `script.js` uses a single `IntersectionObserver` to add `.visible` when the element enters the viewport, which triggers the CSS transition. Staggered delays are set via the CSS custom property `--delay` inline on each element (`style="--delay: 0.1s"`).

### Portfolio filter + lightbox relationship

Portfolio items carry a `data-category` attribute (`living-room`, `bedroom`, `office`, `kitchen`). The filter buttons toggle the `.hidden` class on non-matching items. The lightbox's item list (`lightboxItems`) is rebuilt from `.portfolio-item:not(.hidden)` every time a filter is applied (350 ms after the hide animation completes), so lightbox prev/next navigation only cycles visible items.

### Testimonials slider

The slider is CSS `transform: translateX` on `#testimonialsTrack`. Dots are created dynamically in JS. Auto-play uses `setInterval` at 5 000 ms; the interval is cleared on `mouseenter` and restarted on `mouseleave` and on manual navigation.

### Form submission (`script.js` → FormSubmit.co)

The form POSTs JSON to `https://formsubmit.co/ajax/{email}` via `fetch()`. The current recipient email is `hojianfeng1@gmail.com`. FormSubmit requires a one-time email confirmation on the very first submission before it goes live. The honeypot field (`name="_honey"`) is present in the HTML for spam protection. The `_captcha: 'false'` and `_template: 'box'` keys are FormSubmit control fields passed in the JSON body.

## Key conventions

- **No jQuery, no frameworks** — use the `$`/`$$` helpers defined at the top of `script.js`.
- **New sections** must get a unique `id` matching a `href="#id"` in the navbar, and their heading elements should use `.section-eyebrow` + `.section-heading` + `.section-sub` for consistent typography.
- **Adding a portfolio item**: copy an existing `.portfolio-item` div, set `data-category` to one of the four filter values, update `src`, `alt`, `.portfolio-cat`, and `.portfolio-title`. The lightbox and filter will pick it up automatically.
- **Dark-mode overrides**: place component-specific dark overrides directly below the light styles using `[data-theme="dark"] .component { }` — do not consolidate them into the dark theme variable block at the top.
- **z-index layers**: navbar 900 → mobile overlay 1000 → lightbox backdrop 1100 → lightbox 1200 → lightbox controls 1300. Floating buttons (WhatsApp, back-to-top) sit at 800.
