// js/services/keyboardService.js

/**
 * Manages keyboard shortcuts for the application.
 */
export class KeyboardService {
    constructor(router) {
        this.router = router;
        this.shortcuts = new Map();
        this.init();
    }

    /**
     * Registers a shortcut.
     * @param {string} keyCombination - e.g., 'alt+h'
     * @param {function} callback - The function to execute.
     */
    register(keyCombination, callback) {
        this.shortcuts.set(keyCombination.toLowerCase(), callback);
    }

    /**
     * Initializes the global keydown event listener.
     */
    init() {
        document.addEventListener('keydown', (e) => {
            // Ignore shortcuts if user is typing in an input field
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }
            
            let key = e.key.toLowerCase();
            if (e.altKey) key = `alt+${key}`;
            if (e.ctrlKey) key = `ctrl+${key}`;
            if (e.shiftKey) key = `shift+${key}`;

            if (this.shortcuts.has(key)) {
                e.preventDefault();
                const action = this.shortcuts.get(key);
                action();
            }
        });
    }

    /**
     * Sets up the default navigation shortcuts for the application.
     */
    registerDefaultShortcuts() {
        this.register('alt+d', () => this.router.navigate('/'));
        this.register('alt+t', () => this.router.navigate('/tasks'));
        this.register('alt+s', () => this.router.navigate('/schedule'));
        this.register('alt+c', () => this.router.navigate('/courses'));
        this.register('alt+g', () => this.router.navigate('/grades'));
        this.register('alt+r', () => this.router.navigate('/resources'));
        this.register('alt+,', () => this.router.navigate('/settings')); // Using comma for settings
    }
}