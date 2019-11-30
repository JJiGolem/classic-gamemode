"use strict";

module.exports = {
    // ИД предмета 'Снежок'
    snowballItemId: 117,
    // Кол-во снежков, которое можно подобрать с земли
    snowballCount: 5,
    // Цена аренды трактора
    vehPrice: 100,

    // получить арендованный трактор игрока
    getVehByDriver(player) {
        return mp.vehicles.toArray().find(x => x.db && x.db.key == 'job' && x.db.owner == 8 && x.driver && x.driver.playerId == player.id && x.driver.characterId == player.character.id);
    },
    // получить игрока, который арендовал грузовик
    getDriverByVeh(veh) {
        if (!veh.driver) return;
        var d = veh.driver;
        return mp.players.toArray().find(x => x.character && x.id == d.playerId && x.character.id == d.characterId);
    },
    // очистить трактор от аренды водителя
    clearVeh(veh) {
        // var driver = this.getDriverByVeh(veh);
        // if (driver) driver.call(`carrier.bizOrder.waypoint.set`);
        // this.dropBizOrderByVeh(veh);
        delete veh.driver;
        // if (veh.products) {
        //     delete veh.products;
        //     veh.setVariable("label", null);
        // }
    },
};
