import { SoftKeyboardController } from "../dist/index.mjs";

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

console.info('Demo is on')