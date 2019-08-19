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
            break;
    }
});

function getClientLocation() {
    let pos = mp.players.local.position;
    return [mp.utils.getRegionName(pos), mp.utils.getStreetName(pos)];
}