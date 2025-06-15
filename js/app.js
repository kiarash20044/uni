// js/app.js

import { createRouter } from './router.js';
import { AppState } from './state.js';
import { initSidebar } from './components/Sidebar.js';
import { I18nService } from './services/i18nService.js';
import { initTopNav } from './components/TopNav.js';
import { renderHomePage } from './pages/home.js';

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

    // 2. Initial Setup
    const appContainer = document.getElementById('app-container');
    const loadingScreen = document.getElementById('app-loading-screen');

    // Set initial theme and language from state
    document.body.dataset.theme = appState.get('theme') || 'dark';
    document.documentElement.lang = appState.get('language') || 'fa';
    document.documentElement.dir = appState.get('language') === 'en' ? 'ltr' : 'rtl';

    // 3. Initialize UI Components
    initSidebar(router, i18n);
    initTopNav(appState, i18n);

    // 4. Define Page Routes
    router.addRoute('/', renderHomePage);
    router.addRoute('/courses', (appState, i18n) => `<h1>${i18n.translate('courses')}</h1>`);
    router.addRoute('/grades', (appState, i18n) => '<h1>Grades Page</h1>');
    router.addRoute('/schedule', (appState, i18n) => '<h1>Schedule Page</h1>');
    router.addRoute('/tasks', (appState, i18n) => '<h1>Tasks Page</h1>');
    router.addRoute('/resources', (appState, i18n) => '<h1>Resources Page</h1>');

    // 5. Initial Page Load
    router.handleLocation();
    
    // Register the Service Worker for offline functionality
    registerServiceWorker();

    // 6. Fade in the app
    setTimeout(() => {
        gsap.to(loadingScreen, { opacity: 0, duration: 0.5, onComplete: () => loadingScreen.classList.add('is-hidden') });
        appContainer.classList.remove('is-hidden');
        gsap.from(appContainer, { opacity: 0, duration: 0.7 });
    }, 500); // Simulate loading
});