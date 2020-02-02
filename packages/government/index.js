"use strict";

let bugTracker = call('bugTracker');

module.exports = {
    clothesAmmo: 0,
    // armourAmmo: 100,
    itemAmmo: 100,
    gunAmmo: 100,
    ammoAmmo: 1,
    servicePos: new mp.Vector3(246.3321533203125, 222.69009399414062, 106.28681182861328 - 1),
    serviceBlip: 525,
    restoreVehKeysPrice: 1000,

    init() {
        this.createServiceMarker();
    },
    createServiceMarker() {
        var pos = this.servicePos;
        var service = mp.markers.new(1, pos, 0.5, {
            color: [0, 187, 255, 70],
            dimension: 1
        });

        var colshape = mp.colshapes.newSphere(pos.x, pos.y, pos.z, 1.5, service.dimension);
        colshape.onEnter = (player) => {
            if (player.vehicle) return;
            var data = {
                fines: player.character.Fines,
                vehicles: player.vehicleList || [],
            };
            player.call(`government.service.showMenu`, [data]);
            player.call(`bugTracker.bugs.init`, [bugTracker.getClientBugsByAuthor(player.name)]);
        };
        colshape.onExit = (player) => {
            player.call(`selectMenu.hide`);
        };
        service.colshape = colshape;
        service.blip = mp.blips.new(this.serviceBlip, pos, {
            color: 0,
            name: `Услуги`,
            shortRange: 10,
            scale: 1,
            dimension: service.dimension
        });
    },

};
