// js/components/Sidebar.js
import { $ } from '../utils/dom.js';

export function initSidebar(router, i18n) {
    const sidebarContainer = $('#sidebar');
    if (!sidebarContainer) return;

    // Define the structure of the sidebar menu
    const menuItems = [
        {
            label: i18n.translate('home'), // 'Home'
            icon: '&#127968;', // 🏠
            path: '/'
        },
        {
            label: i18n.translate('courses'), // 'Courses'
            icon: '&#128218;', // 📚
            path: '/courses'
        },
        {
            label: i18n.translate('grades'), // 'Grades'
            icon: '&#127891;', // 🎓
            path: '/grades'
        },
        {
            label: i18n.translate('schedule'), // 'Schedule'
            icon: '&#128197;', // 📅
            path: '/schedule'
        },
        {
            label: i18n.translate('tasks'), // 'Tasks'
            icon: '&#9989;', // ✅
            path: '/tasks'
        },
        {
            label: i18n.translate('resources'), // 'Resources'
            icon: '&#128279;', // 🔗
            path: '/resources'
        }
    ];

    const menuHTML = `
        <div class="sidebar-header">
            <h1 class="title is-4 has-text-centered neon-glow-text">${i18n.translate('profile')}</h1>
        </div>
        <p class="menu-label">${i18n.translate('navigation')}</p>
        <ul class="menu-list">
            ${menuItems.map(item => `
                <li>
                    <a href="${item.path}" data-path="${item.path}">
                        <span class="icon">${item.icon}</span>
                        <span>${item.label}</span>
                    </a>
                </li>
            `).join('')}
        </ul>
    `;

    sidebarContainer.innerHTML = menuHTML;

    // Event Delegation for navigation
    sidebarContainer.addEventListener('click', e => {
        const link = e.target.closest('a');
        if (link && link.dataset.path) {
            e.preventDefault();
            router.navigateTo(link.dataset.path);
            
            // Close sidebar on mobile after clicking a link
            const burger = $('.navbar-burger');
            if (burger.classList.contains('is-active')) {
                burger.classList.remove('is-active');
                sidebarContainer.classList.remove('is-active');
            }
        }
    });

    // Function to update the active link
    function updateActiveLink() {
        const currentPath = window.location.pathname;
        sidebarContainer.querySelectorAll('a').forEach(link => {
            if (link.dataset.path === currentPath) {
                link.classList.add('is-active');
            } else {
                link.classList.remove('is-active');
            }
        });
    }

    // Update active link on initial load and on state changes
    updateActiveLink();
    document.addEventListener('state-change', updateActiveLink);
    window.addEventListener('popstate', updateActiveLink);
}