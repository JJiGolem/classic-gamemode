isInCarMarketColshape = false;

mp.events.add('carmarket.colshape.enter', () => {
    isInCarMarketColshape = true;
});

mp.events.add('carmarket.colshape.leave', () => {
    isInCarMarketColshape = false;
});

mp.keys.bind(0x45, true, () => {
    if (isInCarMarketColshape) {
        mp.events.callRemote('carmarket.menu.show'); 
    }
});

mp.events.add('carmarket.menu.show', () => {
    mp.callCEFV(`selectMenu.menu = selectMenu.menus["carMarketMenu"]`);
    mp.callCEFV(`selectMenu.open()`);
});

mp.events.add('carmarket.car.sell', () => {
    mp.events.callRemote('carmarket.car.sell');
    mp.callCEFV(`selectMenu.close()`);
});

mp.events.add('carmarket.menu.close', () => {
    mp.callCEFV(`selectMenu.close()`);
});