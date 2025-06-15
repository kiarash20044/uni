// js/components/CircularProgress.js

/**
 * Creates the HTML for a circular progress card.
 * @param {object} props - The properties for the progress card.
 * @param {string} props.id - A unique ID for the card element.
 * @param {string} props.label - The text label for the card.
 * @param {number} props.value - The current value.
 * @param {number} props.max - The maximum value.
 * @param {string} props.iconSVG - The SVG string for the icon.
 * @returns {string} The HTML string for the component.
 */
export function createCircularProgress({ id, label, value, max, iconSVG }) {
    const percentage = max > 0 ? (value / max) * 100 : 0;
    
    return `
        <div class="stat-card circular-progress-card" id="${id}">
            <div class="progress-container">
                <svg class="progress-ring" width="120" height="120" viewBox="0 0 120 120">
                    <circle class="progress-ring-track" cx="60" cy="60" r="54" />
                    <circle class="progress-ring-indicator" cx="60" cy="60" r="54" />
                </svg>
                <div class="progress-text">
                    <div class="progress-value">${value}</div>
                    <div class="progress-max">/ ${max}</div>
                </div>
                <div class="card-icon">
                    ${iconSVG}
                </div>
            </div>
            <p class="card-label">${label}</p>
        </div>
    `;
}

/**
 * Initializes the animation for a specific circular progress bar.
 * @param {string} id - The ID of the card element.
 * @param {number} value - The current value.
 * @param {number} max - The maximum value.
 */
export function initCircularProgressAnimation(id, value, max) {
    const element = document.getElementById(id);
    if (!element) return;

    const indicator = element.querySelector('.progress-ring-indicator');
    const valueText = element.querySelector('.progress-value');
    
    const radius = indicator.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    const percentage = max > 0 ? value / max : 0;
    const offset = circumference - percentage * circumference;

    indicator.style.strokeDasharray = `${circumference} ${circumference}`;
    indicator.style.strokeDashoffset = circumference;

    gsap.to(indicator, {
        strokeDashoffset: offset,
        duration: 1.5,
        ease: 'power2.out',
        delay: 0.2
    });
    
    // Animate the text value counting up
    gsap.fromTo(valueText, 
        { innerText: 0 }, 
        { 
            innerText: value, 
            duration: 1.5, 
            ease: 'power2.out',
            delay: 0.2,
            snap: { innerText: 1 } // ensure we snap to whole numbers for integer values
        }
    );
}