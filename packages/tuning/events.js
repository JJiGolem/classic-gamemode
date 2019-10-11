let tuning = require('./index.js');
let money = call('money');
module.exports = {
    "init": () => {
        tuning.init();
    },
    "playerEnterColshape": (player, shape) => {
        if (shape.isCustoms) {
            if (!player.vehicle) return player.call('prompt.show', ['Вы должны находиться в транспорте']);
            console.log(player.vehicle.key);
            if (player.vehicle.key != 'private') return player.call('prompt.show', ['Этот транспорт нельзя модифицировать']); //temp
            if (player.vehicle.owner != player.character.id) return player.call('prompt.show', ['Нельзя модифицировать чужой транспорт']);
            if (!player.vehicle.tuning || player.vehicle.properties.vehType != 0) return player.call('prompt.show', ['Этот транспорт нельзя модифицировать']);
            let occupants = player.vehicle.getOccupants();
            if (occupants.length > 1) return player.call('prompt.show', ['Нельзя тюнинговать транспорт с пассажирами']);
            
            player.call('tuning.fadeOut');
            let customs = tuning.getCustomsDataById(shape.customsId);
            player.vehicle.dimension = player.id + 1;
            player.vehicle.position = new mp.Vector3(customs.tuneX, customs.tuneY, customs.tuneZ);
            player.call('vehicles.heading.set', [customs.tuneH])
            let primary = player.vehicle.color1;
            let secondary = player.vehicle.color2;
            let priceInfo = {
                veh: player.vehicle.properties.price,
                config: tuning.getPriceConfig()
            }
            player.call('tuning.start', [customs.id, primary, secondary, priceInfo]);
            player.call('vehicles.engine.toggle', [false]);
            player.vehicle.setVariable("engine", false);
            player.vehicle.isBeingTuned = true;
        }
    },
    "tuning.end": (player, id) => {
        console.log(id);
        if (!player.vehicle) return player.dimension = 0;
        let customs = tuning.getCustomsDataById(id);
        player.vehicle.position = new mp.Vector3(customs.returnX, customs.returnY, customs.returnZ);
        player.vehicle.dimension = 0;
        player.vehicle.isBeingTuned = false;
        player.call('vehicles.heading.set', [customs.returnH]);
    },
    "tuning.colors.set": async (player, primary, secondary) => {
        let vehicle = player.vehicle;
        if (!vehicle) return player.call('tuning.colors.set.ans', [2]);
        if (vehicle.key != 'private' || vehicle.owner != player.character.id) return player.call('tuning.colors.set.ans', [3]);
        let price = tuning.getColorsPrice();

        if (player.character.cash < price) return player.call('tuning.colors.set.ans', [1]);

        money.removeCash(player, price, async function (result) {
            if (result) {
                vehicle.setColor(primary, secondary);
                vehicle.color1 = primary;
                vehicle.color2 = secondary;
                await vehicle.db.update({
                    color1: primary,
                    color2: secondary
                });
                player.call('tuning.colors.set.ans', [0]);
            } else {
                player.call('tuning.colors.set.ans', [4]);
            }
        }, `Смена цвета т/с ${vehicle.properties.name} в LSC (#${primary} | #${secondary})`);
    },
    "tuning.buy": (player, type, index) => {
        let vehicle = player.vehicle;
        if (!vehicle) return player.call('tuning.buy.ans', [2]);
        if (vehicle.key != 'private' || vehicle.owner != player.character.id) return player.call('tuning.buy.ans', [3]);
        let price = tuning.calculateModPrice(vehicle.properties.price, type, index);
        if (player.character.cash < price) return player.call('tuning.buy.ans', [1]);

        money.removeCash(player, price, function (result) {
            if (result) {
                let config = tuning.getModsConfig();
                typeName = config[type];
                tuning.saveMod(vehicle, typeName, index);
                vehicle.setMod(type, index);
                player.call('tuning.buy.ans', [0, typeName, index]);
            } else {
                player.call('tuning.buy.ans', [4]);
            }
        }, `Покупка тюнинга т/с ${vehicle.properties.name} в LSC (type #${type} | index #${index})`);

    },
    "tuning.repair": (player) => {
        let vehicle = player.vehicle;
        if (!vehicle) return player.call('tuning.repair.ans', [2]);
        if (vehicle.key != 'private' || vehicle.owner != player.character.id) return player.call('tuning.repair.ans', [3]);
        let price = tuning.getPriceConfig().repair;
        if (player.character.cash < price) return player.call('tuning.repair.ans', [1]);

        money.removeCash(player, price, function (result) {
            if (result) {
                player.vehicle.repair();
                player.call('tuning.repair.ans', [0]);
            } else {
                player.call('tuning.repair.ans', [4]);
            }
        }, `Ремонт т/с ${vehicle.properties.name} в LSC`);
    }
}