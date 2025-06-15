// js/services/backupService.js

import { StorageService } from './storageService.js';

const storage = new StorageService();
const BACKUP_KEY = 'dashboard_backups';
const DATA_KEYS_TO_BACKUP = ['tasks', 'theme', 'accentColor', 'language', 'user_stats']; // Add any other keys you want to back up

export class BackupService {
    constructor() {
        if (!storage.get(BACKUP_KEY)) {
            storage.set(BACKUP_KEY, []);
        }
    }

    /**
     * Creates a snapshot of the current application data.
     * @returns {object} The newly created backup object.
     */
    createBackup() {
        const backups = this.getBackups();
        const dataToBackup = {};

        DATA_KEYS_TO_BACKUP.forEach(key => {
            const value = storage.get(key);
            if (value !== null) {
                dataToBackup[key] = value;
            }
        });

        const newBackup = {
            id: `backup-${Date.now()}`,
            timestamp: new Date().toISOString(),
            data: dataToBackup,
        };

        // Add the new backup and keep only the 10 most recent
        const updatedBackups = [newBackup, ...backups].slice(0, 10);
        storage.set(BACKUP_KEY, updatedBackups);
        
        return newBackup;
    }

    /**
     * Retrieves all stored backups.
     * @returns {Array} A list of backup objects.
     */
    getBackups() {
        return storage.get(BACKUP_KEY, []);
    }

    /**
     * Restores the application state from a given backup.
     * @param {string} backupId The ID of the backup to restore.
     * @returns {boolean} True if restore was successful, false otherwise.
     */
    restoreBackup(backupId) {
        const backups = this.getBackups();
        const backupToRestore = backups.find(b => b.id === backupId);

        if (!backupToRestore) {
            console.error("Backup not found!");
            return false;
        }

        // Clear existing keys before restoring
        DATA_KEYS_TO_BACKUP.forEach(key => {
            storage.remove(key);
        });

        // Restore data from the backup
        for (const [key, value] of Object.entries(backupToRestore.data)) {
            storage.set(key, value);
        }
        
        return true;
    }
}