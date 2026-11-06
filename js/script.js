// ===== Helpers =====
const $ = (id) => document.getElementById(id);

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
}
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage unavailable */ }
}

// ===== Greeting, clock, name =====
const DAYS_FORMAT = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
let userName = load('dash-name', '');

function greetingFor(hour) {
  if (hour >= 5 && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 17) return 'Good afternoon';
  if (hour >= 17 && hour < 21) return 'Good evening';
  return 'Good night';
}

function renderClock() {
  const now = new Date();
  $('clock').textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  $('date').textContent = now.toLocaleDateString(undefined, DAYS_FORMAT);
  $('greeting-text').textContent = greetingFor(now.getHours());
}

function renderName() {
  $('greeting-name').textContent = userName ? ', ' + userName : '';
  $('name-input').value = userName;
}

$('name-input').addEventListener('input', (e) => {
  userName = e.target.value.trim();
  save('dash-name', userName);
  $('greeting-name').textContent = userName ? ', ' + userName : '';
});

// ===== Light / dark mode =====
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  $('theme-toggle').textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
}
const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
let theme = load('dash-theme', prefersDark ? 'dark' : 'light');
applyTheme(theme);
$('theme-toggle').addEventListener('click', () => {
  theme = theme === 'dark' ? 'light' : 'dark';
  save('dash-theme', theme);
  applyTheme(theme);
});

// ===== Focus timer (25 minutes) =====
const TIMER_SECONDS = 25 * 60;
let remaining = TIMER_SECONDS;
let endAt = null;
let timerId = null;

function formatTime(total) {
  const m = String(Math.floor(total / 60)).padStart(2, '0');
  const s = String(total % 60).padStart(2, '0');
  return m + ':' + s;
}
function renderTimer() {
  $('timer-display').textContent = formatTime(remaining);
  document.title = timerId ? formatTime(remaining) + ' - Focus' : 'Life Dashboard';
}
function tick() {
  remaining = Math.max(0, Math.round((endAt - Date.now()) / 1000));
  renderTimer();
  if (remaining === 0) {
    stopTimer();
    $('timer-status').textContent = 'Time is up. Take a short break.';
  }
}
function startTimer() {
  if (timerId || remaining === 0) return;
  endAt = Date.now() + remaining * 1000;
  timerId = setInterval(tick, 250);
  $('timer-status').textContent = 'Focus session running.';
  renderTimer();
}
function stopTimer() {
  if (!timerId) return;
  clearInterval(timerId);
  timerId = null;
  if (remaining > 0) $('timer-status').textContent = 'Paused. Press Start to continue.';
  renderTimer();
}
function resetTimer() {
  clearInterval(timerId);
  timerId = null;
  remaining = TIMER_SECONDS;
  $('timer-status').textContent = 'Ready to focus for 25 minutes.';
  renderTimer();
}
$('timer-start').addEventListener('click', startTimer);
$('timer-stop').addEventListener('click', stopTimer);
$('timer-reset').addEventListener('click', resetTimer);

// ===== To-do list =====
let tasks = load('dash-tasks', []);
let editingId = null;

function saveTasks() { save('dash-tasks', tasks); }
function isDuplicate(text, ignoreId) {
  const wanted = text.toLowerCase();
  return tasks.some((t) => t.id !== ignoreId && t.text.toLowerCase() === wanted);
}
function setTaskMessage(msg) { $('task-message').textContent = msg; }

function addTask() {
  const text = $('task-input').value.trim();
  if (!text) { setTaskMessage('Type a task first.'); return; }
  if (isDuplicate(text)) { setTaskMessage('This task is already on your list.'); return; }
  tasks.push({ id: Date.now(), text: text, done: false });
  $('task-input').value = '';
  setTaskMessage('');
  saveTasks();
  renderTasks();
}

function finishEdit(id, newText) {
  const text = newText.trim();
  if (!text) { setTaskMessage('A task cannot be empty.'); return; }
  if (isDuplicate(text, id)) { setTaskMessage('Another task already has this name.'); return; }
  const task = tasks.find((t) => t.id === id);
  if (task) task.text = text;
  editingId = null;
  setTaskMessage('');
  saveTasks();
  renderTasks();
}

function renderTasks() {
  const list = $('task-list');
  list.innerHTML = '';
  $('task-empty').hidden = tasks.length > 0;

  tasks.forEach((task) => {
    const li = document.createElement('li');
    li.className = 'task' + (task.done ? ' done' : '');

    const check = document.createElement('input');
    check.type = 'checkbox';
    check.checked = task.done;
    check.setAttribute('aria-label', 'Mark "' + task.text + '" as done');
    check.addEventListener('change', () => { task.done = check.checked; saveTasks(); renderTasks(); });
    li.appendChild(check);

    if (editingId === task.id) {
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'task-edit';
      input.value = task.text;
      input.maxLength = 120;
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') finishEdit(task.id, input.value);
        if (e.key === 'Escape') { editingId = null; setTaskMessage(''); renderTasks(); }
      });
      li.appendChild(input);
      const saveBtn = makeButton('Save', () => finishEdit(task.id, input.value), 'primary');
      li.appendChild(saveBtn);
      list.appendChild(li);
      input.focus();
      return;
    }

    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = task.text;
    li.appendChild(span);

    const actions = document.createElement('div');
    actions.className = 'task-actions';
    actions.appendChild(makeButton('Edit', () => { editingId = task.id; setTaskMessage(''); renderTasks(); }));
    actions.appendChild(makeButton('Delete', () => {
      tasks = tasks.filter((t) => t.id !== task.id);
      saveTasks();
      renderTasks();
    }, 'danger'));
    li.appendChild(actions);
    list.appendChild(li);
  });
}

function makeButton(label, onClick, extraClass) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'btn small' + (extraClass ? ' ' + extraClass : '');
  b.textContent = label;
  b.addEventListener('click', onClick);
  return b;
}

$('task-add').addEventListener('click', addTask);
$('task-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') addTask(); });

// ===== Quick links =====
const DEFAULT_LINKS = [
  { id: 1, name: 'Google', url: 'https://www.google.com' },
  { id: 2, name: 'GitHub', url: 'https://github.com' },
  { id: 3, name: 'YouTube', url: 'https://www.youtube.com' }
];
let links = load('dash-links', DEFAULT_LINKS);

function saveLinks() { save('dash-links', links); }

function normalizeUrl(value) {
  let v = value.trim();
  if (!v) return null;
  if (!/^https?:\/\//i.test(v)) v = 'https://' + v;
  try {
    const u = new URL(v);
    return u.hostname.includes('.') ? u.href : null;
  } catch (e) {
    return null;
  }
}

function renderLinks() {
  const box = $('link-list');
  box.innerHTML = '';
  links.forEach((link) => {
    const chip = document.createElement('div');
    chip.className = 'link-chip';

    const a = document.createElement('a');
    a.href = link.url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = link.name;
    chip.appendChild(a);

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.textContent = '×';
    remove.setAttribute('aria-label', 'Remove ' + link.name);
    remove.addEventListener('click', () => {
      links = links.filter((l) => l.id !== link.id);
      saveLinks();
      renderLinks();
    });
    chip.appendChild(remove);
    box.appendChild(chip);
  });
}

$('link-add').addEventListener('click', () => {
  const name = $('link-name').value.trim();
  const url = normalizeUrl($('link-url').value);
  if (!name) { $('link-message').textContent = 'Give the link a name.'; return; }
  if (!url) { $('link-message').textContent = 'Enter a valid address, like example.com.'; return; }
  links.push({ id: Date.now(), name: name, url: url });
  $('link-name').value = '';
  $('link-url').value = '';
  $('link-message').textContent = '';
  saveLinks();
  renderLinks();
});

// ===== Start =====
renderClock();
setInterval(renderClock, 1000);
renderName();
renderTimer();
renderTasks();
renderLinks();
