// js/pages/schedule.js

import { StorageService } from '../services/storageService.js';
import { fadeIn } from '../utils/animations.js';
// ✨ NEW: Import the print service
import { exportElementToPdf } from '../services/printService.js';

// ... (rest of the file is mostly unchanged, only renderSchedulePage and the new listener function)
const storage = new StorageService();
const TIMELINE_EVENTS_KEY = 'timeline_events';

function getInitialEvents() { /* ... unchanged ... */ }
const eventIcons = { /* ... unchanged ... */ };
let events = getInitialEvents();
function saveEvents() { /* ... unchanged ... */ }
function renderTimelineItems(i18n) { /* ... unchanged ... */ }
function addTimelineFormListeners(pageContainer, i18n) { /* ... renamed from addTimelineListeners ... */ }

// ✨ NEW: Add listeners for page-specific actions
function addPageActionListeners(i18n) {
    const exportBtn = document.getElementById('export-schedule-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            // We pass 'timeline-container' which holds the title and the timeline itself
            exportElementToPdf('timeline-container-for-print', i18n.translate('semesterTimeline'), 'student-dashboard-schedule.pdf');
        });
    }
}

export function renderSchedulePage(appState, i18n) {
    const pageContainer = document.createElement('div');
    pageContainer.className = 'timeline-page-container';
    
    // ✨ UPDATED: Add export button and a wrapper ID for printing
    pageContainer.innerHTML = `
        <div class="timeline-form-container">
            </div>
        <div class="timeline-container" id="timeline-container-for-print">
            <button class="button is-small export-pdf-btn" id="export-schedule-btn">
                <span class="icon"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M19,12L12,19L5,12H9V4H15V12H19M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" /></svg></span>
                <span>${i18n.translate('exportPdf')}</span>
            </button>
            <h1 class="title">${i18n.translate('semesterTimeline')}</h1>
            <div class="timeline">
                ${renderTimelineItems(i18n)}
            </div>
        </div>
    `;

    setTimeout(() => {
        pageContainer.querySelector('#event-date').value = new Date().toISOString().split('T')[0];
        addTimelineFormListeners(pageContainer, i18n); // Renamed for clarity
        addPageActionListeners(i18n); // ✨ NEW
        fadeIn(pageContainer);
        gsap.from(".timeline-item", { /* ... animation unchanged ... */ });
    }, 0);

    return pageContainer;
}

// NOTE: You'll need to rename `addTimelineListeners` to `addTimelineFormListeners` in the schedule.js file to avoid confusion. The content of that function remains the same.