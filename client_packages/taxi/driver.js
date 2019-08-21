// let clientBlip;
// let clientShape;

let client = {};

let destination = {};

mp.events.add('taxi.driver.app.open', () => {
    mp.chat.debug('driver open');
    mp.events.callRemote('taxi.driver.orders.get');
});

mp.events.add('taxi.driver.orders.load', (orders) => {
    orders = filterOrders(orders);
    mp.callCEFR('taxi.driver.load', [{ name: mp.players.local.name, orders: orders }]);
});

mp.events.add('taxi.driver.orders.add', (order) => {
    mp.chat.debug('add order');
    order = {
        id: order.orderId,
        distance: calculateDistanceToClient(order.position)
    }
    mp.callCEFR('taxi.driver.order.add', [order]);
});

mp.events.add('taxi.driver.orders.delete', (orderId) => {
    mp.callCEFR('taxi.driver.order.delete', [orderId]);
});

mp.events.add('taxi.driver.app.order.take', (orderId) => {
    mp.chat.debug('take order');
    mp.chat.debug(orderId);
    mp.events.callRemote('taxi.driver.orders.take', orderId);
});

mp.events.add('taxi.driver.orders.take.ans', (ans, orderInfo) => {
    switch (ans) {
        case 0:
            mp.chat.debug(JSON.stringify(orderInfo.position));
            mp.chat.debug(JSON.stringify(orderInfo.clientId));
            createRouteToClient(orderInfo.position);
            break;
        case 1:
            mp.notify.error('Заказ уже взят', 'Такси');
            mp.callCEFR('taxi.driver.order.cancel', []);
            break;
    }
});

function filterOrders(orders) {

    let result = [];

    orders.forEach((current) => {
        result.push({
            id: current.orderId,
            distance: calculateDistanceToClient(current.position)
        })
    });

    return result;
}

function calculateDistanceToClient(pos) {
    //return parseFloat((mp.vdist(mp.players.local.position, pos) / 1000).toFixed(1));
    return (mp.vdist(mp.players.local.position, pos) / 1000).toFixed(1);
}

function createRouteToClient(pos) {
    client.blip = mp.blips.new(1, pos, { color: 71, name: "Клиент" });
    client.blip.setRoute(true);

    client.marker = mp.markers.new(1, new mp.Vector3(pos.x, pos.y, pos.z - 9), 10,
        {
            direction: new mp.Vector3(pos.x, pos.y, pos.z),
            rotation: 0,
            color: [255, 234, 0, 180],
            visible: true,
            dimension: 0
        });
    client.shape = mp.colshapes.newSphere(pos.x, pos.y, pos.z, 6);
    client.shape.pos = pos;
    client.shape.isRouteToClientShape = true;
}

mp.events.add("playerEnterColshape", (shape) => {
    if (shape.isRouteToClientShape) {
        mp.chat.debug('enter route to client shape');
        mp.events.callRemote('taxi.driver.route.arrive');
        mp.events.call('taxi.driver.route.destroy');
        mp.notify.success('Ожидайте клиента', 'Такси');
    };
});

mp.events.add("playerExitColshape", (shape) => {
    if (shape.isRouteToClientShape) {
        mp.chat.debug('exit route to client shape');
    }
});

mp.events.add("taxi.driver.route.destroy", () => {
    if (client.blip) {
        client.blip.destroy();
        client.blip = null;
    }
    if (client.marker) {
        client.marker.destroy();
        client.marker = null;
    }
    if (client.shape) {
        client.shape.destroy();
        client.shape = null;
    }

});

mp.events.add("taxi.driver.destination.confirmed", (destination, price) => {
    createFinalDestination(destination);
    mp.chat.debug(`Ставим колшейп на ${JSON.stringify(destination)}`);
    mp.callCEFR('taxi.driver.order.way', [mp.utils.getRegionName(destination), mp.utils.getStreetName(destination), price]);

});

function createFinalDestination(pos) {
    destination.blip = mp.blips.new(1, pos, { color: 71, name: "Точка назначения" });
    destination.blip.setRoute(true);

    destination.shape = mp.colshapes.newTube(pos.x, pos.y, -1000, 20.0, 2000.0, 0);
    destination.shape.isFinalDestinationShape = true;
}


function deleteFinalDestination() {
     if (destination.blip) {
         destination.blip.destroy();
         destination.blip = null;
     }
     if (destination.shape) {
        destination.shape.destroy();
        destination.shape = null;
     }
}


mp.events.add("playerEnterColshape", (shape) => {
    if (shape.isFinalDestinationShape) {
        mp.events.callRemote('taxi.driver.destination.reach');
        mp.notify.success('Вы доставили клиента', 'Такси');
        deleteFinalDestination();
    };
});

mp.events.add("taxi.driver.app.order.cancel", () => {
    mp.events.call('taxi.driver.order.cancel');
});

mp.events.add("taxi.driver.order.cancel", () => {
    mp.notify.warning('Вы отменили заказ', 'Такси');
    mp.events.call('taxi.driver.route.destroy');
    deleteFinalDestination();
    mp.events.callRemote('taxi.driver.order.cancel');
});

mp.events.add("taxi.driver.order.canceled", () => {
    mp.notify.error('Клиент отменил заказ', 'Такси');
    mp.events.call('taxi.driver.route.destroy');
    deleteFinalDestination();
    mp.callCEFR('taxi.driver.order.cancel', []);
});