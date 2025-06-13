document.addEventListener('DOMContentLoaded', () => {
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

    // --- Settings Modal Logic ---
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');

    if (settingsBtn && settingsModal && closeModalBtn) {
        settingsBtn.addEventListener('click', () => {
            settingsModal.classList.remove('hidden');
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
    const progressUnits = document.getElementById('progress-units');

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

        const percentage = TOTAL_UNITS > 0 ? (passedUnits / TOTAL_UNITS) * 100 : 0;
        if(progressBar) progressBar.style.width = `${percentage}%`;
        if(progressText) progressText.textContent = `${Math.round(percentage)}%`;
        if(progressUnits) progressUnits.textContent = `${passedUnits} из ${TOTAL_UNITS} واحد`;
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
    }

    // Event listener for all checkboxes
    document.querySelectorAll('.course-checkbox').forEach(checkbox => {
         checkbox.addEventListener('change', () => {
             updateRowStyle(checkbox);
             updateProgress();
             saveProgress();
        });
    });

    if (termPlanContainer) {
        loadProgress();
    }


    // --- Collapsible Term Sections Logic ---
    const collapsibleState = JSON.parse(localStorage.getItem('collapsibleState') || '{}');
    const termContainers = document.querySelectorAll('.term-container');

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

    function openSidebar() {
        if(mobileSidebar) {
            mobileSidebar.classList.remove('translate-x-full');
            mobileSidebar.classList.add('translate-x-0');
        }
        if(sidebarBackdrop) {
            sidebarBackdrop.classList.add('show');
            sidebarBackdrop.classList.remove('hide', 'hidden');
        }
        document.body.style.overflow = 'hidden';
    }
    function closeSidebar() {
        if(mobileSidebar) {
            mobileSidebar.classList.remove('translate-x-0');
            mobileSidebar.classList.add('translate-x-full');
        }
        if(sidebarBackdrop) {
            sidebarBackdrop.classList.add('hide');
            sidebarBackdrop.classList.remove('show');
            setTimeout(() => {
                sidebarBackdrop.classList.add('hidden');
                document.body.style.overflow = '';
            }, 300);
        }
    }
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', openSidebar);
    }
    if (closeSidebarBtn) {
        closeSidebarBtn.addEventListener('click', closeSidebar);
    }
    if (sidebarBackdrop) {
        sidebarBackdrop.addEventListener('click', closeSidebar);
    }

    // Render all Lucide icons on the page
    lucide.createIcons();
});
