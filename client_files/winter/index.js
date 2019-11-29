"use strict";

/*
    Модуль зимы.

    created 30.11.19 by Carter Slade
*/

mp.winter = {
    lastTakeSnowballTime: 0,
    waitSnowballTime: 3000,

    takeSnowball() {
        if (this.isFlood()) return;
        mp.events.callRemote(`winter.takeSnowball`);
    },
    isFlood() {
        var flood = Date.now() - this.lastTakeSnowballTime < this.waitSnowballTime;
        this.lastTakeSnowballTime = Date.now();
        return flood;
    },
};

mp.events.add({
    "characterInit.done": () => {
        mp.keys.bind(79, true, () => { // O
            if (mp.game.ui.isPauseMenuActive() || mp.busy.includes()) return;
            if (mp.players.local.vehicle) return;
            if (mp.players.local.dimension) return;
            if (mp.utils.inInterior(mp.players.local)) return;
            mp.winter.takeSnowball();
        });
    },
});
