"use strict";

let bugTracker = call('bugTracker');

module.exports = {
    // Кол-во боеприпасов, списываемое за выдачу формы
    clothesAmmo: 0,
    // Кол-во боеприпасов, списываемое за выдачу бронежилета
    // armourAmmo: 100,
    // Кол-во боеприпасов, списываемое за выдачу снаряжения
    itemAmmo: 100,
    // Кол-во боеприпасов, списываемое за выдачу оружия
    gunAmmo: 100,
    // Кол-во боеприпасов, списываемое за выдачу патронов
    ammoAmmo: 1,
    // Позиция маркера с услугами правительства
    servicePos: new mp.Vector3(246.3321533203125, 222.69009399414062, 106.28681182861328 - 1),
    // Блип на маркере с услугами правительства
    serviceBlip: 525,
    // Стоимость восстановления ключей от авто
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
