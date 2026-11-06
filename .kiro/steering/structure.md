# Project Structure

```
dashboard/
├── index.html          # Single HTML page — the entire UI
├── css/
│   └── style.css       # All styles (the only CSS file)
└── js/
    └── script.js       # All behaviour (the only JS file)
```

## Rules
- **Exactly one CSS file** at `css/style.css`. Do not add additional stylesheets or inline `<style>` blocks.
- **Exactly one JavaScript file** at `js/script.js`. Do not add additional scripts or inline `<script>` blocks (other than the single `defer` `<script src>` tag already in `index.html`).
- No `node_modules`, no `package.json`, no build output directories.
- No test files, test frameworks, or CI configuration unless the user explicitly requests them.

## index.html layout
The page has one `<main class="app">` with four direct children, laid out in a CSS Grid:

| Grid area | Element | Content |
|-----------|---------|---------|
| `hero`  | `<header>` | Clock, date, greeting, name input, theme toggle |
| `timer` | `<section>` | 25-minute focus timer |
| `todo`  | `<section>` | To-do list |
| `links` | `<section>` | Quick links |

On wide screens (≥ 760 px): two-column grid — hero spans full width, timer and links stack in the left column, todo spans the right column.  
On narrow screens (< 760 px): single column, top-to-bottom order: hero → timer → todo → links.

## style.css layout
1. CSS custom properties (`--bg`, `--surface`, `--ink`, `--muted`, `--line`, `--accent`, `--accent-ink`, `--danger`, `--focus`) defined on `:root` for the light theme.
2. Dark-theme overrides on `:root[data-theme="dark"]`.
3. Reset / base styles (`box-sizing`, `body`).
4. Layout (`.app` grid, grid areas).
5. Hero section styles.
6. Shared component styles (`.card`, `h2`, `input[type="text"]`, `.btn` variants).
7. Feature-specific styles (timer, to-do list, quick links).
8. Responsive breakpoint (`@media (max-width: 760px)`).
9. Accessibility (`@media (prefers-reduced-motion: reduce)`).

## script.js layout
Sections in order, each preceded by a `// ===== Section =====` comment:

1. **Helpers** — `$()`, `load()`, `save()`
2. **Greeting, clock, name** — `greetingFor()`, `renderClock()`, `renderName()`, name-input listener
3. **Light / dark mode** — `applyTheme()`, toggle listener
4. **Focus timer** — `startTimer()`, `stopTimer()`, `resetTimer()`, `tick()`, button listeners
5. **To-do list** — `addTask()`, `finishEdit()`, `isDuplicate()`, `renderTasks()`, `makeButton()`, input/button listeners
6. **Quick links** — `normalizeUrl()`, `renderLinks()`, add-button listener
7. **Start** — initial render calls (`renderClock`, `setInterval`, `renderName`, `renderTimer`, `renderTasks`, `renderLinks`)
