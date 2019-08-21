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
    order = {
        id: order.id,
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
    return parseFloat((mp.vdist(mp.players.local.position, pos) / 1000).toFixed(1));
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
    if (client.blip) client.blip.destroy();
    if (client.marker) client.marker.destroy();
    if (client.shape) client.shape.destroy();

});

mp.events.add("taxi.driver.destination.create", (position) => {
    createFinalDestination();

});

function createFinalDestination(pos) {
    destination.blip = mp.blips.new(1, pos, { color: 71, name: "Точка назначения" });
    destination.blip.setRoute(true);

    destination.shape = mp.colshapes.newSphere(pos.x, pos.y, pos.z, 6);
    mp.colshapes.newTube(pos.x, pos.y, -1000, 20.0, 1000.0, 0);

    destination.shape.pos = pos;
    destination.shape.isFinalDestinationShape = true;
}


mp.events.add("playerEnterColshape", (shape) => {
    if (shape.isFinalDestinationShape) {
        mp.chat.debug('enter final destination');
    };
});

mp.events.add("playerExitColshape", (shape) => {
    if (shape.isFinalDestinationShape) {
        mp.chat.debug('exit final destination');
    }
});