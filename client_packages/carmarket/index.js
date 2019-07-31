isInCarMarketColshape = false;

mp.events.add('carmarket.colshape.enter', () => {
    isInCarMarketColshape = true;
});

mp.events.add('carmarket.colshape.leave', () => {
    isInCarMarketColshape = false;
});

mp.keys.bind(0x45, true, () => {
    if (isInCarMarketColshape) {
        mp.events.callRemote('carmarket.sellmenu.show');
    }
});

mp.events.add('carmarket.sellmenu.show', () => {
    mp.callCEFV(`selectMenu.menu = cloneObj(selectMenu.menus["carMarketSellMenu"])`);
    mp.callCEFV(`selectMenu.show = true`);
});

mp.events.add('carmarket.car.sell', () => {
    mp.callCEFV(`loader.show = true;`);
    mp.events.callRemote('carmarket.car.sell');
    mp.callCEFV(`selectMenu.menu = null`);
});
mp.events.add('carmarket.car.sell.ans', (ans) => {
    mp.callCEFV(`loader.show = false;`);

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
            mp.notify.success('Вы успешно продали т/с', 'Авторынок');
            break;
    }
});

mp.events.add('carmarket.sellmenu.close', () => {
    mp.callCEFV(`selectMenu.menu = null`);
});

mp.events.add('carmarket.buymenu.show', () => {
    mp.callCEFV(`selectMenu.menu = cloneObj(selectMenu.menus["carMarketBuyMenu"])`);
    mp.callCEFV(`selectMenu.show = true`);
});

mp.events.add('carmarket.buymenu.close', () => {
    mp.callCEFV(`selectMenu.menu = null`);
});

mp.events.add('carmarket.car.buy', () => {
    mp.callCEFV(`loader.show = true;`);
    mp.events.callRemote('carmarket.car.buy');
    mp.callCEFV(`selectMenu.menu = null`);
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
            mp.notify.success('Вы успешно приобрели т/с', 'Авторынок');

            mp.events.call('chat.message.push', `!{#009eec}Вы приобрели транспортное средство !{#f3c800}${data.name} !{#009eec}за !{#80c102}$228000`);
            break;
    }
});