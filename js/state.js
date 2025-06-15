// js/state.js

import { StorageService } from './services/storageService.js';

export class AppState {
    constructor() {
        this.storage = new StorageService();
        this.state = this.loadStateFromStorage();
        this.listeners = new Map();
    }

    /**
     * Loads the initial state from localStorage.
     * @returns {object} The state object.
     */
    loadStateFromStorage() {
        // We can define default values here if needed
        const initialState = {
            language: this.storage.get('language', 'fa'),
            theme: this.storage.get('theme', 'dark'),
            accentColor: this.storage.get('accentColor', 'cyan'),
            tasks: this.storage.get('tasks', []),
            user_stats: this.storage.get('user_stats', {}),
            timeline_events: this.storage.get('timeline_events', [])
        };
        return initialState;
    }

    /**
     * Gets a value from the state.
     * @param {string} key The state key.
     * @returns {*} The value associated with the key.
     */
    get(key) {
        return this.state[key];
    }

    /**
     * Sets a value in the state and persists it to localStorage.
     * @param {string} key The state key.
     * @param {*} value The new value.
     */
    set(key, value) {
        this.state[key] = value;
        this.storage.set(key, value);
        this.notify(key, value);
    }

    /**
     * Subscribes a listener function to a state key.
     * @param {string} key The state key to listen to.
     * @param {function} listener The callback function.
     */
    subscribe(key, listener) {
        if (!this.listeners.has(key)) {
            this.listeners.set(key, []);
        }
        this.listeners.get(key).push(listener);
    }

    /**
     * Notifies all listeners subscribed to a specific key.
     * @param {string} key The state key that changed.
     * @param {*} value The new value.
     */
    notify(key, value) {
        if (this.listeners.has(key)) {
            this.listeners.get(key).forEach(listener => listener(value));
        }
    }
}