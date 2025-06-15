// js/router.js
import { animatePageOut, animatePageIn } from './utils/animations.js';

export function createRouter(appState, i18n) {
    const routes = {};
    const pageContentWrapper = document.getElementById('page-content-wrapper');
    const breadcrumbContainer = document.getElementById('breadcrumb-container');

    // Function to add a route
    function addRoute(path, renderer) {
        routes[path] = renderer;
    }

    // Function to update breadcrumbs
    function updateBreadcrumbs(path) {
        const pathSegments = path.split('/').filter(p => p);
        let currentPath = '';
        const breadcrumbs = [
            `<a href="/">${i18n.translate('home')}</a>`
        ];

        pathSegments.forEach(segment => {
            currentPath += `/${segment}`;
            // Capitalize the segment for display, use translation if available
            const translatedSegment = i18n.translate(segment);
            breadcrumbs.push(`<a href="${currentPath}">${translatedSegment}</a>`);
        });

        breadcrumbContainer.innerHTML = breadcrumbs.join('<span>&nbsp;/&nbsp;</span>');
        breadcrumbContainer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();
                navigateTo(link.getAttribute('href'));
            });
        });
    }

    // Main rendering function
    function render(path) {
        const renderer = routes[path] || (() => `<h1>404 - ${i18n.translate('pageNotFound')}</h1>`);
        
        // Use the renderer function to get the new HTML content
        pageContentWrapper.innerHTML = renderer(appState, i18n);
        
        updateBreadcrumbs(path);
        animatePageIn(pageContentWrapper);
    }

    // Function to navigate to a new path
    function navigateTo(path) {
        const currentPath = window.location.pathname;
        if (path === currentPath) return; // Don't reload if path is the same

        animatePageOut(pageContentWrapper, () => {
            window.history.pushState({}, path, window.location.origin + path);
            render(path);
        });
    }

    // Handle back/forward browser navigation
    window.onpopstate = () => {
        render(window.location.pathname);
    };

    // Initial load handler
    function handleLocation() {
        render(window.location.pathname);
    }

    return {
        addRoute,
        navigateTo,
        handleLocation
    };
}