// js/utils/dom.js

/**
 * A shorthand for document.querySelector.
 * @param {string} selector - The CSS selector to find.
 * @param {Element|Document} [context=document] - The element to search within.
 * @returns {Element|null} The first matching element or null if not found.
 */
export function $(selector, context = document) {
    return context.querySelector(selector);
}

/**
 * A shorthand for document.querySelectorAll, returning an actual array.
 * @param {string} selector - The CSS selector to find.
 * @param {Element|Document} [context=document] - The element to search within.
 * @returns {Element[]} An array of matching elements.
 */
export function $$(selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
}