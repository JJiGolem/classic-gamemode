"use strict";

let jobs = call('jobs');
let notifs = call('notifications');
let routes = call('routes');
let utils = call('utils');

module.exports = {
    // ИД предмета 'Снежок'
    snowballItemId: 117,
    // Кол-во снежков, которое можно подобрать с земли
    snowballCount: 5,
    // Цена аренды трактора
    vehPrice: 100,
    // ЗП за одну точку на тракторе
    pay: 5,

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
        var driver = this.getDriverByVeh(veh);
        if (driver) driver.call("routes.checkpoints.destroy");
        // this.dropBizOrderByVeh(veh);
        delete veh.driver;
        // if (veh.products) {
        //     delete veh.products;
        //     veh.setVariable("label", null);
        // }
    },
    getTractorPoints() {
        var points = [
            [
                new mp.Vector3(-633.923095703125, -1640.063232421875, 25.792415618896484 - 1),
                new mp.Vector3(-643.3558349609375, -1635.81005859375, 24.952909469604492 - 1),
            ]
        ];

        var rand = utils.randomInteger(0, points.length - 1);
        return points[rand];
    },
    startTractorRoute(player) {
        var header = `Уборка снега`
        var points = this.getTractorPoints();
        var data = Object.assign({}, routes.defaultCheckpointData);
        data.scale = 4;
        routes.start(player, data, points, () => {
            var veh = player.vehicle;
            if (!veh || !veh.db || veh.db.key != "job" || veh.db.owner != 8) {
                notifs.error(player, `Необходимо находиться в тракторе`, header);
                return false;
            }
            if (player.character.job != 8) {
                notifs.error(player, `Вы не работаете снегоуборщиком`, header);
                return false;
            }
            player.character.pay += this.pay;
            player.character.save();
            return true;
        }, () => {
            notifs.success(player, `Снега стало меньше!`, header);
            jobs.pay(player);
        });
    },
};
