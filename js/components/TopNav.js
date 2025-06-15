// js/components/TopNav.js
export function initTopNav(appState, i18n) {
    const themeToggle = document.getElementById('theme-toggle');
    const langToggle = document.getElementById('lang-toggle');
    const usernameDisplay = document.getElementById('username-display');
    const sidebar = document.getElementById('sidebar');
    const burger = document.querySelector('.navbar-burger');

    // Get references to import/export buttons
    const exportBtn = document.getElementById('export-data-btn');
    const importBtn = document.getElementById('import-data-btn');

    // Set initial username
    const user = appState.get('user');
    if (user && user.name) {
        usernameDisplay.textContent = user.name;
    }

    // --- Event Listeners ---

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.dataset.theme;
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.body.dataset.theme = newTheme;
        appState.set('theme', newTheme);
        themeToggle.querySelector('.icon').innerHTML = newTheme === 'dark' ? '&#9728;&#65039;' : '&#127769;'; // Sun/Moon
    });

    langToggle.addEventListener('click', () => {
        const currentLang = appState.get('language') || 'fa';
        const newLang = currentLang === 'fa' ? 'en' : 'fa';
        appState.set('language', newLang);
        window.location.reload();
    });

    burger.addEventListener('click', () => {
        burger.classList.toggle('is-active');
        sidebar.classList.toggle('is-active');
    });

    // Event listeners and logic for Import/Export
    exportBtn.addEventListener('click', handleExport);
    importBtn.addEventListener('click', handleImport);

    /**
     * Exports the entire application state to a JSON file.
     */
    function handleExport() {
        const stateData = appState.get(null); // Get the entire state object
        const jsonString = JSON.stringify(stateData, null, 2); // Pretty print JSON
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        const today = new Date().toISOString().slice(0, 10);
        a.href = url;
        a.download = `dashboard-data-${today}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url); // Clean up
    }

    /**
     * Handles the file selection and reading process for importing data.
     */
    function handleImport() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json,application/json';
        input.style.display = 'none'; // Hide the input element

        input.onchange = e => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = event => {
                try {
                    const importedState = JSON.parse(event.target.result);
                    // --- CRUCIAL VALIDATION ---
                    if (importedState && importedState.user && importedState.courses) {
                         // Overwrite the entire state
                        appState.set(null, importedState);
                        alert(i18n.translate('Data imported successfully! The application will now reload.'));
                        window.location.reload();
                    } else {
                        alert(i18n.translate('Invalid data file. Please select a valid export file.'));
                    }
                } catch (error) {
                    console.error('Error parsing JSON file:', error);
                    alert(i18n.translate('Could not read the file. It may be corrupted.'));
                }
            };
            reader.readAsText(file);
        };

        document.body.appendChild(input);
        input.click();
        document.body.removeChild(input);
    }
}