var carmarket = require('./index.js');
module.exports = {
    "init": () => {
        carmarket.init();
    },
    "playerEnterColshape": (player, shape) => {
        if (shape.isCarMarket) {
            player.call('carmarket.colshape.enter');
            if (!player.vehicle) {
                player.call('prompt.showByName', ['carmarket_noveh']);
            } else {
                player.call('prompt.showByName', ['carmarket_control']);
            }
        }
    },
    "playerExitColshape": (player, shape) => {
        if (shape.isCarMarket) {
            player.call('carmarket.colshape.leave');
        }
    },
    "carmarket.sellmenu.show": (player) => {
        if (!player.vehicle) return;
        if (!carmarket.isPlayerInCarMarketColshape(player)) return;
        if (player.vehicle.key != 'private' || player.vehicle.owner != player.character.id) return player.call('notifications.push.error', ['Это не ваш транспорт', 'Ошибка']);
        player.call('carmarket.sellmenu.show');
    },
    "carmarket.car.sell": (player) => {
        if (!player.vehicle) return player.call('carmarket.car.sell.ans, [0]');
        if (!carmarket.isPlayerInCarMarketColshape(player)) return player.call('carmarket.car.sell.ans', [1]);;
        if (player.vehicle.key != 'private' || player.vehicle.owner != player.character.id) return player.call('carmarket.car.sell.ans', [0]);
        try {
            carmarket.sellCar(player.vehicle);
            player.call('carmarket.car.sell.ans', [3]);
        } catch (err) {
            console.log(err);
            player.call('carmarket.car.sell.ans', [2]);
        }
    },
    "playerEnterVehicle": (player, vehicle, seat) => {
        if (vehicle.key == 'market' && seat == -1) {
            player.call('chat.message.push', [`!{#f494ff} [MARKET INFO]`]);
            player.call('chat.message.push', [`!{#f494ff} Пробег ${vehicle.mileage}`]);
            player.call('chat.message.push', [`!{#f494ff} Название ${vehicle.properties.name}`]);
            player.call('chat.message.push', [`!{#f494ff} spot ${vehicle.marketSpot}`]);
            player.call('carmarket.buymenu.show');
        }
    },
    "playerExitVehicle": (player, vehicle) => {
        if (vehicle.key == 'market') {
            player.call('carmarket.buymenu.close');
        }
    },
    "carmarket.car.buy": (player) => {

        if (!player.vehicle || player.vehicle.key != 'market' || player.seat != -1) return player.call('carmarket.car.buy.ans', [0]);

        // TODO проверки на деньги
        var carInfo = {
            name: player.vehicle.properties.name
        }
        try {
            player.vehicle.key = 'private';
            player.vehicle.owner = player.character.id;

            player.vehicle.db.update({
                key: 'private',
                owner: player.character.id,
                isOnParking: 1 /// если нет дома
            });
            player.vehicle.isOnParking = 1;
            carmarket.setMarketSpotFree(player.vehicle.marketSpot);
            player.call('carmarket.car.buy.ans', [2, carInfo]);
            mp.events.call('vehicles.engine.toggle', player);
        } catch (err) {
            console.log(err);
            player.call('carmarket.car.buy.ans', [1]);
        }
    }
}