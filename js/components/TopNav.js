
// js/components/TopNav.js
export function initTopNav(appState, i18n) {
    const themeToggle = document.getElementById('theme-toggle');
    const langToggle = document.getElementById('lang-toggle');
    const usernameDisplay = document.getElementById('username-display');
    const sidebar = document.getElementById('sidebar');
    const burger = document.querySelector('.navbar-burger');

    // Set initial username
    const user = appState.get('user');
    if (user && user.name) {
        usernameDisplay.textContent = user.name;
    }

    // --- Event Listeners ---

    // Theme Toggle
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.dataset.theme;
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.body.dataset.theme = newTheme;
        appState.set('theme', newTheme);
        themeToggle.querySelector('.icon').innerHTML = newTheme === 'dark' ? '&#9728;&#65039;' : '&#127769;'; // Sun/Moon
    });

    // Language Toggle
    langToggle.addEventListener('click', () => {
        const currentLang = appState.get('language') || 'fa';
        const newLang = currentLang === 'fa' ? 'en' : 'fa';
        appState.set('language', newLang);
        // This will trigger a full re-render via the i18n service and router
        window.location.reload();
    });

    // Mobile burger menu
    burger.addEventListener('click', () => {
        burger.classList.toggle('is-active');
        sidebar.classList.toggle('is-active');
    });
}