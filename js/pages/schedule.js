// js/pages/schedule.js

import { StorageService } from '../services/storageService.js';
import { fadeIn } from '../utils/animations.js';

const storage = new StorageService();
const TIMELINE_EVENTS_KEY = 'timeline_events';

// --- Default Data & Icons ---
function getInitialEvents() {
    const today = new Date();
    const defaultEvents = [
        { id: `event-${Date.now() + 1}`, title: 'Semester Starts', date: new Date(today.getFullYear(), 8, 1).toISOString().split('T')[0], type: 'event' },
        { id: `event-${Date.now() + 2}`, title: 'Midterm Exams', date: new Date(today.getFullYear(), 10, 15).toISOString().split('T')[0], type: 'exam' },
        { id: `event-${Date.now() + 3}`, title: 'Final Project Due', date: new Date(today.getFullYear(), 11, 10).toISOString().split('T')[0], type: 'deadline' },
    ];
    return storage.get(TIMELINE_EVENTS_KEY, defaultEvents);
}

const eventIcons = {
    exam: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M10,17L6,13L7.41,11.58L10,14.17L16.59,7.58L18,9L10,17Z" /></svg>`,
    deadline: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M15,13H16.5V15.82L18.94,17.23L18.19,18.53L15,16.69V13M19,8H5V19H9.67C9.24,18.09 9,17.07 9,16A7,7 0 0,1 16,9C17.07,9 18.09,9.24 19,9.67V8M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16,11A5,5 0 0,0 11,16A5,5 0 0,0 16,21A5,5 0 0,0 21,16A5,5 0 0,0 16,11Z" /></svg>`,
    event: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M19,19H5V8H19M16,1V3H8V1H6V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3H18V1M17,12H12V17H17V12Z" /></svg>`,
    holiday: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12,2.5L14.3,7.8L20,8.5L15.8,12.3L17,17.5L12,14.5L7,17.5L8.2,12.3L4,8.5L9.7,7.8L12,2.5Z" /></svg>`
};

let events = getInitialEvents();

function saveEvents() {
    storage.set(TIMELINE_EVENTS_KEY, events);
}

function renderTimelineItems(i18n) {
    if (events.length === 0) {
        return `<p class="has-text-centered has-text-muted">${i18n.translate('noEvents')}</p>`;
    }
    
    const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));

    return sortedEvents.map(event => `
        <div class="timeline-item" data-event-type="${event.type}">
            <div class="timeline-marker">
                <div class="timeline-icon">${eventIcons[event.type] || eventIcons.event}</div>
            </div>
            <div class="timeline-content">
                <p class="timeline-date">${new Date(event.date).toLocaleDateString(i18n.appState.get('language'), { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <h4 class="timeline-title">${event.title}</h4>
            </div>
        </div>
    `).join('');
}

function addTimelineListeners(pageContainer, i18n) {
    const form = pageContainer.querySelector('#add-event-form');
    const timelineContainer = pageContainer.querySelector('.timeline');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const titleInput = form.querySelector('#event-title');
        const dateInput = form.querySelector('#event-date');
        const typeInput = form.querySelector('#event-type');

        const newEvent = {
            id: `event-${Date.now()}`,
            title: titleInput.value.trim(),
            date: dateInput.value,
            type: typeInput.value,
        };

        if (newEvent.title && newEvent.date) {
            events.push(newEvent);
            saveEvents();
            
            timelineContainer.innerHTML = renderTimelineItems(i18n);
            gsap.from(timelineContainer.lastElementChild, { opacity: 0, x: -50, duration: 0.6, ease: 'power3.out' });
            
            form.reset();
            dateInput.value = new Date().toISOString().split('T')[0];
        }
    });
}

export function renderSchedulePage(appState, i18n) {
    const pageContainer = document.createElement('div');
    pageContainer.className = 'timeline-page-container';
    
    pageContainer.innerHTML = `
        <div class="timeline-form-container">
            <h2 class="title is-4">${i18n.translate('addEvent')}</h2>
            <form id="add-event-form">
                <div class="field">
                    <label class="label" for="event-title">${i18n.translate('eventTitle')}</label>
                    <div class="control">
                        <input id="event-title" class="input" type="text" placeholder="${i18n.translate('eventTitlePlaceholder')}" required>
                    </div>
                </div>
                <div class="field">
                    <label class="label" for="event-date">${i18n.translate('eventDate')}</label>
                    <div class="control">
                        <input id="event-date" class="input" type="date" required>
                    </div>
                </div>
                <div class="field">
                    <label class="label" for="event-type">${i18n.translate('eventType')}</label>
                    <div class="control">
                        <div class="select is-fullwidth">
                            <select id="event-type">
                                <option value="exam">${i18n.translate('eventTypeExam')}</option>
                                <option value="deadline">${i18n.translate('eventTypeDeadline')}</option>
                                <option value="holiday">${i18n.translate('eventTypeHoliday')}</option>
                                <option value="event">${i18n.translate('eventTypeEvent')}</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="control">
                    <button class="button is-primary is-fullwidth" type="submit">${i18n.translate('addEvent')}</button>
                </div>
            </form>
        </div>
        <div class="timeline-container">
            <h1 class="title">${i18n.translate('semesterTimeline')}</h1>
            <div class="timeline">
                ${renderTimelineItems(i18n)}
            </div>
        </div>
    `;

    setTimeout(() => {
        pageContainer.querySelector('#event-date').value = new Date().toISOString().split('T')[0];
        addTimelineListeners(pageContainer, i18n);
        fadeIn(pageContainer);
        gsap.from(".timeline-item", {
            opacity: 0,
            y: 30,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out"
        });
    }, 0);

    return pageContainer;
}