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
    // Блипы мусорок
    blips: [],

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
        if (mp.busy.includes()) return;
        var player = mp.players.local;
        if (player.vehicle) return;
        mp.notify.warning(`Ищем мусор...`);
        var time = mp.utils.randomInteger(this.waitTrash[0], this.waitTrash[1]);
        mp.events.callRemote(`animations.playById`, 542);

        this.stopFinding();
        this.trashTimer = mp.timer.add(() => {
            this.stopFinding();
            mp.events.callRemote(`bins.trash.take`);
        }, time);
        this.finding = true;
    },
    stopFinding() {
        mp.timer.remove(this.trashTimer);
        if (this.finding) {
            mp.events.callRemote(`animations.stop`);
        }
        this.finding = false;
    },
    showBlips(list) {
        this.hideBlips();
        list.forEach(el => {
            var pos = {
                x: el.x,
                y: el.y,
                z: el.z,
            };
            this.blips.push(mp.blips.new(1, pos));
        });
    },
    hideBlips() {
        this.blips.forEach(blip => {
            blip.destroy();
        })
        this.blips = [];
    },
};

mp.events.add({
    "characterInit.done": () => {
        mp.keys.bind(69, true, () => {
            if (mp.game.ui.isPauseMenuActive()) return;
            mp.bins.trashHandler();
        }); // E
    },
    "bins.inside": (enable) => {
        mp.bins.setInside(enable);
    },
    "bins.blips.show": (list) => {
        mp.bins.showBlips(list);
    },
    "bins.blips.hide": () => {
        mp.bins.hideBlips();
    }
});
