// js/utils/animations.js

/**
 * Fades in a given HTML element.
 * @param {HTMLElement} element The element to animate.
 * @param {object} options GSAP options object (e.g., duration, stagger).
 */
export function fadeIn(element, options = {}) {
    const defaults = {
        duration: 0.6,
        opacity: 0,
        y: 15,
        ease: 'power2.out',
        stagger: 0
    };
    
    gsap.from(element.children, { ...defaults, ...options });
}

/**
 * Fades out a given HTML element.
 * @param {HTMLElement} element The element to animate.
 * @param {function} onComplete A callback function to run after animation completes.
 */
export function fadeOut(element, onComplete) {
    gsap.to(element, {
        duration: 0.3,
        opacity: 0,
        y: -10,
        ease: 'power2.in',
        onComplete: onComplete
    });
}