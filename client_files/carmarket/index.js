let isInCarMarketColshape = false;
let sellButtonPressed = false;
let isSellMenuShown = false;
mp.events.add('carmarket.colshape.enter', () => {
    isInCarMarketColshape = true;
});

mp.events.add('carmarket.colshape.leave', () => {
    isInCarMarketColshape = false;
    mp.events.call('carmarket.sellmenu.close');

});

mp.keys.bind(0x45, true, () => {
    if (mp.game.ui.isPauseMenuActive()) return;
    if (sellButtonPressed) return;
    if (isInCarMarketColshape) {
        if (!mp.players.local.vehicle) return;
        if (mp.players.local.vehicle.getPedInSeat(-1) != mp.players.local.handle) return;
        if (isSellMenuShown) return;
        isSellMenuShown = true;
        mp.events.callRemote('carmarket.sellmenu.show');
    }
});

mp.events.add('carmarket.sellmenu.show', () => {
    mp.busy.add('carmarket.sellmenu', false);
    mp.callCEFV(`selectMenu.menu = cloneObj(selectMenu.menus["carMarketSellMenu"])`);
    mp.callCEFV(`selectMenu.show = true`);
});

mp.events.add('carmarket.car.sell', () => {
    sellButtonPressed = true;
    mp.events.callRemote('carmarket.car.sell');
});
mp.events.add('carmarket.car.sell.ans', (ans, price) => {

    switch (ans) {
        case 0:
            mp.notify.error('Вы не в своем т/с', 'Ошибка');
            break;
        case 1:
            mp.notify.error('Вы не у авторынка', 'Ошибка');
            break;
        case 2:
            mp.notify.error('Не удалось продать т/с', 'Ошибка');
            break;
        case 3:
            mp.busy.remove('carmarket.sellmenu');
            mp.notify.success(`Вы продали т/с за $${price}`, 'Авторынок');
            break;
    }
    sellButtonPressed = false;
    isSellMenuShown = false;
    mp.callCEFV(`selectMenu.loader = false;`);
});

mp.events.add('carmarket.sellmenu.close', () => {
    mp.busy.remove('carmarket.sellmenu');
    mp.callCEFV(`selectMenu.show = false`);
    isSellMenuShown = false;
});

mp.events.add('carmarket.buymenu.show', (data) => {
    if (!data) return;
    mp.busy.add('carmarket.buymenu', false);
    mp.callCEFV(`selectMenu.menu = cloneObj(selectMenu.menus["carMarketBuyMenu"])`);
    if (mp.players.local.vehicle) mp.players.local.vehicle.freezePosition(true);
    mp.callCEFV(`carSpecifications.body = {
        name: { header: 'Название', value: '${data.name}', unit: '' },
        regDate: { header: 'Дата регистрации', value: '${dateFormatter(data.regDate)}', unit: '' },
        owners: { header: 'Владельцев', value: '${data.owners}', unit: '' },
        mileage: { header: 'Пробег', value: '${data.mileage.toFixed()}', unit: 'км' },
    };
    carSpecifications.price = '${data.price.toFixed()}'
    `);


    mp.callCEFV(`carSpecifications.show = true`);
    mp.callCEFV(`selectMenu.show = true`);
});

mp.events.add('carmarket.buymenu.close', () => {
    mp.busy.remove('carmarket.buymenu');
    mp.callCEFV(`carSpecifications.show = false`);
    mp.callCEFV(`selectMenu.show = false`);
});

mp.events.add('carmarket.car.buy', () => {
    mp.callCEFV(`loader.show = true;`);
    mp.events.callRemote('carmarket.car.buy');
    mp.callCEFV(`selectMenu.show = false`);
});

mp.events.add('carmarket.car.buy.ans', (ans, data) => {

    mp.callCEFV(`loader.show = false;`);
    switch (ans) {
        case 0:
            mp.notify.error('Вы не в т/с авторынка', 'Ошибка');
            break;
        case 1:
            mp.notify.error('Не удалось приобрести т/с', 'Ошибка');
            break;
        case 2:
            mp.busy.remove('carmarket.buymenu');
            mp.players.local.vehicle.freezePosition(false);
            mp.callCEFV(`carSpecifications.show = false`);
            mp.notify.success('Вы успешно приобрели т/с', 'Авторынок');
            mp.events.call('chat.message.push', `!{#009eec}Вы приобрели транспортное средство !{#f3c800}${data.name} !{#009eec}за !{#80c102}$${data.price}`);
            break;
        case 3:
            mp.notify.error('Недостаточно денег', 'Ошибка');
            break;
        case 4:
            mp.notify.error('Достигнут лимит на т/с', 'Ошибка');
            break;
        case 5: // нельзя выдать ключи в инвентарь
            mp.notify.error(data.text, `Инвентарь`);
            break;
    }
});


function dateFormatter(date) {
    if (!date) return '11-09-2001';
    date = date.slice(0, 10);
    //mp.chat.debug(date);
    date = date.split('-');
    //mp.chat.debug(date);
    let newDate = `${date[2]}-${date[1]}-${date[0]}`;

    return newDate;
}
