# Technical Constraints

## Stack
- **HTML5** — structure and semantics only.
- **CSS3** — all styling. One file: `css/style.css`.
- **Vanilla JavaScript (ES2020+)** — all behaviour. One file: `js/script.js`.
- **No frameworks, no libraries, no build tools, no transpilers.**
- **No backend server.** The app runs as static files opened directly in a browser.

## Storage
- **Browser Local Storage only.** Every piece of user data (name, theme preference, tasks, links) is stored client-side via `localStorage.setItem` / `getItem`.
- Storage keys: `dash-name`, `dash-theme`, `dash-tasks`, `dash-links`.
- All reads are wrapped in try/catch to handle private-browsing restrictions gracefully.

## Browser support
Must work without polyfills in the current stable versions of Chrome, Firefox, Edge, and Safari. ES2020 features (optional chaining, nullish coalescing, `URL` constructor, `matchMedia`) are all acceptable.

## Performance
- No external JavaScript. The only external resource is the Google Fonts stylesheet (loaded with `<link rel="preconnect">` hints and `display=swap`).
- The clock ticks on a 1-second `setInterval`; the timer uses a 250 ms interval with a wall-clock anchor (`endAt`) so it stays accurate when the tab is backgrounded.
- DOM mutations use targeted element updates or full re-renders of small lists — no virtual DOM needed at this scale.

## Accessibility
- Semantic landmarks: `<main>`, `<header>`, `<section aria-labelledby>`.
- All interactive controls have either a visible label or `aria-label`.
- Live regions: `<p aria-live="polite">` for timer status; `<p role="alert">` for error messages.
- Focus ring: `:focus-visible` with a visible 3 px outline.
- `prefers-reduced-motion`: transitions and animations are disabled via `@media (prefers-reduced-motion: reduce)`.

## Coding conventions
- Single `$` helper: `const $ = (id) => document.getElementById(id)`.
- `load(key, fallback)` / `save(key, value)` wrappers for Local Storage.
- Each feature is separated by a clearly labelled comment block (`// ===== Feature =====`).
- No global state except the small set of module-level variables for each feature.
- Buttons are always `type="button"` to avoid accidental form submission.
