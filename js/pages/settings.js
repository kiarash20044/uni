// js/pages/settings.js

import { BackupService } from '../services/backupService.js';
import { fadeIn } from '../utils/animations.js';

const backupService = new BackupService();

function renderBackupList(i18n) {
    const backups = backupService.getBackups();

    if (backups.length === 0) {
        return `<p class="has-text-centered has-text-muted">${i18n.translate('noBackups')}</p>`;
    }

    return backups.map(backup => `
        <div class="box backup-item">
            <div class="backup-info">
                <p class="has-text-weight-bold">${i18n.translate('backupFrom')}</p>
                <p class="is-size-7 has-text-muted">${new Date(backup.timestamp).toLocaleString()}</p>
            </div>
            <div class="backup-actions">
                <button class="button is-primary restore-btn" data-backup-id="${backup.id}">
                    <span class="icon is-small"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M12.5,8C9.85,8 7.45,9 5.6,10.6L2,7V16H11L7.38,12.38C8.77,11.22 10.54,10.5 12.5,10.5C16.04,10.5 19.05,12.81 20.1,16L22.47,15.22C21.08,11.03 17.15,8 12.5,8Z" /></svg></span>
                    <span>${i18n.translate('restore')}</span>
                </button>
            </div>
        </div>
    `).join('');
}


function addSettingsListeners(pageContainer, i18n) {
    const createBackupBtn = pageContainer.querySelector('#create-backup-btn');
    const backupListContainer = pageContainer.querySelector('#backup-list');

    createBackupBtn.addEventListener('click', () => {
        backupService.createBackup();
        // Re-render the list to show the new backup
        backupListContainer.innerHTML = renderBackupList(i18n);
        gsap.from(backupListContainer.firstElementChild, { opacity: 0, y: -20, duration: 0.5 });
    });

    backupListContainer.addEventListener('click', (e) => {
        const restoreBtn = e.target.closest('.restore-btn');
        if (restoreBtn) {
            const backupId = restoreBtn.dataset.backupId;
            if (confirm(i18n.translate('restoreConfirm'))) {
                const success = backupService.restoreBackup(backupId);
                if (success) {
                    alert(i18n.translate('restoreSuccess'));
                    window.location.reload(); // Reload the app to apply restored settings
                } else {
                    alert('Restore failed!');
                }
            }
        }
    });
}


export function renderSettingsPage(appState, i18n) {
    const pageContainer = document.createElement('div');
    pageContainer.className = 'settings-page-container';
    pageContainer.innerHTML = `
        <h1 class="title">${i18n.translate('settings')}</h1>
        <div class="settings-card">
            <h2 class="subtitle">${i18n.translate('backupRestore')}</h2>
            <p class="is-size-7 has-text-muted mb-4">${i18n.translate('backupDescription')}</p>
            
            <button class="button is-fullwidth is-link mb-5" id="create-backup-btn">
                <span>${i18n.translate('createBackup')}</span>
            </button>

            <div id="backup-list">
                ${renderBackupList(i18n)}
            </div>
        </div>
    `;

    setTimeout(() => {
        addSettingsListeners(pageContainer, i18n);
        fadeIn(pageContainer);
    }, 0);

    return pageContainer;
}