let rent = require('./index.js');
let notify = call('notifications');
let vehicles = call('vehicles');
let money = call('money');

module.exports = {
    "init": async () => {
        await rent.init();
        inited(__dirname);
    },
    "playerEnterVehicle": (player, vehicle, seat) => {
        if (vehicle.key == 'rent' && seat == -1) {
            if (vehicle.isActiveRent) {
                if (vehicle.rentBy != player.character.id) {
                    player.removeFromVehicle();
                    notify.error(player, 'Транспорт арендуется другим игроком');
                }
            } else {
                let data = {
                    name: vehicle.properties.name,
                    price: parseInt(vehicle.properties.price * rent.rentPriceMultiplier),
                    mileage: vehicle.mileage,
                }
                player.call('rent.rentmenu.show', [data]);
            }
        }
    },
    "playerExitVehicle": (player, vehicle) => {
        if (vehicle.key == 'rent' && !vehicle.isActiveRent) {
            player.call('rent.rentmenu.close');
        }
    },
    "rent.vehicle.rent": (player) => {
        if (!player.character) return;
        let vehicle = player.vehicle;
        if (!vehicle || vehicle.key != 'rent' || player.seat != -1)
            return player.call('rent.vehicle.rent.ans', [0]);

        let lic = rent.licenseConfig[vehicle.properties.vehType];
        if (lic && lic.licType) {
            let hasLicense = player.character[lic.licType];
            if (!hasLicense) return player.call('rent.vehicle.rent.ans', [2, lic.name]);
        }

        let price = parseInt(vehicle.properties.price * rent.rentPriceMultiplier);
        if (player.character.cash < price) return player.call('rent.vehicle.rent.ans', [3]);

        money.removeCash(player, price, function (result) {
            if (result) {
                player.call('rent.vehicle.rent.ans', [1]);
                if (player.hasRentVehicle) {
                    let vehicle = mp.vehicles.toArray().find(x => x.rentBy == player.character.id);
                    if (vehicle) vehicles.respawnVehicle(vehicle);
                }
                vehicle.isActiveRent = true;
                vehicle.rentBy = player.character.id;
                player.hasRentVehicle = true;
            } else {
                player.call('rent.vehicle.rent.ans', [4]);
            }
        }, `Аренда т/с ${vehicle.properties.name}`);
    },
    "playerQuit": (player) => {
        if (!player.character) return;
        let id = player.character.id;
        mp.vehicles.forEach((veh) => {
            if (!veh.rentBy || veh.rentBy != id) return;
            vehicles.respawnVehicle(veh);
        });
    },
    "vehicles.respawn.full": (vehicle) => {
        if (vehicle.key != 'rent' || !vehicle.isActiveRent) return;
        let id = vehicle.rentBy;
        let player = mp.players.getBySqlId(id);
        if (!player) return;
        player.hasRentVehicle = false;
    }
}