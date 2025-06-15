// js/app.js

import { createRouter } from './router.js';
import { AppState } from './state.js';
import { initSidebar } from './components/Sidebar.js';
import { I18nService } from './services/i18nService.js';
import { initTopNav } from './components/TopNav.js';
// ✨ NEW: Import new services and components
import { GuideService } from './services/guideService.js';
import { initTooltips } from './components/Tooltips.js';
// ... (other page imports) ...

// ... (registerServiceWorker function) ...

// --- Main Application Entry Point ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Core Services
    const appState = new AppState();
    const i18n = new I18nService(appState);
    const router = createRouter(appState, i18n);
    // ✨ NEW: Initialize Guide Service
    const guideService = new GuideService(appState, i18n);

    // 2. Initial Setup
    // ... (unchanged) ...

    // 3. Initialize UI Components
    initSidebar(router, i18n);
    initTopNav(appState, i18n);

    // 4. Define Page Routes
    // ... (unchanged) ...

    // 5. Initial Page Load
    router.handleLocation();
    
    // Register the Service Worker
    registerServiceWorker();

    // 6. Fade in the app
    setTimeout(() => {
        gsap.to(loadingScreen, { opacity: 0, duration: 0.5, onComplete: () => loadingScreen.classList.add('is-hidden') });
        appContainer.classList.remove('is-hidden');
        gsap.from(appContainer, { opacity: 0, duration: 0.7 });
        
        // ✨ NEW: Initialize tooltips and start the tour after the app is visible
        initTooltips();
        guideService.startTourIfNeeded();
        
    }, 500);
});