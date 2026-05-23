# Atelier – Summary

This is a luxury interior design studio landing page built with pure **HTML, CSS, and vanilla JavaScript** — no frameworks, no build step. Here are the key highlights:

## Core Features

**Visual & Layout**
- Full-screen hero with animated headline, parallax image zoom, and a glassmorphism stats bar (350+ projects, 12 years, 98% satisfaction)
- Alternating section backgrounds (cream / warm beige) maintain rhythm across six content sections
- CSS custom properties drive every color, font, radius, shadow, and spacing value for the entire design system

**Portfolio & Gallery**
- Filterable image grid across four categories: Living Room, Bedroom, Office, Kitchen
- Hover overlays reveal project title and category with a smooth gradient lift
- Lightbox with keyboard navigation (← → Esc) and touch swipe; only cycles currently-visible (filtered) items

**Testimonials**
- Auto-playing carousel at 5 000 ms intervals with dot indicators
- Pauses on hover, supports touch swipe on mobile

**Enquiry Form**
- Client-side validation on name, email, and message before submission
- Submits via `fetch()` to FormSubmit.co with loading state, success notification, and error fallback
- Honeypot field for spam protection

**UI Enhancements**
- Dark / light mode toggle persisted to `localStorage`
- Animated statistics counter using eased `requestAnimationFrame` on hero intersection
- Scroll-triggered fade-up / fade-left / fade-right animations via `IntersectionObserver`
- Floating WhatsApp button and back-to-top button
- Sticky transparent navbar that frosts on scroll

**Technical Stack**
HTML5, CSS3 (custom properties, grid, clamp), vanilla JavaScript (ES2020+), Font Awesome 6, Google Fonts (Playfair Display + Inter), FormSubmit.co.
