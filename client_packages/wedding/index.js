"use strict";

/*
    Модуль свадьбы.

    created 02.10.19 by Carter Slade
*/

mp.wedding = {

};

mp.events.add({
    "wedding.add.offer": () => {
        var pos = mp.players.local.position;
        var rec = mp.utils.getNearPlayer(pos, 3);
        // rec = mp.players.local; // for tests
        if (!rec) return mp.notify.error(`Рядом никого нет`);
        if (mp.vdist(pos, rec.position) > 5) return mp.notify.error(`${rec.name} далеко`);

        mp.events.callRemote(`wedding.add.offer`, rec.remoteId);
    },
});
