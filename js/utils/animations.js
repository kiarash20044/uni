// js/utils/animations.js

/**
 * Animates a page's content fading out.
 * @param {Element} element - The container element for the page content.
 * @param {Function} onComplete - A callback function to run after the animation completes.
 */
export function animatePageOut(element, onComplete) {
    gsap.to(element, {
        opacity: 0,
        y: 20,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: onComplete
    });
}

/**
 * Animates a page's content fading in.
 * @param {Element} element - The container element for the page content.
 */
export function animatePageIn(element) {
    // Ensure element is ready for animation
    gsap.set(element, { opacity: 0, y: -20 });

    gsap.to(element, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'power2.out',
        delay: 0.1
    });
}

/**
 * Animates a single element or a group of elements into view with a stagger effect.
 * @param {string|Element} selectorOrElement - The CSS selector or the element itself.
 * @param {object} [options={}] - GSAP animation options (e.g., delay, duration).
 */
export function animateElement(selectorOrElement, options = {}) {
    gsap.from(selectorOrElement, {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.1, // Staggers animations if multiple elements are selected
        ...options // Spread any custom options
    });
}