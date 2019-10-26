"use strict";

/*
    Модуль мира объектов ГТА.

    created 26.10.19 by Carter Slade
*/

mp.world = {
    // Показанные объекты для настройки
    debugObjects: [],

    clearDebugObjects() {
        this.debugObjects.forEach(obj => {
            obj.blip.destroy();
            obj.marker.destroy();
        });
        this.debugObjects = [];
    },
};

mp.events.add({
    "world.objects.add": (type, radius, hash, name) => {
        var pos = mp.players.local.position;
        var region = mp.utils.getRegionName(pos);
        var street = mp.utils.getStreetName(pos);

        var data = {
            region: region,
            street: street,
            type: type,
            name: name,
            pos: pos,
            radius: radius,
            hash: hash
        };

        mp.events.callRemote(`world.objects.add`, JSON.stringify(data));

        var blip = mp.blips.new(1, pos);
        var marker = mp.markers.new(1, pos, data.radius);
        mp.world.debugObjects.push({
            blip: blip,
            marker: marker,
        });
    },
    "world.objects.delete": (id) => {
        var i = mp.world.debugObjects.findIndex(x => x.db && x.db.id == id);
        if (i != -1) {
            var obj = mp.world.debugObjects[i];
            obj.blip.destroy();
            obj.marker.destroy();
            mp.world.debugObjects.splice(i, 1);
        }
    },
    "world.objects.params.set": (id, key, value) => {
        var i = mp.world.debugObjects.findIndex(x => x.db && x.db.id == id);
        if (i != -1) {
            var obj = mp.world.debugObjects[i];
            obj.db[key] = value;
        }
    },
    "world.objects.show": (list) => {
        mp.world.clearDebugObjects();
        list.forEach(el => {
            el.pos = JSON.parse(el.pos);
            var blip = mp.blips.new(1, el.pos);
            var marker = mp.markers.new(1, el.pos, el.radius);
            mp.world.debugObjects.push({
                db: el,
                blip: blip,
                marker: marker,
            });
        });
    },
    "render": () => {
        mp.world.debugObjects.forEach(obj => {
            if (!obj.db) return;
            var pos2d = mp.game.graphics.world3dToScreen2d(obj.marker.position);
            if (pos2d) mp.utils.drawText2d(`ID: ${obj.db.id}\nHASH: ${obj.db.hash}\nNAME: ${obj.db.name}`, [pos2d.x, pos2d.y]);
        });
    },
});
