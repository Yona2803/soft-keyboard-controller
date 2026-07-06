# Soft Keyboard Controller

A lightweight, dependency-free JavaScript library that gives you control over when the browser's **soft (soft) keyboard** is allowed to appear.

Designed especially for:

* 📦 Warehouse applications
* 📱 Android PDA / Barcode Scanner devices
* 🏪 Inventory management systems
* 🛒 POS systems
* 🌐 Progressive Web Apps (PWA)

Instead of constantly showing the on-screen keyboard, the library uses the standard HTML `inputmode` attribute to suppress it until the user intentionally enables it.

---

## Features

* ✅ Zero dependencies
* ✅ Framework agnostic (Vanilla JS, React, Vue, Angular, Svelte, etc.)
* ✅ Supports dynamic DOM elements
* ✅ Enable/Disable keyboard globally
* ✅ Automatic disable when all inputs lose focus
* ✅ Double-click activation
* ✅ Double-tap activation (mobile-friendly)
* ✅ Manual activation mode
* ✅ Configurable selectors
* ✅ Preserve original `inputmode`
* ✅ Ignore specific inputs
* ✅ Lifecycle callbacks
* ✅ Destroy and cleanup
* ✅ Tiny footprint

---

## Installation

### npm

```bash
npm install soft-keyboard-controller
```

### Yarn

```bash
yarn add soft-keyboard-controller
```

### pnpm

```bash
pnpm add soft-keyboard-controller
```

---

## Basic Usage

```javascript
import SoftKeyboardController from "soft-keyboard-controller";

const keyboard = new SoftKeyboardController();
```

By default:

* Soft keyboard starts **disabled**
* Double-clicking an input enables it
* Keyboard stays enabled while an input is focused
* Keyboard automatically disables when no supported input has focus

---

## Configuration

```javascript
const keyboard = new SoftKeyboardController({

    selector:
        'input[type="text"], input[type="search"], textarea',

    defaultEnabled: false,

    activation: "dblclick",

    deactivateOnBlur: true,

    blurDelay: 10,

    inputModeEnabled: "text",

    inputModeDisabled: "none",

    preserveInputMode: true,

    ignore: ".no-keyboard",

    onEnable() {
        console.log("Keyboard enabled");
    },

    onDisable() {
        console.log("Keyboard disabled");
    }

});
```

---

# Options

| Option            | Type              | Default      | Description                               |
| ----------------- | ----------------- | ------------ | ----------------------------------------- |
| selector          | string            | text inputs  | CSS selector of controlled elements       |
| defaultEnabled    | boolean           | false        | Initial keyboard state                    |
| activation        | string            | `"dblclick"` | Activation method                         |
| deactivateOnBlur  | boolean           | true         | Disable when all inputs lose focus        |
| blurDelay         | number            | 10           | Delay before blur check (ms)              |
| doubleTapDelay    | number            | 300          | Maximum time (ms) between taps for double‑tap detection.|
| inputModeEnabled  | string            | `"text"`     | inputmode applied when enabled            |
| inputModeDisabled | string            | `"none"`     | inputmode applied when disabled           |
| preserveInputMode | boolean           | true         | Restore each element's original inputmode |
| ignore            | string | function | null         | Ignore elements                           |

---

# Activation Modes

## Double Click

```javascript
activation: "dblclick"
```

Desktop-friendly.

---

## Double Tap

```javascript
activation: "doubletap"
```

Recommended for Android PDA devices.

---

## Click

```javascript
activation: "click"
```

Enable keyboard with a single click.

---

## Manual

```javascript
activation: "manual"
```

The library never enables the keyboard automatically.

You control it yourself:

```javascript
keyboard.enable();
```

---

# Public API

## enable()

Enable the soft keyboard globally.

```javascript
keyboard.enable();
```

---

## disable()

Disable the soft keyboard globally.

```javascript
keyboard.disable();
```

---

## toggle()

Toggle the current state.

```javascript
keyboard.toggle();
```

---

## refresh()

Refresh controlled elements.

Useful when new inputs are added dynamically.

```javascript
keyboard.refresh();
```

---

## destroy()

Removes all event listeners.

```javascript
keyboard.destroy();
```

---

## setSelector()

Change controlled elements.

```javascript
keyboard.setSelector(".scan-input");
```

---

# Properties

## enabled

Returns current keyboard state.

```javascript
if (keyboard.enabled) {

}
```

---

# Ignoring Elements

Using a selector:

```javascript
ignore: ".manual-only"
```

```html
<input class="manual-only">
```

---

Using a function:

```javascript
ignore(element) {
    return element.dataset.keyboard === "false";
}
```

```html
<input data-keyboard="false">
```

---

# Preserve Original Input Mode

The library remembers the original `inputmode` of every element.

Example:

```html
<input inputmode="numeric">
```

When enabled, the library restores:

```text
numeric
```

instead of forcing:

```text
text
```

---

# Dynamic Inputs

Works with dynamically added elements.

```javascript
document.body.insertAdjacentHTML(
    "beforeend",
    '<input type="text">'
);

keyboard.refresh();
```

---

# React Example

```javascript
import { useEffect } from "react";
import SoftKeyboardController from "soft-keyboard-controller";

export default function App() {

    useEffect(() => {

        const keyboard =
            new SoftKeyboardController();

        return () => keyboard.destroy();

    }, []);

    return (
        <input type="text" />
    );

}
```

---

# Vue Example

```javascript
import SoftKeyboardController
from "soft-keyboard-controller";

const keyboard =
new SoftKeyboardController();
```

---

# Scanner Workflow

Recommended settings for Android PDA devices.

```javascript
new SoftKeyboardController({

    activation: "doubletap",

    defaultEnabled: false,

    deactivateOnBlur: true

});
```

Workflow:

1. User scans barcode.
2. Soft keyboard stays hidden.
3. User double taps an input.
4. Keyboard appears.
5. User can move between fields.
6. Clicking outside disables the keyboard again.

---

# Browser Support

Supports modern browsers that implement the HTML `inputmode` attribute.

* Chrome
* Edge
* Firefox (partial)
* Safari
* Android Chrome
* Android WebView
* Most enterprise Android PDA browsers

---

# Limitations

This library **does not directly control the operating system keyboard**.

Instead, it uses the standard HTML `inputmode` attribute, allowing browsers that support it to suppress the soft keyboard.

Some older Android WebViews may ignore `inputmode="none"`.

---

# Contributing

Issues and pull requests are welcome.

Please open an issue before submitting major changes.

---

# License

MIT License

---

## 🍉 Solidarity & Action

If this project has helped you, please consider taking a moment to support the people of Gaza.

- 🏥 [Medical Aid for Palestinians (MAP)](https://www.map.org.uk/)
- 🍽️ [World Food Programme - Palestine](https://www.wfp.org/emergencies/palestine-emergency)
- 📰 [Decolonize Palestine (Educational Resource)](https://decolonizepalestine.com)

[![Stands with Palestine](https://img.shields.io/badge/Standswith-Palestine-brightgreen?style=flat-square&logo=appveyor&logoColor=white&labelColor=black&color=00b300)](https://decolonizepalestine.com)
