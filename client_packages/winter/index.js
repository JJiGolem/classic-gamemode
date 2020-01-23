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
    createJobPed() {
        var pos = {
            x: -629.31494140625,
            y: -1635.0389404296875,
            z: 25.974966049194336
        };
        var pedInfo = {
            model: "u_m_m_promourn_01",
            position: pos,
            heading: 201.21652221679688,
            marker: {
                x: -629.153564453125,
                y: -1635.9073486328125,
                z: 25.974946975708008 - 1,
                color: [255, 255, 125, 128],
                enterEvent: "winter.jobshape.enter",
                leaveEvent: "winter.jobshape.leave"
            },
            blip: {
                sprite: 599,
                color: 4,
                position: pos,
                name: `Уборщик`
            }
        };
        mp.events.call('NPC.create', pedInfo);
    },
};

mp.events.add({
    "characterInit.done": () => {
        /*mp.keys.bind(79, true, () => { // O
            if (mp.game.ui.isPauseMenuActive() || mp.busy.includes()) return;
            if (mp.players.local.vehicle) return;
            if (mp.players.local.dimension) return;
            if (mp.utils.inInterior(mp.players.local)) return mp.notify.warning(`Попробуйте слепить в другом месте`);
            mp.winter.takeSnowball();
        });*/
        mp.winter.createJobPed();
    },
    "winter.jobshape.enter": () => {
        mp.events.call(`selectMenu.show`, `winterJob`);
    },
    "winter.jobshape.leave": () => {
        mp.events.call(`selectMenu.hide`);
    },
});
