"use strict";

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
    servicePos: new mp.Vector3(-541.71, -209.9, 37.65 - 1),
    // Стоимость восстановления ключей от авто
    restoreVehKeysPrice: 1000,

    init() {
        this.createServiceMarker();
    },
    createServiceMarker() {
        var pos = this.servicePos;
        var service = mp.markers.new(1, pos, 0.5, {
            color: [0, 187, 255, 70]
        });

        var colshape = mp.colshapes.newSphere(pos.x, pos.y, pos.z, 1.5);
        colshape.onEnter = (player) => {
            if (player.vehicle) return;
            var data = {
                fines: player.character.Fines,
                vehicles: player.vehicleList || [],
            };
            player.call(`government.service.showMenu`, [data]);
        };
        colshape.onExit = (player) => {
            player.call(`selectMenu.hide`);
        };
        service.colshape = colshape;
    },

};
