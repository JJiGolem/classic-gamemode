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
    },
    addItem(item, pocket, index, parent) {
        if (typeof item == 'object') item = JSON.stringify(item);
        mp.callCEFV(`inventory.addItem('${item}', ${pocket}, ${index}, ${parent})`);
    },
    deleteItem(sqlId) {
        mp.callCEFV(`inventory.deleteItem(${sqlId})`);
    },
    setSatiety(val) {
        mp.callCEFV(`inventory.satiety = ${val}`)
    },
    setThirst(val) {
        mp.callCEFV(`inventory.thirst = ${val}`)
    },
};

mp.events.add("characterInit.done", () => {
    mp.inventory.enable(true);
});

mp.events.add("inventory.initItems", mp.inventory.initItems);

mp.events.add("inventory.setItemsInfo", mp.inventory.setItemsInfo);

mp.events.add("inventory.deleteItem", mp.inventory.deleteItem);

mp.events.add("inventory.addItem", mp.inventory.addItem);

mp.events.add("inventory.setSatiety", mp.inventory.setSatiety);

mp.events.add("inventory.setThirst", mp.inventory.setThirst);
