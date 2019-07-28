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