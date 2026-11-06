# Product: To-Do List Life Dashboard

## Overview
A personal, single-page life dashboard that lives entirely in the browser. No account, no server, no setup — open the file and start using it.

## Purpose
Give the user a calm, focused starting point for their day: current time and a personalised greeting, a Pomodoro-style focus timer, a persistent to-do list, and a set of quick-access bookmarks.

## Features

### Greeting & clock
- Displays the current time (HH:MM, 24-hour) and the full date (weekday, day, month, year).
- Time-based greeting phrase: Good morning (05:00–11:59), Good afternoon (12:00–16:59), Good evening (17:00–20:59), Good night (21:00–04:59).
- User can type their name; it appears inline in the greeting (e.g. "Good morning, Alex").
- Name is saved in Local Storage and restored on reload.

### Focus timer
- Fixed 25-minute countdown (Pomodoro).
- Three controls: Start, Stop (pause), Reset.
- While running, the remaining time replaces the browser tab title.
- Status line gives plain-English feedback (running / paused / finished).

### To-do list
- Add tasks via text input (Enter key or Add button).
- Mark tasks done via checkbox; done tasks show a strikethrough.
- Edit any task in-place (inline text input, Save or Escape).
- Delete individual tasks.
- All tasks persisted in Local Storage; restored on reload.
- **Duplicate prevention**: adding or editing a task to match an existing task (case-insensitive) is blocked with a clear error message.

### Quick links
- Displays saved bookmarks as compact chips.
- Add a link: name + URL (auto-prefixes `https://` if missing, validates the URL).
- Remove any link with the × button.
- All links persisted in Local Storage; three default links seeded on first use (Google, GitHub, YouTube).

### Light / dark mode
- Toggle button in the header switches between light and dark themes.
- Respects the OS `prefers-color-scheme` preference on first visit.
- Choice saved in Local Storage.

## Non-functional requirements
- Clean, minimal interface with clear visual hierarchy and readable typography.
- Fast load: no build step, no bundler, no framework.
- Responsive: single-column layout on screens narrower than 760 px.
- Accessible: semantic HTML, `aria-label` on interactive controls, `aria-live` for dynamic status regions, `:focus-visible` ring, `prefers-reduced-motion` support.
- Works in all modern browsers: Chrome, Firefox, Edge, Safari.
