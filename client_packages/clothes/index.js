"use strict";


/*
    Модуль одежды.

    created 29.09.19 by Carter Slade
*/

mp.clothes = {
    // Интервал проверки, тепло/холодно ли одет игрок (ms)
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
