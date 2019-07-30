"use strict";


/*
    Модуль инвентаря.

    created 30.07.19 by Carter Slade
*/

mp.inventory = {
    enable(enable) {
        mp.callCEFV(`inventory.enable = ${enable}`);
    },
    initItems(items) {
        if (typeof items == 'object') items = JSON.stringify(items);
        mp.callCEFV(`inventory.initItems('${items}')`);
    }
};

mp.events.add("characterInit.done", () => {
    mp.inventory.enable(true);
});

mp.events.add("inventory.initItems", (items) => {
    mp.inventory.initItems(items);
});
