let chargestations = require('./index.js');
let notify = call('notifications');

module.exports = {
    "init": () => {
        chargestations.init();
        inited(__dirname);
    },
    "playerEnterColshape": (player, shape) => {
        if (!player.character) return;

        if (shape.isChargeStation) {
                player.call('chargestations.shape.enter', [true]);
                player.currentChargeStationId = shape.chargeStationId;
        }
    },
    "playerExitColshape": (player, shape) => {
        if (!player.character) return;

        if (shape.isChargeStation) {
                player.call('chargestations.shape.enter', [false]);
        }
    },
    "chargestations.charge": (player) => {
        let chargeStationId = player.currentChargeStationId;
        if (!chargeStationId) return;

        let vehicle = player.vehicle;
        if (!vehicle) return notify.error(player, 'Вы не в транспорте')
        if (!vehicle.properties.isElectric) return notify.warning(player, 'Можно зарядить только электромобиль');
        if (vehicle.fuel >= vehicle.properties.maxFuel) return notify.warning(player, 'Автоиобиль полностью заряжен');

        // let litresToFill = parseInt(vehicle.properties.maxFuel - vehicle.fuel);

        // let productsAvailable = fuelstations.getProductsAmount(fuelStationId);
        // if (litresToFill > productsAvailable) return player.call('fuelstations.fill.fulltank.ans', [6]);
        // let price = fuelstations.getFuelPriceById(fuelStationId);
        // let total = litresToFill * price;

        // if (player.character.cash < total) return player.call('fuelstations.fill.fulltank.ans', [4]);


        // money.removeCash(player, total, function(result) {
        //     if (result) {
        //         fuelstations.removeProducts(fuelStationId, litresToFill);
        //         fuelstations.updateCashbox(fuelStationId, total);
        //         vehicles.setFuel(vehicle, vehicle.properties.maxFuel);
        //         let data = {
        //             litres: litresToFill,
        //             total: total
        //         }
        //         player.call('fuelstations.fill.fulltank.ans', [3, data]);
        //     } else {
        //         player.call('fuelstations.fill.fulltank.ans', [5]);
        //     }
        // }, `Заправка т/с ${vehicle.properties.name} (${litresToFill} л.) на АЗС #${fuelStationId}`);
    }
}