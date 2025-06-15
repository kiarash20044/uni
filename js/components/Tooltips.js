// js/components/Tooltips.js

/**
 * Initializes Tippy.js tooltips on elements with the 'data-tooltip' attribute.
 */
export function initTooltips() {
    tippy('[data-tooltip]', {
        content(reference) {
            return reference.getAttribute('data-tooltip');
        },
        animation: 'scale-subtle',
        theme: 'translucent',
        placement: 'top',
    });
}