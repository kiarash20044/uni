// js/services/storageService.js

/**
 * A robust service for interacting with localStorage,
 * including simple Base64 encryption for obfuscation.
 */
export class StorageService {
    /**
     * @param {string} key The localStorage key to use for this instance.
     */
    constructor(key) {
        this.key = key;
    }

    /**
     * Retrieves and decrypts data from localStorage.
     * @returns {object | null} The parsed object or null if an error occurs or no data exists.
     */
    get() {
        try {
            const encryptedData = localStorage.getItem(this.key);
            if (!encryptedData) {
                return null;
            }
            // Decrypt from Base64 and parse the JSON string
            const jsonString = atob(encryptedData);
            return JSON.parse(jsonString);
        } catch (error) {
            console.error('Failed to retrieve or parse data from localStorage:', error);
            // In case of corruption, it's safer to clear it
            localStorage.removeItem(this.key);
            return null;
        }
    }

    /**
     * Encrypts and saves data to localStorage.
     * @param {object} data The JSON object to save.
     */
    set(data) {
        try {
            const jsonString = JSON.stringify(data);
            // Encrypt to Base64
            const encryptedData = btoa(jsonString);
            localStorage.setItem(this.key, encryptedData);
        } catch (error) {
            console.error('Failed to save data to localStorage:', error);
        }
    }
}