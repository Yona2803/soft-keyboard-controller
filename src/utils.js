/**
 * Check if an element matches a selector or a custom filter function.
 * @param {Element} el
 * @param {string|Function} selector - CSS selector or function returning boolean.
 * @returns {boolean}
 */
export function matchesSelector(el, selector) {
  if (typeof selector === 'function') {
    return selector(el);
  }
  return el.matches(selector);
}

/**
 * Get all elements that match a given selector (and are not ignored).
 * @param {string} selector
 * @param {Function|string} ignore - Optional filter for ignored elements.
 * @returns {Element[]}
 */
export function getTargetElements(selector, ignore) {
  const elements = Array.from(document.querySelectorAll(selector));
  if (!ignore) return elements;
  return elements.filter(el => !isIgnored(el, ignore));
}

/**
 * Determine if an element should be ignored.
 * @param {Element} el
 * @param {Function|string} ignore
 * @returns {boolean}
 */
export function isIgnored(el, ignore) {
  if (!ignore) return false;
  if (typeof ignore === 'function') {
    return ignore(el);
  }
  return el.matches(ignore);
}