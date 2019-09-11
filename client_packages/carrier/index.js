"use strict";


/*
    Модуль грузоперевозчика.

    created 11.09.19 by Carter Slade
*/

mp.carrier = {
    setLoadInfo(data) {
        mp.terminal.debug(data);

        var price = [`$${data.productPrice}`];
        var sell = [`-${Math.ceil((1 - data.productSellK) * 100)}%`];

        mp.callCEFV(`selectMenu.setProp('carrierLoadFarms', 'farms', '${JSON.stringify(data.farms)}')`);
        mp.callCEFV(`selectMenu.setItemValues('carrierLoadProducts', 'Купить', '${JSON.stringify(price)}')`);
        mp.callCEFV(`selectMenu.setItemValues('carrierLoadProducts', 'Списать', '${JSON.stringify(sell)}')`);
    },
};

mp.events.add({
    "carrier.load.info.set": (data) => {
        mp.carrier.setLoadInfo(data);
    },
});
