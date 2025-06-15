// js/state.js
import { StorageService } from './services/storageService.js';

const initialState = {
    theme: 'dark',
    language: 'fa',
    user: {
        name: 'آرش', // Arash
        avatar: 'https://bulma.io/images/placeholders/24x24.png'
    },
    dashboardStats: [
        { value: '۱۷.۸', label: 'currentGPA', icon: '&#127891;' },
        { value: '۵', label: 'coursesInProgress', icon: '&#128218;' },
        { value: '۳', label: 'upcomingDeadlines', icon: '&#9203;' },
        { value: '۹۲٪', label: 'attendanceRate', icon: '&#128200;' }
    ],
    // Add more complex state here, e.g., courses, grades, tasks
    courses: [],
    tasks: [],
};

export class AppState {
    constructor() {
        this.storage = new StorageService('student-dashboard-state-v1');
        // Load from storage, or use initial state if nothing is stored
        this.state = this.storage.get() || initialState;
    }

    /**
     * Get a value from the state. If key is null, returns the whole state.
     * @param {string | null} key - The key of the state property.
     * @returns {*} The value from the state.
     */
    get(key) {
        if (key === null) {
            return this.state;
        }
        return this.state[key];
    }

    /**
     * Set a value in the state and persist it to localStorage.
     * If key is null, the entire state is replaced by the value.
     * @param {string | null} key - The key of the state property, or null to replace the state.
     * @param {*} value - The new value to set.
     */
    set(key, value) {
        if (key === null) {
            // Replace the entire state object
            this.state = value;
        } else {
            // Set a specific property
            this.state[key] = value;
        }

        this.storage.set(this.state);
        document.dispatchEvent(new CustomEvent('state-change', { detail: { key, value } }));
    }
}