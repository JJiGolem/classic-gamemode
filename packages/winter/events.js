let inventory = call('inventory');
let money = call('money');
let notifs = call('notifications');
let vehicles = call('vehicles');
let winter = call('winter');

module.exports = {
    "init": () => {
        //winter.setXmasTrees();
        inited(__dirname);
    },
    "winter.job.start": (player) => {
        if (!player.character.carLicense) return notifs.error(player, `Необходимо водительское удостоверение`, `Уборщик`);
        mp.events.call("jobs.set", player, 8);
    },
    "winter.job.stop": (player) => {
        var header = `Устройство на работу`;
        var out = (text) => {
            notifs.error(player, text, header);
        };
        mp.events.call("jobs.leave", player);
    },
    "winter.takeSnowball": (player) => {
        var header = `Снежки`;
        var out = (text) => {
            notifs.error(player, text, header);
        };

        var cantAdd = inventory.cantAdd(player, winter.snowballItemId, {});
        if (cantAdd) return out(cantAdd);

        var params = {
            weaponHash: mp.joaat('weapon_snowball'),
            ammo: winter.snowballCount,
        };
        inventory.addItem(player, winter.snowballItemId, params, (e) => {
            if (e) return out(e);

            mp.players.forEachInRange(player.position, 20, rec => {
                rec.call(`animations.play`, [player.id, {
                    dict: "anim@mp_snowball",
                    name: "pickup_snowball",
                    speed: 1,
                    flag: 1
                }, 1500]);
            });
            notifs.success(player, `Вы слепили снежок`, header);
            inventory.notifyOverhead(player, `Слепил '${inventory.getName(winter.snowballItemId)}'`);
        });
    },
    "winter.vehicle.buy": (player) => {
        var header = `Аренда трактора`;
        var out = (text) => {
            notifs.error(player, text, header);
        };
        var veh = player.vehicle;
        if (!veh || !veh.db || veh.db.key != "job" || veh.db.owner != 8) return out(`Не в тракторе`);
        if (player.character.job != 8) return out(`Не на работе`);
        if (veh.driver) return out(`Уже арендован`);
        if (player.character.cash < winter.vehPrice) return out(`Необходимо $${winter.vehPrice}`);

        vehicles.disableControl(player, false);
        money.removeCash(player, winter.vehPrice, (res) => {
            if (!res) return out(`Ошибка списания наличных`);

            var driverVeh = winter.getVehByDriver(player);
            if (driverVeh) winter.clearVeh(driverVeh);

            veh.driver = {
                playerId: player.id,
                characterId: player.character.id,
            };
            player.call(`prompt.waitShowByName`, [`winter_job`]);
            winter.startTractorRoute(player);
            notifs.success(player, `Удачной работы!`, header);
        }, `Аренда трактора для уборки`);
    },
    "playerEnterVehicle": (player, vehicle, seat) => {
        if (!vehicle.db) return;
        if (vehicle.db.key != "job") return;
        if (player.character.job != 8) return;
        if (vehicle.db.owner != 8) return;
        if (seat != -1) return;
        var out = (text) => {
            player.removeFromVehicle();
            notifs.error(player, text, `Аренда трактора`);
        };
        var characterId = player.character.id;
        vehicles.disableControl(player, !vehicle.driver || vehicle.driver.characterId != characterId);
        if (!vehicle.driver) return player.call(`offerDialog.show`, ["winter_job", {
            price: winter.vehPrice
        }]);
        if (vehicle.driver.characterId != characterId) {
            var driver = winter.getDriverByVeh(vehicle);
            if (!driver) delete vehicle.driver;
            else return out(`Трактор арендован другим игроком`);
        }

        if (!player.route) winter.startTractorRoute(player);
    },
    "playerQuit": (player) => {
        if (!player.character || player.character.job != 8) return;

        var veh = winter.getVehByDriver(player);
        if (veh) vehicles.respawn(veh);
    },
    "vehicle.respawned": (veh) => {
        if (!veh.db || veh.db.key != "job" || veh.db.owner != 8) return;
        winter.clearVeh(veh);
    },
    "jobs.leave": (player) => {
        // if (player.character.job != 8) return;
        var veh = winter.getVehByDriver(player);
        if (veh) winter.clearVeh(veh);
    },
};
