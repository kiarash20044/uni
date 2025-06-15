// js/components/TopNav.js

import { fadeIn } from '../utils/animations.js';

const THEMES = [
    { name: 'cyan', color: '#00d1b2' },
    { name: 'purple', color: '#8A4D76' },
    { name: 'green', color: '#4CAF50' },
    { name: 'orange', color: '#FF9800' }
];

function renderThemeSwitcher(appState, i18n) {
    const currentAccent = appState.get('accentColor') || 'cyan';

    const themeOptions = THEMES.map(theme => `
        <a href="#" class="dropdown-item ${currentAccent === theme.name ? 'is-active' : ''}" data-theme-name="${theme.name}">
            <span class="theme-swatch" style="background-color: ${theme.color};"></span>
            ${i18n.translate(`theme_${theme.name}`)}
        </a>
    `).join('');

    return `
        <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link is-arrowless" aria-label="${i18n.translate('themeSettings')}">
                <span class="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>
                </span>
            </a>
            <div class="navbar-dropdown is-right">
                <div class="dropdown-content">
                    <h6 class="dropdown-header">${i18n.translate('accentColor')}</h6>
                    ${themeOptions}
                </div>
            </div>
        </div>
    `;
}

function addThemeSwitcherListeners(appState) {
    const dropdown = document.querySelector('.navbar-item.has-dropdown');
    if (!dropdown) return;

    dropdown.addEventListener('click', (event) => {
        const themeItem = event.target.closest('.dropdown-item');
        if (themeItem && themeItem.dataset.themeName) {
            event.preventDefault();
            const newAccentColor = themeItem.dataset.themeName;
            
            // Update state
            appState.set('accentColor', newAccentColor);

            // Update UI immediately
            document.body.dataset.accentColor = newAccentColor;
            
            // Update active state in dropdown
            dropdown.querySelector('.dropdown-item.is-active')?.classList.remove('is-active');
            themeItem.classList.add('is-active');
        }
    });
}


export function initTopNav(appState, i18n) {
    const navElement = document.querySelector('.top-nav');
    if (!navElement) return;

    const welcomeMessage = i18n.translate('welcome_back');

    navElement.innerHTML = `
        <div class="navbar-brand">
            <p class="is-size-5 has-text-weight-bold">${welcomeMessage}, User!</p>
        </div>
        <div class="navbar-menu">
            <div class="navbar-end">
                ${renderThemeSwitcher(appState, i18n)}
                <div class="navbar-item">
                    <div class="field is-grouped">
                        <p class="control">
                            <a class="button is-primary">
                                <span class="icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                                </span>
                                <span>Report Issue</span>
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `;

    addThemeSwitcherListeners(appState);

    fadeIn(navElement);
}