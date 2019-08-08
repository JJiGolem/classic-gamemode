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
    },
    setItemsInfo(itemsInfo) {
        if (typeof itemsInfo == 'object') itemsInfo = JSON.stringify(itemsInfo);
        mp.callCEFV(`inventory.setItemsInfo('${itemsInfo}')`);
    }
};

mp.events.add("characterInit.done", () => {
    mp.inventory.enable(true);
});

mp.events.add("inventory.initItems", (items) => {
    mp.inventory.initItems(items);
});

mp.events.add("inventory.setItemsInfo", (itemsInfo) => {
    mp.inventory.setItemsInfo(itemsInfo);
});
