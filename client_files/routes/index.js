"use strict";

/*
    Модуль маршрутов.

    created 08.09.19 by Carter Slade
*/

mp.routes = {
    createCheckpoint(data) {
        if (typeof data == 'string') data = JSON.parse(data);
        this.destroyCheckpoints();

        var checkpoint;
        if (!data.isMarker) {
            var pos = data.position;
            pos.z = mp.game.gameplay.getGroundZFor3dCoord(pos.x, pos.y, pos.z, false, false);
            checkpoint = mp.checkpoints.new(data.type, pos, data.scale || 1, {
                direction: data.direction || data.position,
                visible: true,
                dimension: data.dimension || 0,
                color: data.color || [255, 255, 255, 255]
            });
            checkpoint.params = {
                type: "route"
            };
        } else {
            checkpoint = mp.markers.new(data.type, data.position, data.scale || 1, {
                direction: data.direction || data.position,
                visible: true,
                dimension: data.dimension || 0,
                color: data.color || [255, 255, 255, 255]
            });
            checkpoint.params = {
                type: "route"
            };
            var colshape = mp.colshapes.newSphere(data.position.x, data.position.y, data.position.z, checkpoint.scale * 1.5);
            colshape.checkpoint = checkpoint;
        }
        mp.game.ui.setNewWaypoint(checkpoint.position.x, checkpoint.position.y);
    },
    destroyCheckpoints() {
        mp.checkpoints.forEach(checkpoint => {
            if (!checkpoint.params) return;
            if (checkpoint.params.type != "route") return;
            checkpoint.destroy();
        });
        mp.colshapes.forEach(colshape => {
            if (!colshape.checkpoint) return;
            if (!colshape.checkpoint.params) return;
            if (colshape.checkpoint.params.type != "route") return;
            colshape.checkpoint.destroy();
            colshape.destroy();
        });
    },
};

mp.events.add({
    "routes.checkpoint.create": (data) => {
        mp.routes.createCheckpoint(data);
    },
    "routes.checkpoints.destroy": () => {
        mp.routes.destroyCheckpoints();
    },
    "playerEnterCheckpoint": (checkpoint) => {
        if (!checkpoint.params) return;
        if (checkpoint.params.type != "route") return;
        var veh = mp.players.local.vehicle;
        if (veh) {
            var hoodPos = mp.utils.getHoodPosition(veh);
            if (hoodPos) {
                var hoodDist = mp.vdist(checkpoint.position, hoodPos);
                var playerDist = mp.vdist(checkpoint.position, mp.players.local.position);
                if (hoodDist > playerDist) return mp.notify.warning(`Заезжайте капотом вперед`);
            }
        }
        mp.events.callRemote(`routes.points.next`);
    },
    "playerEnterColshape": (colshape) => {
        if (!colshape.checkpoint || colshape.checkpoint.params.type != "route") return;
        var veh = mp.players.local.vehicle;
        if (veh) {
            var hoodPos = mp.utils.getHoodPosition(veh);
            if (hoodPos) {
                var hoodDist = mp.vdist(checkpoint.position, hoodPos);
                var playerDist = mp.vdist(checkpoint.position, mp.players.local.position);
                if (hoodDist > playerDist) return mp.notify.warning(`Заезжайте капотом вперед`);
            }
        }
        mp.events.callRemote(`routes.points.next`);
    },
});
