"use strict";

/*
    Модуль мусорок.

    created 02.10.19 by Carter Slade
*/

mp.bins = {
    // Находимся возле мусорки
    inside: false,
    // Время поиска мусора (ms)
    waitTrash: [5000, 15000],
    // Таймер на поиск мусора
    trashTimer: null,
    // Ищет мусор в данный момент
    finding: false,

    setInside(enable) {
        if (enable) mp.prompt.showByName(`bin`);
        else {
            this.stopFinding();
            mp.prompt.hide();
        }
        this.inside = enable;
    },
    trashHandler() {
        if (!this.inside) return;
        if (this.finding) return;
        mp.notify.warning(`Ищем мусор...`);
        var time = mp.utils.randomInteger(this.waitTrash[0], this.waitTrash[1]);

        this.stopFinding();
        this.trashTimer = setTimeout(() => {
            this.stopFinding();
            mp.events.callRemote(`bins.trash.take`);
        }, time);
        this.finding = true;
    },
    stopFinding() {
        clearTimeout(this.trashTimer);
        this.finding = false;
    },
};

mp.events.add({
    "characterInit.done": () => {
        mp.keys.bind(69, true, () => {
            mp.bins.trashHandler();
        }); // E
    },
    "bins.inside": (enable) => {
        mp.bins.setInside(enable);
    },
});
