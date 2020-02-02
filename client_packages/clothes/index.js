"use strict";

mp.clothes = {
    checkTime: 2 * 60 * 1000,

    initTimer() {
        mp.timer.addInterval(() => {
            mp.events.callRemote("clothes.clime.check");
        }, this.checkTime);
    },
};

mp.events.add({
    "characterInit.done": () => {
        mp.clothes.initTimer();
    },
});
