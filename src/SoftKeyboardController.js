import { matchesSelector, getTargetElements, isIgnored } from './utils.js';

class SoftKeyboardController {
    /**
   * @param {Object} options
   * @param {string} [options.selector] - CSS selector for target inputs.
   * @param {boolean} [options.defaultEnabled=false] - Initial enabled state.
   * @param {string} [options.activation='dblclick'] - 'dblclick' | 'click' | 'doubletap' | 'manual' | null.
   * @param {boolean} [options.deactivateOnBlur=true] - Disable on focus loss.
   * @param {string} [options.inputModeEnabled='text'] - inputmode when enabled.
   * @param {string} [options.inputModeDisabled='none'] - inputmode when disabled.
   * @param {number} [options.blurDelay=10] - Delay (ms) before disabling on blur.
   * @param {Function} [options.onEnable] - Callback after enabling.
   * @param {Function} [options.onDisable] - Callback after disabling.
   * @param {string|Function} [options.ignore] - Selector or function to ignore fields.
   * @param {boolean} [options.preserveInputMode=true] - Restore original inputmode on disable.
   * @param {number} [options.doubleTapDelay=300] - Max ms between taps for doubletap detection.
   */
constructor(options = {}) {
    const {
      selector = 'input[type="text"], input[type="search"], textarea',
      defaultEnabled = false,
      activation = 'dblclick',
      deactivateOnBlur = true,
      inputModeEnabled = 'text',
      inputModeDisabled = 'none',
      blurDelay = 10,
      onEnable = null,
      onDisable = null,
      ignore = null,
      preserveInputMode = true,
      doubleTapDelay = 300,
    } = options;

    // Store options
    this._selector = selector;
    this._activation = activation;
    this._deactivateOnBlur = deactivateOnBlur;
    this._inputModeEnabled = inputModeEnabled;
    this._inputModeDisabled = inputModeDisabled;
    this._blurDelay = blurDelay;
    this._onEnable = onEnable;
    this._onDisable = onDisable;
    this._ignore = ignore;
    this._preserveInputMode = preserveInputMode;
    this._doubleTapDelay = doubleTapDelay;

    // Internal state
    this._enabled = defaultEnabled;
    this._originalInputModes = new WeakMap();
    this._destroyed = false;

    // Bound handlers (for safe removal)
    this._onActivationHandler = this._onActivationHandler.bind(this);
    this._onFocusOutHandler = this._onFocusOutHandler.bind(this);
    this._onDoubleTapHandler = this._onDoubleTapHandler.bind(this);

    // Double‑tap state
    this._lastTapTarget = null;
    this._lastTapTime = 0;

    // Initial setup
    this._bindEvents();
    this._updateKeyboard();
  }

  // ─── Public getter ──────────────────────────────────────────
  get enabled() {
    return this._enabled;
  }

  // ─── Public API ─────────────────────────────────────────────
  enable() {
    if (this._destroyed) return;
    if (this._enabled) return;
    this._enabled = true;
    this._updateKeyboard();
    if (this._onEnable) this._onEnable();
  }

  disable() {
    if (this._destroyed) return;
    if (!this._enabled) return;
    this._enabled = false;
    this._updateKeyboard();
    if (this._onDisable) this._onDisable();
  }

  toggle() {
    this._enabled ? this.disable() : this.enable();
  }

  /**
   * Refresh the controlled elements.
   * Useful when new matching inputs are added dynamically.
   */
  refresh() {
    if (this._destroyed) return;
    this._updateKeyboard();
  }

  /**
   * Change the selector and immediately apply the current state.
   */
  setSelector(newSelector) {
    if (this._destroyed) return;
    this._selector = newSelector;
    this._updateKeyboard();
  }

  /**
   * Remove all event listeners and clean up.
   */
  destroy() {
    if (this._destroyed) return;
    this._destroyed = true;

    // Remove activation listeners
    if (this._activation === 'dblclick' || this._activation === 'click') {
      document.removeEventListener(this._activation, this._onActivationHandler, true);
    } else if (this._activation === 'doubletap') {
      document.removeEventListener('click', this._onDoubleTapHandler, true);
    }

    // Remove focusout if used
    if (this._deactivateOnBlur) {
      document.removeEventListener('focusout', this._onFocusOutHandler, true);
    }

    // Clear the WeakMap (optional – will be GC'd)
    this._originalInputModes = null;
  }

  // ─── Internal methods ──────────────────────────────────────

  /** Apply current inputmode to all matching elements. */
  _updateKeyboard() {
    const elements = this._getTargetElements();

    for (const el of elements) {
      // Capture each element's original inputmode exactly once, before
      // the library ever modifies it.
      if (this._preserveInputMode && !this._originalInputModes.has(el)) {
        const original = el.getAttribute('inputmode') || '';
        this._originalInputModes.set(el, original);
      }

      if (this._enabled) {
        if (this._preserveInputMode && this._originalInputModes.has(el)) {
          // Restore the original inputmode instead of forcing inputModeEnabled.
          const original = this._originalInputModes.get(el);
          if (original) {
            el.setAttribute('inputmode', original);
          } else {
            el.removeAttribute('inputmode');
          }
        } else {
          el.setAttribute('inputmode', this._inputModeEnabled);
        }
      } else {
        el.setAttribute('inputmode', this._inputModeDisabled);
      }
    }
  }

  /** Get current target elements, filtered by ignore. */
  _getTargetElements() {
    return getTargetElements(this._selector, this._ignore);
  }

  /** Check if an element should be ignored. */
  _isIgnored(el) {
    return isIgnored(el, this._ignore);
  }

  /** Check if an element matches the current selector. */
  _isTargetMatching(el) {
    if (!el) return false;
    return matchesSelector(el, this._selector);
  }

  /** Bind event listeners based on options. */
  _bindEvents() {
    // Activation listeners
    if (this._activation === 'dblclick' || this._activation === 'click') {
      document.addEventListener(this._activation, this._onActivationHandler, true);
    } else if (this._activation === 'doubletap') {
      document.addEventListener('click', this._onDoubleTapHandler, true);
    }
    // 'manual' or null → no activation listener

    // Blur deactivation
    if (this._deactivateOnBlur) {
      document.addEventListener('focusout', this._onFocusOutHandler, true);
    }
  }

  // ─── Event handlers ────────────────────────────────────────

  _onActivationHandler(e) {
    const target = e.target;
    if (!this._isTargetMatching(target)) return;
    if (this._isIgnored(target)) return;

    this.enable();
    target.blur();
    target.focus();
  }

  _onDoubleTapHandler(e) {
    const target = e.target;
    if (!this._isTargetMatching(target)) return;
    if (this._isIgnored(target)) return;

    const now = Date.now();
    if (this._lastTapTarget === target && (now - this._lastTapTime) < this._doubleTapDelay) {
      // Double tap detected
      this._lastTapTarget = null;
      this._lastTapTime = 0;
      this.enable();
      target.blur();
      target.focus();
    } else {
      this._lastTapTarget = target;
      this._lastTapTime = now;
    }
  }

  _onFocusOutHandler(e) {
    if (!this._enabled) return;
    setTimeout(() => {
      const active = document.activeElement;
      if (!this._isTargetMatching(active) || this._isIgnored(active)) {
        this.disable();
      }
    }, this._blurDelay);
  }
}

export default SoftKeyboardController;