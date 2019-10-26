"use strict";

/*
    Модуль мира объектов ГТА.

    created 26.10.19 by Carter Slade
*/

mp.world = {

};

mp.events.add({
    "world.objects.add": (type, radius, hash) => {
        var pos = mp.players.local.position;
        var region = mp.utils.getRegionName(pos);
        var street = mp.utils.getStreetName(pos);

        var data = {
            region: region,
            street: street,
            type: type,
            pos: pos,
            radius: radius,
            hash: hash
        };

        mp.events.callRemote(`world.objects.add`, JSON.stringify(data));
    },
});
