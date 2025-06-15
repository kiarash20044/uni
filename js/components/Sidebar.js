// js/components/Sidebar.js

import { I18nService } from '../services/i18nService.js';
import { AppState } from '../state.js';
import { fadeIn } from '../utils/animations.js';

const icons = {
    // ... (icons object is unchanged)
};


export function initSidebar(router, i18n) {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;

    // ✨ NEW: Add shortcut keys here
    const menuItems = [
        { name: 'dashboard', path: '/', icon: 'dashboard', shortcut: 'D' },
        { name: 'courses', path: '/courses', icon: 'courses', shortcut: 'C' },
        { name: 'grades', path: '/grades', icon: 'grades', shortcut: 'G' },
        { name: 'schedule', path: '/schedule', icon: 'schedule', shortcut: 'S' },
        { name: 'tasks', path: '/tasks', icon: 'tasks', shortcut: 'T' },
        { name: 'resources', path: '/resources', icon: 'resources', shortcut: 'R' },
        { name: 'settings', path: '/settings', icon: 'settings', shortcut: ',' }
    ];

    const menuHtml = menuItems.map(item => {
        // ✨ NEW: Add shortcut to tooltip
        const tooltipText = `${i18n.translate(item.name)} (Alt + ${item.shortcut})`;
        return `
            <li>
                <a href="${item.path}" 
                   class="nav-link ${router.getCurrentPath() === item.path ? 'is-active' : ''}" 
                   data-navigo 
                   id="${item.name}-link"
                   data-tooltip="${tooltipText}" 
                >
                    <span class="icon">${icons[item.icon]}</span>
                    <span class="link-text">${i18n.translate(item.name)}</span>
                </a>
            </li>
        `;
    }).join('');

    sidebar.innerHTML = `
        <div class="sidebar-brand">
            <span class="brand-icon">🎓</span>
            <h1 class="brand-text">UniDash</h1>
        </div>
        <ul class="menu-list" id="sidebar-nav">
            ${menuHtml}
        </ul>
        <div class="sidebar-footer">
             <a href="#" class="nav-link" data-tooltip="${i18n.translate('logout')}">
                <span class="icon">${icons['logout']}</span>
                <span class="link-text">${i18n.translate('logout')}</span>
            </a>
        </div>
    `;

    // Re-attach listeners after re-rendering
    const links = sidebar.querySelectorAll('a[data-navigo]');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            router.navigate(link.getAttribute('href'));
        });
    });

    fadeIn(sidebar);
}