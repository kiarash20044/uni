// js/components/StatCard.js

/**
 * Renders the HTML for a single statistic card.
 * @param {object} stat - The statistic object { value, label, icon }.
 * @param {I18nService} i18n - The internationalization service instance.
 * @returns {string} The HTML string for the stat card.
 */
export function renderStatCard(stat, i18n) {
    const { value, label, icon } = stat;
    return `
        <div class="stat-card box glassmorphism">
            <div class="stat-icon">${icon}</div>
            <div class="stat-details">
                <p class="stat-value is-family-monospace">${i18n.formatNumber(value)}</p>
                <p class="stat-label">${i18n.translate(label)}</p>
            </div>
        </div>
    `;
}