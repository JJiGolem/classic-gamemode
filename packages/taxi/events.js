let taxi = require('./index.js');
let money = call('money');
// var vehicles = call('vehicles');

module.exports = {
    "init": () => {
        taxi.init();
    },
    "playerEnterColshape": (player, shape) => {
        if (!player.character) return;

        if (shape.isTaxiStation) {
            player.call('chat.message.push', [`!{#ffffff}${player.name} зашел в колшейп taxi`]);
            if (player.character.job == 2) {
                player.call('taxi.jobmenu.show', [1]);
            } else {
                player.call('taxi.jobmenu.show', [0]);
            }

            player.currentColshape = shape;
        }
    },
    "playerExitColshape": (player, shape) => {
        if (!player.character) return;

        if (shape.isTaxiStation) {
            player.call('chat.message.push', [`!{#ffffff}${player.name} вышел с колшейпа taxi`]);
            player.call('taxi.jobmenu.close');
            player.currentColshape = null;
        }
    },
    "taxi.employment": (player) => {
        if (player.character.job == 2) {
            mp.events.call("jobs.leave", player);
        } else {
            mp.events.call("jobs.set", player, 2);
        }
    },
    "taxi.client.order.send": (player) => {
        if (player.vehicle) return player.call('taxi.client.order.ans', [0]);
        if (player.dimension != 0) return player.call('taxi.client.order.ans', [1]);
        if (player.character.cash < taxi.getPricePerKilometer()) return player.call('taxi.client.order.ans', [2]);
        //if (taxi.doesClientHaveOrders(player.id)) return player.call('taxi.client.order.ans', [3]);
        taxi.addOrder(player.id, player.position);
        player.call('taxi.client.order.ans', [4]);
        console.log(taxi.getOrders());
    },
    "taxi.driver.orders.get": (player) => {
        let orders = taxi.getOrders();
        player.call('taxi.driver.orders.load', [orders]);
    },
    "taxi.driver.orders.take": (player, orderId) => {
        console.log(orderId);
        let order = taxi.getOrderById(orderId);
        console.log(`order ${order}`)
        if (order) {
            player.currentTaxiDriverOrder = order;
            taxi.deleteOrder(orderId);

            let target = mp.players.at(player.currentTaxiDriverOrder.clientId);
            if (!target) return; // todo
            target.currentTaxiClientOrder = {
                driverId: player.id,
                name: player.name,
                model: player.vehicle.modelName,
                plate: player.vehicle.plate
            }
            target.call('taxi.client.order.taken', [target.currentTaxiClientOrder]);
            player.call('taxi.driver.orders.take.ans', [0, order]);
        } else {
            player.call('taxi.driver.orders.take.ans', [1]);
        }
    },
    "taxi.driver.route.arrive": (player) => {
        let order = player.currentTaxiDriverOrder;
        console.log(`Прибыли к клиенту ${order.clientId}`);
        let client = mp.players.at(order.clientId);
        if (!client) return; // todo
        if (!client.currentTaxiClientOrder) return; // todo
        if (client.currentTaxiClientOrder.driverId != player.id) return; // todo

        client.call('taxi.client.car.ready');
    },
    "playerEnterVehicle": (player, vehicle, seat) => {
        if (seat != -1 && player.currentTaxiClientOrder) {
            if (player.currentTaxiClientOrder.plate == vehicle.plate) {
                console.log('клиент сел в авто');
                player.call('taxi.client.car.enter');
            }
        }
    },
    "taxi.client.app.confirm": (player, destination) => {
        destination = JSON.parse(destination);
        let price = taxi.calculatePrice(player, destination)
        if (player.character.cash < price) return player.call('taxi.client.app.confirm.ans', [1]);

        let driver = mp.players.at(player.currentTaxiClientOrder.driverId);
        player.call('taxi.client.app.confirm.ans', [0]);
        driver.call('taxi.driver.destination.confirmed', [destination, price]);

        delete player.currentTaxiClientOrder;
        delete driver.currentTaxiDriverOrder;

        player.taxiClientDestination = {
            driverId: driver.id,
            destination: destination,
            price: price
        }
        driver.taxiDriverDestination = {
            clientId: player.id,
            destination: destination,
            price: price
        }
    },
    "taxi.driver.destination.reach": (player) => {
        let driver = player;
        let client = mp.players.at(driver.taxiDriverDestination.clientId);
        let price = driver.taxiDriverDestination.price;
        console.log(`водитель ${driver.name} привез игрока ${client.name} за $${price}`);

        money.removeCash(client, price, function(result) {
            if (result) {
                client.call('notifications.push.success', ['Вы оплатили поездку', 'Такси']);
                try {
                    money.addMoney(driver, price, function(result) {
                        if (result) {
                            driver.call('notifications.push.success', ['Деньги зачислены на счет', 'Такси']);
                        } else {
                            driver.call('notifications.push.error', ['Ошибка зачисления денег', 'Такси']);
                        }
                    });
                } catch (err) {
                    console.log(err);
                }
            } else {
                client.call('notifications.push.error', ['Вы не смогли оплатить поездку', 'Такси']);
                driver.call('notifications.push.error', ['Клиент не смог оплатить поездку', 'Такси']);
            }
        });
        delete driver.taxiDriverDestination;
        delete client.taxiClientDestination;
    },
    "playerQuit": (player) => {
        taxi.deletePlayerOrders(player);
    },
    "taxi.client.order.cancel": (player) => {
        taxi.deletePlayerOrders(player);

        if (player.currentTaxiClientOrder) {
            let driver = mp.players.at(player.currentTaxiClientOrder.driverId);
            driver.call('taxi.driver.order.canceled');
            delete driver.currentTaxiDriverOrder;
            delete player.currentTaxiClientOrder;
        }
        if (player.taxiClientDestination) {
            let driver = mp.players.at(player.taxiClientDestination.driverId);
            driver.call('taxi.driver.order.canceled');
            delete driver.taxiDriverDestination;
            delete player.taxiClientDestination;
        }
    },
    "taxi.driver.order.cancel": (player) => {
        if (player.currentTaxiDriverOrder) {
            let client = mp.players.at(player.currentTaxiDriverOrder.clientId);
            client.call('taxi.client.order.canceled');
            delete player.currentTaxiDriverOrder;
            delete client.currentTaxiClientOrder;
        }
        if (player.taxiDriverDestination) {
            let client = mp.players.at(player.taxiDriverDestination.clientId);
            client.call('taxi.client.order.canceled');
            delete player.taxiDriverDestination;
            delete client.taxiClientDestination;
        }
    }
}



// money.removeCash(client, price, function(result) {
//     if (result) {
//         // уведомление об успехе
//         // КОД С ОШИБКОЙ
//     } else {
//         // уведомление об ошибке
//     }
// });