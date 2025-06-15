// js/pages/home.js

import { fadeIn } from '../utils/animations.js';
import { createCircularProgress, initCircularProgressAnimation } from '../components/CircularProgress.js';

// --- Icon SVGs ---
const gpaIcon = `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 3L1 9L12 15L23 9L12 3M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z" /></svg>`;
const creditsIcon = `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" /></svg>`;
const semesterIcon = `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" /></svg>`;

export function renderHomePage(appState, i18n) {
    const pageContainer = document.createElement('div');
    pageContainer.className = 'home-page-container';

    // --- Mock Data ---
    let stats = appState.get('user_stats');
    if (!stats || typeof stats !== 'object') stats = {};
    stats.gpa = stats.gpa && typeof stats.gpa.value === 'number' && typeof stats.gpa.max === 'number'
        ? stats.gpa
        : { value: 3.8, max: 4.0 };
    stats.credits = stats.credits && typeof stats.credits.value === 'number' && typeof stats.credits.max === 'number'
        ? stats.credits
        : { value: 92, max: 120 };
    stats.semesterProgress = stats.semesterProgress && typeof stats.semesterProgress.value === 'number' && typeof stats.semesterProgress.max === 'number'
        ? stats.semesterProgress
        : { value: 10, max: 16 };
    appState.set('user_stats', stats); // Save to state for backup service

    pageContainer.innerHTML = `
        <div class="header-container mb-6">
            <h1 class="title has-text-weight-bold animate-fade-in-up">${i18n.translate('welcome_back')}, User!</h1>
            <p class="subtitle has-text-muted animate-fade-in-up" style="animation-delay: 0.2s;">Here's what's happening today.</p>
        </div>

        <div class="stats-grid animate-fade-in-up" style="animation-delay: 0.4s;">
            ${createCircularProgress({
                id: 'gpa-progress',
                label: i18n.translate('current_gpa'),
                value: stats.gpa.value,
                max: stats.gpa.max,
                iconSVG: gpaIcon
            })}
            ${createCircularProgress({
                id: 'credits-progress',
                label: i18n.translate('completed_credits'),
                value: stats.credits.value,
                max: stats.credits.max,
                iconSVG: creditsIcon
            })}
            ${createCircularProgress({
                id: 'semester-progress',
                label: i18n.translate('semesterProgress'),
                value: stats.semesterProgress.value,
                max: stats.semesterProgress.max,
                iconSVG: semesterIcon
            })}
        </div>
    `;

    // Use a timeout to ensure the DOM is updated before running animations
    setTimeout(() => {
        fadeIn(pageContainer, { stagger: 0.1 });
        initCircularProgressAnimation('gpa-progress', stats.gpa.value, stats.gpa.max);
        initCircularProgressAnimation('credits-progress', stats.credits.value, stats.credits.max);
        initCircularProgressAnimation('semester-progress', stats.semesterProgress.value, stats.semesterProgress.max);
    }, 0);

    return pageContainer;
}