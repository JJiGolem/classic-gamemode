var taxi = require('./index.js');
// var money = call('money');
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
    }
}