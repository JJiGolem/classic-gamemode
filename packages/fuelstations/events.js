let fuelstations = require('./index.js');
let vehicles = call('vehicles');
let money = call('money');

module.exports = {
    "init": () => {
        fuelstations.init();
    },
    "playerEnterColshape": (player, shape) => {
        if (!player.character) return;

        if (shape.isFuelStation) {
                player.call('chat.message.push', [`!{#ffffff}${player.name} зашел в колшейп fuelStation`]);
                player.call('fuelstations.shape.enter');
                player.currentColshape = shape;
        }
    },
    "playerExitColshape": (player, shape) => {
        if (!player.character) return;

        if (shape.isFuelStation) {
                player.call('chat.message.push', [`!{#ffffff}${player.name} вышел с колшейпа fuelStation`]);
                player.call('fuelstations.shape.leave');
                player.currentColshape = null;
        }
    },
    'fuelstations.fill.fulltank': (player) => {
        let shape = player.currentColshape;
        if (!shape) return player.call('fuelstations.fill.fulltank.ans', [0]);
        if (!shape.isFuelStation) return player.call('fuelstations.fill.fulltank.ans', [0]);;

        let fuelStationId = shape.fuelStationId;

        let vehicle = player.vehicle;
        if (!vehicle) return player.call('fuelstations.fill.fulltank.ans', [1]);
        if (vehicle.fuel >= vehicle.properties.maxFuel) return player.call('fuelstations.fill.fulltank.ans', [2]);

        let litresToFill = parseInt(vehicle.properties.maxFuel - vehicle.fuel);

        let price = fuelstations.getFuelPriceById(fuelStationId);
        let total = litresToFill * price; // todo get price by shape

        if (player.character.cash < total) return player.call('fuelstations.fill.fulltank.ans', [4]);

        money.removeCash(player, total, function(result) {
            if (result) {
                vehicles.setFuel(vehicle, vehicle.properties.maxFuel);
                let data = {
                    litres: litresToFill,
                    total: total
                }
                player.call('fuelstations.fill.fulltank.ans', [3, data]);
            } else {
                player.call('fuelstations.fill.fulltank.ans', [5]);
            }
        });
    },
    'fuelstations.fill.litres': (player, litres) => {
        let shape = player.currentColshape;
        if (!shape) return player.call('fuelstations.fill.litres.ans', [0]);
        if (!shape.isFuelStation) return player.call('fuelstations.fill.litres.ans', [0]);;

        let fuelStationId = shape.fuelStationId;

        let vehicle = player.vehicle;
        if (!vehicle) return player.call('fuelstations.fill.litres.ans', [1]);
        if (vehicle.fuel >= vehicle.properties.maxFuel) return player.call('fuelstations.fill.litres.ans', [2]);

        litres = parseInt(litres);
        if (isNaN(litres) || litres < 1) return player.call('fuelstations.fill.litres.ans', [6]);
        if (litres > vehicle.properties.maxFuel - vehicle.fuel) return player.call('fuelstations.fill.litres.ans', [7]);
        let price = fuelstations.getFuelPriceById(fuelStationId);
        let total = litres * price; 

        if (player.character.cash < total) return player.call('fuelstations.fill.litres.ans', [4]);

        money.removeCash(player, total, function(result) {
            if (result) {
                vehicles.addFuel(vehicle, litres);
                let data = {
                    litres: litres,
                    total: total
                }
                player.call('fuelstations.fill.litres.ans', [3, data]);
            } else {
                player.call('fuelstations.fill.litres.ans', [5]);
            }
        });
    }
}