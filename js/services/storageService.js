// js/services/storageService.js

export class StorageService {
    /**
     * Retrieves an item from localStorage and parses it as JSON.
     * @param {string} key The key of the item to retrieve.
     * @param {*} defaultValue The default value to return if the key doesn't exist.
     * @returns {*} The retrieved item, or the default value.
     */
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error(`Error getting item from localStorage: ${key}`, error);
            return defaultValue;
        }
    }

    /**
     * Stores an item in localStorage after converting it to a JSON string.
     * @param {string} key The key under which to store the item.
     * @param {*} value The value to store.
     */
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error setting item in localStorage: ${key}`, error);
        }
    }

    /**
     * Removes an item from localStorage.
     * @param {string} key The key of the item to remove.
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error(`Error removing item from localStorage: ${key}`, error);
        }
    }

    /**
     * Clears all items from localStorage.
     */
    clear() {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('Error clearing localStorage', error);
        }
    }
}