let waitShape;
let waitMarker;

mp.events.add('taxi.client.app.open', () => {
    mp.chat.debug('open');
    mp.callCEFR('taxi.client.location', getClientLocation())
});

mp.events.add('taxi.client.app.search', () => {
    mp.chat.debug('search');
    if (mp.players.local.vehicle) {
        mp.notify.error('Нельзя заказать такси из транспорта', 'Такси');
        mp.callCEFR('taxi.client.order.cancel', []);
    }
    mp.events.callRemote('taxi.client.order.send');
});

mp.events.add('taxi.client.order.ans', (ans) => {
    switch (ans) {
        case 0:
            mp.notify.error('Нельзя заказать такси из транспорта', 'Такси');
            break;
        case 1:
            mp.notify.error('Вы не на улице', 'Такси');
            break;
        case 2:
            mp.notify.error('У вас недостаточно наличности', 'Такси');
            break;
        case 3:
            mp.notify.error('Вы уже сделали заказ', 'Такси');
            break;
        case 4:
            mp.notify.success('Заказ отправлен', 'Такси');
            mp.events.call('taxi.client.waitshape.create');
            break;
    }
});

mp.events.add('taxi.client.waitshape.create', () => {
    let player = mp.players.local;

    waitMarker = mp.markers.new(1, new mp.Vector3(player.position.x, player.position.y, player.position.z - 9.5), 10,
        {
            direction: new mp.Vector3(player.position.x, player.position.y, player.position.z),
            rotation: 0,
            color: [131, 255, 92, 180],
            visible: true,
            dimension: 0
        });
    waitShape = mp.colshapes.newSphere(player.position.x, player.position.y, player.position.z, 5.5);
    waitShape.pos = new mp.Vector3(player.position.x, player.position.y, player.position.z);
    waitShape.isTaxiClientShape = true;
});

mp.events.add('taxi.client.waitshape.destroy', () => {
    if (waitMarker) waitMarker.destroy();
    if (waitShape) waitShape.destroy();
});

mp.events.add("playerEnterColshape", (shape) => {
    if (shape.isTaxiClientShape) {
        mp.chat.debug('enter taxi client shape');
    };
});

mp.events.add("playerExitColshape", (shape) => {
    if (shape.isTaxiClientShape) {
        mp.chat.debug('exit taxi client shape');
        //mp.events.call('taxi.client.waitshape.destroy');
    }
});

function getClientLocation() {
    let pos = mp.players.local.position;
    return [mp.utils.getRegionName(pos), mp.utils.getStreetName(pos)];
}