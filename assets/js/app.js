// Refactored: Modern, modular, and accessible JS for Uni App
// - Theme toggle
// - Tab navigation
// - Progress bar
// - Collapsible sections
// - Sidebar (if needed)

document.addEventListener('DOMContentLoaded', () => {
  // --- Theme Switcher ---
  const themeBtn = document.getElementById('theme-toggle');
  const htmlEl = document.documentElement;

  function setTheme(theme) {
    if (theme === 'dark') {
      htmlEl.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      htmlEl.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }
  function getTheme() {
    return localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }
  setTheme(getTheme());
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      setTheme(htmlEl.classList.contains('dark') ? 'light' : 'dark');
    });
  }

  // --- Tab Navigation ---
  const tabButtons = document.querySelectorAll('[data-tab]');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
      const tabId = btn.getAttribute('data-tab');
      document.getElementById(tabId)?.classList.add('active');
    });
  });

  // --- Progress Bar & Course Checkbox ---
  const TOTAL_UNITS = 144;
  const checkboxes = document.querySelectorAll('.course-checkbox');
  const progressBar = document.getElementById('progress-bar');
  const progressLabel = document.getElementById('progress-label');

  function updateProgress() {
    let passed = 0;
    checkboxes.forEach(cb => { if (cb.checked) passed += parseInt(cb.dataset.unit) || 0; });
    const percent = Math.round((passed / TOTAL_UNITS) * 100);
    if (progressBar) progressBar.style.width = percent + '%';
    if (progressLabel) progressLabel.textContent = `${passed} / ${TOTAL_UNITS} units (${percent}%)`;
  }
  function saveProgress() {
    const state = {};
    checkboxes.forEach(cb => {
      const name = cb.dataset.name;
      if (name) state[name] = cb.checked;
    });
    localStorage.setItem('progress', JSON.stringify(state));
  }
  function loadProgress() {
    const state = JSON.parse(localStorage.getItem('progress') || '{}');
    checkboxes.forEach(cb => {
      const name = cb.dataset.name;
      if (name && state[name]) cb.checked = true;
      const row = cb.closest('tr');
      if (row) row.classList.toggle('passed', cb.checked);
    });
    updateProgress();
  }
  checkboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      const row = cb.closest('tr');
      if (row) row.classList.toggle('passed', cb.checked);
      updateProgress();
      saveProgress();
    });
  });
  loadProgress();

  // --- Collapsible Sections ---
  document.querySelectorAll('.collapsible').forEach(section => {
    const header = section.querySelector('.collapsible-header');
    const content = section.querySelector('.collapsible-content');
    if (header && content) {
      header.addEventListener('click', () => {
        content.classList.toggle('open');
        header.classList.toggle('open');
      });
    }
  });
});
