"use strict";


/*
    Модуль крафта.

    created 20.12.19 by Carter Slade
*/

mp.craft = {

    initCrafter(crafter) {
        debug(crafter)
        mp.callCEFV(`craft.initCrafter(${JSON.stringify(crafter)})`);
        mp.callCEFV(`craft.show = true`);
    },
    clearCrafter() {
        mp.callCEFV(`craft.clearCrafter()`);
    },
};

mp.events.add({
    "craft.initCrafter": (crafter) => {
        mp.craft.initCrafter(crafter);
    },
    "craft.clearCrafter": () => {
        mp.craft.clearCrafter();
    },
});
