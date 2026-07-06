// Soft Keyboard Controller — demo wiring (vanilla JS, no build step required)
import {SoftKeyboardController} from "../dist/index.mjs";

(() => {
  const $ = (sel) => document.querySelector(sel);

  const logEl = $("#log");
  const statusPill = $("#status-pill");
  const activationPill = $("#activation-pill");
  const enabledReadout = $("#enabled-readout");

  let keyboard = null;
  let observers = [];

  // ── Logging ──────────────────────────────────────────────
  function log(message) {
    const time = new Date().toLocaleTimeString();
    logEl.textContent += `[${time}] ${message}\n`;
    logEl.scrollTop = logEl.scrollHeight;
  }

  $("#btn-clear-log").addEventListener("click", () => {
    logEl.textContent = "";
  });

  // ── Status readouts ──────────────────────────────────────
  function refreshStatus() {
    if (!keyboard) {
      statusPill.textContent = "keyboard: destroyed";
      statusPill.className = "pill pill-off";
      enabledReadout.textContent = "— (no instance)";
      return;
    }
    const on = keyboard.enabled;
    statusPill.textContent = `keyboard: ${on ? "enabled" : "disabled"}`;
    statusPill.className = `pill ${on ? "pill-on" : "pill-off"}`;
    enabledReadout.textContent = String(on);
  }

  // ── inputmode live readouts (via MutationObserver) ───────
  function watchModeReadouts() {
    // Disconnect any previous observers before re-scanning the DOM
    observers.forEach((o) => o.disconnect());
    observers = [];

    document.querySelectorAll("[data-demo-input]").forEach((input) => {
      const readout = input.parentElement.querySelector("[data-mode-for]");
      if (!readout) return;

      const paint = () => {
        const mode = input.getAttribute("inputmode");
        readout.textContent = mode === null ? "(none)" : mode;
        readout.classList.toggle("mode-none", mode === "none" || mode === null);
        readout.classList.toggle("mode-set", mode !== "none" && mode !== null);
      };

      paint();
      const observer = new MutationObserver(paint);
      observer.observe(input, {
        attributes: true,
        attributeFilter: ["inputmode"],
      });
      observers.push(observer);
    });
  }

  // ── Build options object from the Configuration form ─────
  function readOptionsFromForm() {
    const useFnIgnore = $("#opt-ignore-fn").checked;
    const ignoreSelector = $("#opt-ignore").value.trim();

    return {
      selector: $("#opt-selector").value,
      activation: $("#opt-activation").value,
      defaultEnabled: $("#opt-defaultEnabled").value === "true",
      deactivateOnBlur: $("#opt-deactivateOnBlur").value === "true",
      preserveInputMode: $("#opt-preserveInputMode").value === "true",
      blurDelay: Number($("#opt-blurDelay").value) || 0,
      doubleTapDelay: Number($("#opt-doubleTapDelay").value) || 0,
      inputModeEnabled: $("#opt-inputModeEnabled").value || "text",
      inputModeDisabled: $("#opt-inputModeDisabled").value || "none",
      // ignore: either a CSS selector string, a function, or null (disabled)
      ignore: useFnIgnore
        ? (el) => el.dataset.keyboard === "false"
        : ignoreSelector || null,
      onEnable() {
        log("onEnable() fired");
        refreshStatus();
      },
      onDisable() {
        log("onDisable() fired");
        refreshStatus();
      },
    };
  }

  // ── Init / Reinit ─────────────────────────────────────────
  function initController() {
    if (keyboard) {
      keyboard.destroy();
      log("destroy() called on previous instance");
    }

    const options = readOptionsFromForm();
    keyboard = new SoftKeyboardController(options);

    activationPill.textContent = `activation: ${options.activation}`;
    log(
      `new SoftKeyboardController({ activation: "${options.activation}", ignore: ${
        typeof options.ignore === "function"
          ? "fn()"
          : JSON.stringify(options.ignore)
      }, ... })`,
    );

    refreshStatus();
    watchModeReadouts();
  }

  $("#btn-apply").addEventListener("click", initController);
  $("#opt-ignore-fn").addEventListener("change", initController);

  // ── Public API buttons ────────────────────────────────────
  $("#btn-enable").addEventListener("click", () => {
    keyboard?.enable();
    log("enable() called");
    refreshStatus();
  });

  $("#btn-disable").addEventListener("click", () => {
    keyboard?.disable();
    log("disable() called");
    refreshStatus();
  });

  $("#btn-toggle").addEventListener("click", () => {
    keyboard?.toggle();
    log("toggle() called");
    refreshStatus();
  });

  $("#btn-refresh").addEventListener("click", () => {
    keyboard?.refresh();
    log("refresh() called");
  });

  $("#btn-setselector").addEventListener("click", () => {
    const val = $("#setselector-input").value.trim();
    if (!val || !keyboard) return;
    keyboard.setSelector(val);
    log(`setSelector("${val}") called`);
  });

  $("#btn-destroy").addEventListener("click", () => {
    keyboard?.destroy();
    keyboard = null;
    log("destroy() called — instance is now inert");
    refreshStatus();
  });

  // ── Dynamic inputs (README "Dynamic Inputs" example) ──────
  $("#btn-add-dynamic").addEventListener("click", () => {
    const container = $("#dynamic-inputs-container");
    const wrapper = document.createElement("label");
    const count = container.children.length + 1;
    wrapper.innerHTML = `
      Dynamic input #${count}
      <input type="text" data-demo-input placeholder="Added at runtime">
      <small class="mode-readout" data-mode-for></small>
    `;
    container.appendChild(wrapper);

    keyboard?.refresh();
    log(`Added dynamic input #${count} and called refresh()`);
    watchModeReadouts();
  });

  // ── Boot ───────────────────────────────────────────────────
  initController();
})();
