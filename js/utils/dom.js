// js/utils/dom.js

/**
 * A simple utility function to query the DOM.
 * @param {string} selector The CSS selector to find.
 * @param {Element} [scope=document] The scope to search within.
 * @returns {Element} The first matching element.
 */
export function qs(selector, scope = document) {
    return scope.querySelector(selector);
}

/**
 * A simple utility function to query the DOM for multiple elements.
 * @param {string} selector The CSS selector to find.
 * @param {Element} [scope=document] The scope to search within.
 * @returns {NodeList} A NodeList of matching elements.
 */
export function qsa(selector, scope = document) {
    return scope.querySelectorAll(selector);
}