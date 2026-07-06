# Demo

A dependency-free, single-page playground for every feature described in the root [README.md](../README.md): all constructor options, all public API methods, `preserveInputMode`, selector- and function-based `ignore`, dynamic inputs, and the `onEnable`/`onDisable` callbacks.

Built with plain HTML + vanilla JavaScript + [Pico CSS](https://picocss.com/) (via CDN) — no bundler, no npm install required to run it.

## Running it

The demo loads the library from the built UMD bundle at `../dist/index.min.js`, so build the library first:

```bash
# from the project root
npm install
npm run build
```

Then just open the file directly in a browser:

```bash
# from the project root
open example/index.html      # macOS
start example/index.html     # Windows
xdg-open example/index.html  # Linux
```

Or serve it locally (optional, only needed if your browser blocks local file access for some reason):

```bash
npx serve .
```

## What to try

1. **Configuration panel** — change any option (selector, activation mode, `deactivateOnBlur`, `blurDelay`, `doubleTapDelay`, `preserveInputMode`, `ignore`, `inputModeEnabled`/`inputModeDisabled`) and click **Apply & Reinitialize** to rebuild the controller with those options, live.
2. **Public API panel** — call `enable()`, `disable()`, `toggle()`, `refresh()`, `setSelector()`, and `destroy()` directly and watch `keyboard.enabled` update.
3. **Test inputs** — each field shows its live `inputmode` attribute so you can see exactly what the library is doing, including the `preserveInputMode` restoration of `inputmode="numeric"` and the default `.no-keyboard` ignore class.
4. **Dynamic inputs** — add a brand-new input at runtime and call `refresh()`, per the README's "Dynamic Inputs" section.
5. **Function-based ignore** — toggle a checkbox to swap the `ignore` option from a CSS selector to a function (`el.dataset.keyboard === "false"`).
6. **Activity log** — every API call and every `onEnable`/`onDisable` callback firing is timestamped here.
