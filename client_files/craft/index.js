"use strict";


/*
    Модуль крафта.

    created 20.12.19 by Carter Slade
*/

mp.craft = {

    addItemToQueue(index, item) {
        mp.callCEFV(`craft.addItemToQueue(${index}, ${JSON.stringify(item)})`);
    },
    initCrafter(crafter) {
        mp.callCEFV(`craft.initCrafter(${JSON.stringify(crafter)})`);
        mp.callCEFV(`craft.show = true`);
    },
    clearCrafter() {
        mp.callCEFV(`craft.clearCrafter()`);
    },
    setSkill(exp) {
        mp.callCEFV(`craft.skill = ${exp}`);
    },
};

mp.events.add({
    "craft.addItemToQueue": (index, item) => {
        mp.craft.addItemToQueue(index, item);
    },
    "craft.initCrafter": (crafter) => {
        mp.craft.initCrafter(crafter);
    },
    "craft.clearCrafter": () => {
        mp.craft.clearCrafter();
    },
    "craft.setSkill": (exp) => {
        mp.craft.setSkill(exp);
    },
});
