// js/router.js

import { initSidebar } from './components/Sidebar.js';

export function createRouter(appState, i18n) {
    const routes = {};
    const pageContent = document.getElementById('page-content');

    function addRoute(path, renderer) {
        routes[path] = renderer;
    }

    function navigate(path) {
        window.history.pushState({}, path, window.location.origin + path);
        handleLocation();
    }

    function handleLocation() {
        const path = window.location.pathname;
        const renderer = routes[path] || routes['/']; // Fallback to home page

        if (pageContent && typeof renderer === 'function') {
            // Clear previous content
            pageContent.innerHTML = '';
            
            // Render new content
            const newContent = renderer(appState, i18n);

            if (typeof newContent === 'string') {
                pageContent.innerHTML = newContent;
            } else if (newContent instanceof HTMLElement) {
                pageContent.appendChild(newContent);
            }
            
            // Re-initialize sidebar to update the active link
            initSidebar({ getCurrentPath: () => path, navigate }, i18n);
        }
    }

    window.onpopstate = handleLocation;

    return {
        addRoute,
        navigate,
        handleLocation,
        getCurrentPath: () => window.location.pathname
    };
}