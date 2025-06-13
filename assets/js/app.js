document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Switcher Logic ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
    const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');
    const htmlEl = document.documentElement;

    function setTheme(theme, smooth = false) {
        if (smooth) {
            htmlEl.classList.add('theme-transition');
            setTimeout(() => {
                htmlEl.classList.remove('theme-transition');
            }, 500); // match CSS duration
        }
        if (theme === 'dark') {
            htmlEl.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            htmlEl.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
        updateThemeIcons();
    }

    function getPreferredTheme() {
        if (localStorage.getItem('theme')) {
            return localStorage.getItem('theme');
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function updateThemeIcons() {
        if (htmlEl.classList.contains('dark')) {
            themeToggleDarkIcon.style.display = 'block';
            themeToggleLightIcon.style.display = 'none';
        } else {
            themeToggleDarkIcon.style.display = 'none';
            themeToggleLightIcon.style.display = 'block';
        }
    }

    setTheme(getPreferredTheme());

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            setTheme(htmlEl.classList.contains('dark') ? 'light' : 'dark', true);
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
    const tabButtonsContainer = document.getElementById('tab-buttons');
    const tabContents = document.getElementById('tab-contents');
    const tabUnderline = document.querySelector('#tab-buttons::after');


    function updateUnderline(activeTab) {
        const underline = tabButtonsContainer.style;
        underline.setProperty('--underline-width', `${activeTab.offsetWidth}px`);
        underline.setProperty('--underline-offset', `${activeTab.offsetLeft}px`);
    }

    tabButtonsContainer.addEventListener('click', (event) => {
        const selectedTab = event.target.closest('.tab-button');
        if (!selectedTab) return;

        // Remove active from all buttons and content
        tabButtonsContainer.querySelectorAll('.tab-button').forEach(button => button.classList.remove('active'));
        tabContents.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        // Add active to clicked button and corresponding content
        selectedTab.classList.add('active');
        const tabId = selectedTab.dataset.tab;
        document.getElementById(tabId)?.classList.add('active');

        // Move the underline
        const underline = document.querySelector('#tab-buttons::after');
        if (underline) {
            underline.style.width = `${selectedTab.offsetWidth}px`;
            underline.style.left = `${selectedTab.offsetLeft}px`;
        }

    });

    // Set initial underline position
    const initialActiveTab = document.querySelector('.tab-button.active');
    if (initialActiveTab) {
        const underline = document.querySelector('#tab-buttons::after');
        if (underline) {
            underline.style.width = `${initialActiveTab.offsetWidth}px`;
            underline.style.left = `${initialActiveTab.offsetLeft}px`;
        }
    }


    // --- Progress Bar & Course Checkbox Logic ---
    const TOTAL_UNITS = 144;
    const termPlanContainer = document.getElementById('term-plan');
    const allCheckboxLabels = termPlanContainer.querySelectorAll('.custom-checkbox-label');
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
        progressBar.style.width = `${percentage}%`;
        progressText.textContent = `${Math.round(percentage)}%`;
        progressUnits.textContent = `${passedUnits} از ${TOTAL_UNITS} واحد`;
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

    loadProgress();


    // --- Collapsible Term Sections Logic ---
    const collapsibleState = JSON.parse(localStorage.getItem('collapsibleState') || '{}');
    const termContainers = document.querySelectorAll('.term-container');

    termContainers.forEach(container => {
        const header = container.querySelector('.term-header');
        if (!header) return;
        const content = container.querySelector('.term-content');
        const icon = header.querySelector('.term-toggle-icon');
        const termTitleElement = header.querySelector('span');
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
        mobileSidebar.classList.remove('translate-x-full');
        mobileSidebar.classList.add('translate-x-0');
        sidebarBackdrop.classList.add('show');
        sidebarBackdrop.classList.remove('hide', 'hidden');
        document.body.style.overflow = 'hidden';
    }
    function closeSidebar() {
        mobileSidebar.classList.remove('translate-x-0');
        mobileSidebar.classList.add('translate-x-full');
        sidebarBackdrop.classList.add('hide');
        sidebarBackdrop.classList.remove('show');
        setTimeout(() => {
            sidebarBackdrop.classList.add('hidden');
            document.body.style.overflow = '';
        }, 300);
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
