// js/app.js

import { createRouter } from './router.js';
import { AppState } from './state.js';
import { initSidebar } from './components/Sidebar.js';
import { I18nService } from './services/i18nService.js';
import { initTopNav } from './components/TopNav.js';
import { GuideService } from './services/guideService.js';
import { initTooltips } from './components/Tooltips.js';
import { KeyboardService } from './services/keyboardService.js'; // ✨ NEW
import { renderHomePage } from './pages/home.js';
import { renderTasksPage } from './pages/tasks.js';
import { renderSchedulePage } from './pages/schedule.js';
import { renderSettingsPage } from './pages/settings.js';

/**
 * Registers the service worker for offline support.
 */
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                })
                .catch(err => {
                    console.log('ServiceWorker registration failed: ', err);
                });
        });
    }
}


// --- Main Application Entry Point ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Core Services
    const appState = new AppState();
    const i18n = new I18nService(appState);
    const router = createRouter(appState, i18n);
    const guideService = new GuideService(appState, i18n);
    const keyboardService = new KeyboardService(router); // ✨ NEW

    // 2. Initial Setup
    const appContainer = document.getElementById('app-container');
    const loadingScreen = document.getElementById('app-loading-screen');

    // Set initial theme and language from state
    document.body.dataset.theme = appState.get('theme') || 'dark';
    document.body.dataset.accentColor = appState.get('accentColor') || 'cyan';
    document.documentElement.lang = appState.get('language') || 'fa';
    document.documentElement.dir = appState.get('language') === 'en' ? 'ltr' : 'rtl';

    // 3. Initialize UI Components & Services
    initSidebar(router, i18n);
    initTopNav(appState, i18n);
    keyboardService.registerDefaultShortcuts(); // ✨ NEW

    // 4. Define Page Routes
    router.addRoute('/', renderHomePage);
    router.addRoute('/courses', (appState, i18n) => `<h1>${i18n.translate('courses')}</h1>`);
    router.addRoute('/grades', (appState, i18n) => '<h1>Grades Page</h1>');
    router.addRoute('/schedule', renderSchedulePage);
    router.addRoute('/tasks', renderTasksPage);
    router.addRoute('/resources', (appState, i18n) => '<h1>Resources Page</h1>');
    router.addRoute('/settings', renderSettingsPage);

    // 5. Initial Page Load
    router.handleLocation();
    
    // Register the Service Worker for offline functionality
    registerServiceWorker();

    // 6. Fade in the app
    setTimeout(() => {
        gsap.to(loadingScreen, { opacity: 0, duration: 0.5, onComplete: () => loadingScreen.classList.add('is-hidden') });
        appContainer.classList.remove('is-hidden');
        gsap.from(appContainer, { opacity: 0, duration: 0.7 });

        // Initialize tooltips and start the tour after the app is visible
        initTooltips();
        guideService.startTourIfNeeded();

    }, 500);
});