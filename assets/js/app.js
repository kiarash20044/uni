document.addEventListener('DOMContentLoaded', () => {
    // --- Preloader Logic ---
    const preloader = document.getElementById('preloader');

    window.addEventListener('load', () => {
        if (preloader) {
            preloader.classList.add('loaded');
            // Optional: remove the preloader from the DOM after the transition
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
    });

    // --- Theme Switcher Logic ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;

    // Immediately apply theme on initial load
    (function applyTheme() {
        const storedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = storedTheme || (systemPrefersDark ? 'dark' : 'light');

        if (theme === 'dark') {
            htmlEl.classList.add('dark');
        } else {
            htmlEl.classList.remove('dark');
        }
        updateThemeIcons();
    })();

    function setTheme(theme) {
        if (theme === 'dark') {
            htmlEl.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            htmlEl.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
        updateThemeIcons();
    }

    function updateThemeIcons() {
        const isDark = htmlEl.classList.contains('dark');
        const darkIcon = document.getElementById('theme-toggle-dark-icon');
        const lightIcon = document.getElementById('theme-toggle-light-icon');

        if (darkIcon && lightIcon) {
            darkIcon.style.display = isDark ? 'block' : 'none';
            lightIcon.style.display = isDark ? 'none' : 'block';
        }
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        // Only change the theme if the user hasn't manually set one
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });

    // Event listener for the theme toggle button
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isDark = htmlEl.classList.contains('dark');
            setTheme(isDark ? 'light' : 'dark');
        });
    }

    // Monaco Editor integration for progress JSON
    let monacoEditor = null;
    function loadMonacoEditor(callback) {
        if (window.monaco) {
            if (callback) callback();
            return;
        }
        window.require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs' } });
        window.require(['vs/editor/editor.main'], function () {
            if (callback) callback();
        });
    }

    function initProgressEditor() {
        const container = document.getElementById('progress-editor');
        if (!container) return;
        if (monacoEditor) {
            monacoEditor.dispose();
        }
        monacoEditor = monaco.editor.create(container, {
            value: JSON.stringify(getFullUserProgress(), null, 2),
            language: 'json',
            theme: document.documentElement.classList.contains('dark') ? 'vs-dark' : 'vs',
            automaticLayout: true,
            minimap: { enabled: false },
            fontSize: 13,
            scrollBeyondLastLine: false,
            roundedSelection: false,
            readOnly: false,
        });
    }

    function updateProgressEditorValue() {
        if (monacoEditor) {
            monacoEditor.setValue(JSON.stringify(getFullUserProgress(), null, 2));
        }
    }

    // Update editor theme on theme change
    function updateMonacoTheme() {
        if (monacoEditor) {
            monaco.editor.setTheme(document.documentElement.classList.contains('dark') ? 'vs-dark' : 'vs');
        }
    }

    // --- Settings Modal Logic ---
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    // Backup/restore elements
    const progressJsonTextarea = document.getElementById('progress-json');
    const copyProgressJsonBtn = document.getElementById('copy-progress-json');
    const restoreProgressJsonBtn = document.getElementById('restore-progress-json');
    const importProgressJsonTextarea = document.getElementById('import-progress-json');
    const progressJsonMessage = document.getElementById('progress-json-message');

    function getFullUserProgress() {
        return {
            computerEngineeringProgress: JSON.parse(localStorage.getItem('computerEngineeringProgress') || '{}'),
            collapsibleState: JSON.parse(localStorage.getItem('collapsibleState') || '{}'),
            theme: localStorage.getItem('theme') || null
        };
    }

    function setFullUserProgress(data) {
        if (data.computerEngineeringProgress) {
            localStorage.setItem('computerEngineeringProgress', JSON.stringify(data.computerEngineeringProgress));
        }
        if (data.collapsibleState) {
            localStorage.setItem('collapsibleState', JSON.stringify(data.collapsibleState));
        }
        if (data.theme) {
            localStorage.setItem('theme', data.theme);
        }
    }

    function updateProgressJsonTextarea() {
        if (progressJsonTextarea) {
            progressJsonTextarea.value = JSON.stringify(getFullUserProgress(), null, 2);
        }
    }

    if (settingsBtn && settingsModal && closeModalBtn) {
        settingsBtn.addEventListener('click', () => {
            settingsModal.classList.remove('hidden');
            loadMonacoEditor(() => {
                setTimeout(() => {
                    initProgressEditor();
                }, 100); // Wait for modal to render
            });
            if (progressJsonMessage) progressJsonMessage.textContent = '';
        });

        closeModalBtn.addEventListener('click', () => {
            settingsModal.classList.add('hidden');
        });

        settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal) {
                settingsModal.classList.add('hidden');
            }
        });
    }

    // Copy button
    if (copyProgressJsonBtn) {
        copyProgressJsonBtn.addEventListener('click', () => {
            if (monacoEditor) {
                const value = monacoEditor.getValue();
                navigator.clipboard.writeText(value);
                if (progressJsonMessage) {
                    progressJsonMessage.textContent = 'کد با موفقیت کپی شد!';
                    setTimeout(() => progressJsonMessage.textContent = '', 2000);
                }
            }
        });
    }
    // Restore button
    if (restoreProgressJsonBtn) {
        restoreProgressJsonBtn.addEventListener('click', () => {
            if (monacoEditor) {
                try {
                    const data = JSON.parse(monacoEditor.getValue());
                    setFullUserProgress(data);
                    if (progressJsonMessage) {
                        progressJsonMessage.textContent = 'پیشرفت با موفقیت بازیابی شد. صفحه را رفرش کنید.';
                        setTimeout(() => progressJsonMessage.textContent = '', 4000);
                    }
                    updateProgressEditorValue();
                } catch (e) {
                    if (progressJsonMessage) {
                        progressJsonMessage.textContent = 'کد وارد شده معتبر نیست!';
                        setTimeout(() => progressJsonMessage.textContent = '', 4000);
                    }
                }
            }
        });
    }

    // Keep editor in sync with progress
    function updateProgressJsonOnChange() {
        updateProgressEditorValue();
    }
    window.addEventListener('storage', updateProgressJsonOnChange);
    document.addEventListener('change', updateProgressJsonOnChange);
    // Also update on collapsible state changes
    function syncCollapsibleStateAndJson() {
        updateProgressEditorValue();
    }
    termContainers.forEach(container => {
        const header = container.querySelector('.term-header');
        if (!header) return;
        header.addEventListener('click', syncCollapsibleStateAndJson);
    });
    // Update Monaco theme on theme change
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateMonacoTheme);


    // --- Tab Navigation Logic ---
    const tabButtons = document.getElementById('tab-buttons');
    const tabContents = document.getElementById('tab-contents');

    if (tabButtons && tabContents) {
        tabButtons.addEventListener('click', (event) => {
            const selectedTab = event.target.closest('.tab-button');
            if (!selectedTab) return;

            tabButtons.querySelectorAll('.tab-button').forEach(button => button.classList.remove('active'));
            tabContents.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

            selectedTab.classList.add('active');
            const tabId = selectedTab.dataset.tab;
            document.getElementById(tabId)?.classList.add('active');
        });
    }


    // --- Progress Bar & Course Checkbox Logic ---
    const TOTAL_UNITS = 144;
    const termPlanContainer = document.getElementById('term-plan');
    const allCheckboxes = document.querySelectorAll('.course-checkbox'); // Select all checkboxes on the page
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const progressPercentage = document.getElementById('progress-percentage');
    const progressContainer = document.getElementById('progress-container');
    const termContainers = document.querySelectorAll('.term-container');

    function toPersianDigits(n) {
        const persian = {
            0: '۰', 1: '۱', 2: '۲', 3: '۳', 4: '۴', 5: '۵', 6: '۶', 7: '۷', 8: '۸', 9: '۹'
        };
        return n.toString().replace(/\d/g, (d) => persian[d]);
    }

    function updateRowStyle(checkbox) {
        const row = checkbox.closest('tr');
        if (row) {
            checkbox.checked ? row.classList.add('course-passed') : row.classList.remove('course-passed');
        }
    }

    function updateProgress() {
        let passedUnits = 0;
        allCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                passedUnits += parseInt(checkbox.dataset.unit) || 0;
            }
        });

        const remainingUnits = TOTAL_UNITS - passedUnits;
        const percentage = TOTAL_UNITS > 0 ? (passedUnits / TOTAL_UNITS) * 100 : 0;

        if(progressBar) progressBar.style.width = `${percentage}%`;
        if(progressText) progressText.textContent = `${toPersianDigits(remainingUnits)} واحد باقی مانده`;
        if(progressPercentage) progressPercentage.textContent = `${toPersianDigits(Math.round(percentage))}%`;
    }

    function updateTermProgress(termContainer) {
        const checkboxes = termContainer.querySelectorAll('.course-checkbox');
        const circle = termContainer.querySelector('.progress-ring-circle');
        const remainingUnitsText = termContainer.querySelector('.term-remaining-units');
        const progressCircleContainer = termContainer.querySelector('.term-progress-circle');


        if (!checkboxes.length || !circle || !remainingUnitsText) return;

        let totalUnits = 0;
        let passedUnits = 0;
        checkboxes.forEach(checkbox => {
            const unit = parseInt(checkbox.dataset.unit) || 0;
            totalUnits += unit;
            if (checkbox.checked) {
                passedUnits += unit;
            }
        });
        // Always use totalUnits for this term, not a global
        const remainingUnits = totalUnits - passedUnits;
        const percentage = totalUnits > 0 ? (passedUnits / totalUnits) * 100 : 0;
        const radius = circle.r.baseVal.value;
        const circumference = radius * 2 * Math.PI;
        const offset = circumference - (percentage / 100) * circumference;

        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = offset;

        if (remainingUnits === 0) {
            progressCircleContainer.classList.remove('placeholder');
            progressCircleContainer.classList.add('completed');
            remainingUnitsText.innerHTML = '<i data-lucide="check" class="w-5 h-5"></i>';
            lucide.createIcons();
        } else {
            progressCircleContainer.classList.remove('completed');
            if (passedUnits === 0) {
                progressCircleContainer.classList.add('placeholder');
            } else {
                progressCircleContainer.classList.remove('placeholder');
            }
            remainingUnitsText.textContent = toPersianDigits(remainingUnits);
        }
    }

    function saveProgress() {
        const progress = {};
        allCheckboxes.forEach(checkbox => {
            const courseName = checkbox.closest('tr')?.cells[1]?.textContent.trim();
            if (courseName) {
                progress[courseName] = checkbox.checked;
            }
        });
        localStorage.setItem('computerEngineeringProgress', JSON.stringify(progress));
    }

    function loadProgress() {
        const savedProgress = JSON.parse(localStorage.getItem('computerEngineeringProgress') || '{}');
        allCheckboxes.forEach(checkbox => {
            const courseName = checkbox.closest('tr')?.cells[1]?.textContent.trim();
            if (courseName && savedProgress[courseName]) {
                checkbox.checked = true;
            }
            updateRowStyle(checkbox);
        });
        updateProgress();
        termContainers.forEach(updateTermProgress);
    }

    // Event listener for all checkboxes
    document.querySelectorAll('.course-checkbox').forEach(checkbox => {
         checkbox.addEventListener('change', () => {
             updateRowStyle(checkbox);
             updateProgress();
             const termContainer = checkbox.closest('.term-container');
             if(termContainer) {
                updateTermProgress(termContainer);
             }
             saveProgress();
             updateProgressJsonTextarea(); // <-- Ensure JSON is updated in real time
        });
    });

    if (termPlanContainer) {
        loadProgress();
        updateProgressJsonTextarea(); // <-- Sync JSON on load
    }

    // --- Sticky Progress Bar Logic ---
    if (progressContainer) {
        const observer = new IntersectionObserver(
            ([e]) => e.target.classList.toggle('is-sticky', e.intersectionRatio < 1),
            { threshold: [1] }
        );

        observer.observe(progressContainer);
    }


    // --- Collapsible Term Sections Logic ---
    const collapsibleState = JSON.parse(localStorage.getItem('collapsibleState') || '{}');

    termContainers.forEach(container => {
        const header = container.querySelector('.term-header');
        if (!header) return;
        const content = container.querySelector('.term-content');
        const icon = header.querySelector('.term-toggle-icon');
        const termTitleElement = header.querySelector('span.font-bold');
        if (!content || !icon || !termTitleElement) return;

        const termTitle = termTitleElement.textContent.trim();

        const expandSection = () => {
            header.classList.remove('rounded-lg');
            header.classList.add('rounded-t-lg');
            content.style.maxHeight = content.scrollHeight + "px";
            icon.classList.add('rotate-180');
            collapsibleState[termTitle] = 'expanded';
        };

        const collapseSection = () => {
            header.classList.add('rounded-lg');
            header.classList.remove('rounded-t-lg');
            content.style.maxHeight = '0px';
            icon.classList.remove('rotate-180');
            collapsibleState[termTitle] = 'collapsed';
        };

        const checkboxesInTerm = Array.from(container.querySelectorAll('.course-checkbox'));
        const allChecked = checkboxesInTerm.length > 0 && checkboxesInTerm.every(cb => cb.checked);

        // Initial state logic
        if (collapsibleState[termTitle] === 'expanded') {
            expandSection();
        } else if (collapsibleState[termTitle] === 'collapsed') {
            collapseSection();
        } else {
            allChecked ? collapseSection() : expandSection();
        }

        header.addEventListener('click', () => {
            const isCollapsed = content.style.maxHeight === '0px' || !content.style.maxHeight;
            isCollapsed ? expandSection() : collapseSection();
            localStorage.setItem('collapsibleState', JSON.stringify(collapsibleState));
        });
    });

    // --- Hamburger & Sidebar Logic ---
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileSidebar = document.getElementById('mobile-sidebar');
    const closeSidebarBtn = document.getElementById('close-sidebar');
    const sidebarBackdrop = document.getElementById('sidebar-backdrop');

    const toggleSidebar = (forceOpen) => {
        const isOpen = mobileSidebar.classList.contains('is-open');
        const shouldOpen = forceOpen !== undefined ? forceOpen : !isOpen;

        mobileSidebar.classList.toggle('is-open', shouldOpen);
        sidebarBackdrop.classList.toggle('hidden', !shouldOpen);
        sidebarBackdrop.classList.toggle('is-visible', shouldOpen);
        document.body.classList.toggle('sidebar-open', shouldOpen);
    };

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleSidebar(true);
        });
    }
    if (closeSidebarBtn) {
        closeSidebarBtn.addEventListener('click', () => toggleSidebar(false));
    }
    if (sidebarBackdrop) {
        sidebarBackdrop.addEventListener('click', () => toggleSidebar(false));
    }

    // --- Sidebar Dropdown Logic ---
    const sidebar = document.getElementById('mobile-sidebar');
    if (sidebar) {
        sidebar.addEventListener('click', (e) => {
            const dropdownToggle = e.target.closest('.sidebar-dropdown-toggle');
            if (dropdownToggle) {
                const isExpanded = dropdownToggle.getAttribute('aria-expanded') === 'true';
                dropdownToggle.setAttribute('aria-expanded', !isExpanded);
            }
        });
    }


    // Render all Lucide icons on the page
    lucide.createIcons();
});
