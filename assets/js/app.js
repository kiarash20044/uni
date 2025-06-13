document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Switcher Logic ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
    const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');
    const htmlEl = document.documentElement;

    // Function to update the icon visibility based on the current theme
    function updateThemeIcons() {
        if (htmlEl.classList.contains('dark')) {
            themeToggleDarkIcon.style.display = 'block';
            themeToggleLightIcon.style.display = 'none';
        } else {
            themeToggleDarkIcon.style.display = 'none';
            themeToggleLightIcon.style.display = 'block';
        }
    }

    // Set initial icon state on load
    updateThemeIcons();

    // Add click listener to the toggle button
    themeToggleBtn.addEventListener('click', () => {
        // Toggle the 'dark' class
        htmlEl.classList.toggle('dark');
        
        // Update localStorage with the new theme
        if (htmlEl.classList.contains('dark')) {
            localStorage.theme = 'dark';
        } else {
            localStorage.theme = 'light';
        }
        
        // Update the icons
        updateThemeIcons();
    });


    // --- Tab Navigation Logic ---
    const tabButtons = document.getElementById('tab-buttons');
    const tabContents = document.getElementById('tab-contents');

    tabButtons.addEventListener('click', (event) => {
        const selectedTab = event.target.closest('.tab-button');
        if (!selectedTab) return;

        tabButtons.querySelectorAll('.tab-button').forEach(button => button.classList.remove('active'));
        tabContents.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        selectedTab.classList.add('active');
        const tabId = selectedTab.dataset.tab;
        document.getElementById(tabId)?.classList.add('active');
    });


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
    
    // Render all Lucide icons on the page
    lucide.createIcons();
});
