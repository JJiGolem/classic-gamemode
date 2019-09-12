var carmarket = require('./index.js');
var money = call('money');
var vehicles = call('vehicles');
var houses = call('houses');

let PRICE_CONFIG = carmarket.getPriceConfig();

module.exports = {
    "init": () => {
        carmarket.init();
    },
    "vehicles.loaded": async () => {
        await carmarket.loadCarMarketData();
        await carmarket.loadCarMarketVehicles();
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

        let price = (player.vehicle.properties.price * PRICE_CONFIG.SELL).toFixed();
        console.log(price);
        money.addCash(player, price, function (result) {
            if (result) {
                try {
                    vehicles.removeVehicleFromPlayerVehicleList(player, player.vehicle.sqlId);
                    vehicles.removeVehicleFromCarPlace(player, player.vehicle);
                } catch (err) {
                    console.log(err);
                }
                player.vehicle.d = 0;
                carmarket.sellCar(player.vehicle);
                player.call('carmarket.car.sell.ans', [3, price]);

            } else {
                console.log(`${player.name} не смог продать авто на рынке (addcash error)`)
                player.call('carmarket.car.sell.ans', [2]);
            }
        });
    },
    "playerEnterVehicle": (player, vehicle, seat) => {
        if (vehicle.key == 'market' && seat == -1) {
            player.call('chat.message.push', [`!{#f494ff} [MARKET INFO]`]);
            player.call('chat.message.push', [`!{#f494ff} Пробег ${vehicle.mileage}`]);
            player.call('chat.message.push', [`!{#f494ff} Название ${vehicle.properties.name}`]);
            player.call('chat.message.push', [`!{#f494ff} spot ${vehicle.marketSpot}`]);

            let data = {
                name: vehicle.properties.name,
                price: vehicle.properties.price * PRICE_CONFIG.BUY,
                mileage: vehicle.mileage,
                owners: vehicle.owners,
                regDate: vehicle.regDate
            }
            player.call('carmarket.buymenu.show', [data]);
        }
    },
    "playerExitVehicle": (player, vehicle) => {
        if (vehicle.key == 'market') {
            player.call('carmarket.buymenu.close');
        }
    },
    "carmarket.car.buy": (player) => {

        if (!player.vehicle || player.vehicle.key != 'market' || player.seat != -1) return player.call('carmarket.car.buy.ans', [0]);


        let price = (player.vehicle.properties.price * PRICE_CONFIG.BUY).toFixed();

        if (player.character.cash < price) return player.call('carmarket.car.buy.ans', [3]);

        let hasHouse = houses.isHaveHouse(player.character.id);
        // if (!hasHouse) {
        //     if (player.vehicleList.length > 1) return player.call('carmarket.car.buy.ans', [4]);
        // } else {
        //     if (player.vehicleList.length + 1 > player.carPlaces.length - 1) return player.call('carmarket.car.buy.ans', [4]);
        // }
        if (!vehicles.isAbleToBuyVehicle(player)) return player.call('carmarket.car.buy.ans', [4]);

        money.removeCash(player, price, function (result) {
            if (result) {

                let carInfo = {
                    name: player.vehicle.properties.name,
                    price: price
                }

                player.vehicle.key = 'private';
                player.vehicle.owner = player.character.id;

                player.vehicle.db.update({
                    key: 'private',
                    owner: player.character.id,
                    owners: player.vehicle.owners + 1,
                });
                player.vehicle.owners = player.vehicle.owners + 1;
                player.call('vehicles.enter.private', [true]);
                if (hasHouse) vehicles.setVehicleHomeSpawnPlace(player);
                carmarket.setMarketSpotFree(player.vehicle.marketSpot);

                let veh = player.vehicle;
                player.vehicleList.push({
                    id: veh.sqlId,
                    name: veh.properties.name,
                    plate: veh.plate,
                    regDate: veh.regDate,
                    owners: veh.owners,
                    vehType: veh.properties.vehType,
                    price: veh.properties.price,
                    //isOnParking: veh.isOnParking
                });

                player.call('carmarket.car.buy.ans', [2, carInfo]);
                mp.events.call('vehicles.engine.toggle', player);
            } else {
                player.call('carmarket.car.buy.ans', [1]);
            }
        });
    }
}