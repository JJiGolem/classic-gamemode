let chargestations = require('./index.js');
let notify = call('notifications');
let money = call('money');
let vehicles = call('vehicles');

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

        let toCharge = parseInt(vehicle.properties.maxFuel - vehicle.fuel);

        let productsAvailable = chargestations.getProductsAmount(chargeStationId);
        if (toCharge > productsAvailable) return notify.error(player, 'На станции закончились ресурсы');
        let price = chargestations.getChargePriceById(chargeStationId);
        let total = toCharge * price;

        if (player.character.cash < total) return notify.error(player, 'Недостаточно средств');

        money.removeCash(player, total, function(result) {
            if (result) {
                chargestations.removeProducts(chargeStationId, toCharge);
                chargestations.updateCashbox(chargeStationId, total);
                vehicles.setFuel(vehicle, vehicle.properties.maxFuel);
                notify.success(player, `Автомобиль заряжен на ${toCharge}% за $${total}`);
            } else {
                notify.error(player, 'Ошибка финансовой операции');
            }
        }, `Зарядка т/с ${vehicle.properties.name} (${toCharge} л.) на станции #${chargeStationId}`);
    }
}