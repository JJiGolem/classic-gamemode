"use strict";


/*
    Модуль грузоперевозчика.

    created 11.09.19 by Carter Slade
*/

mp.carrier = {
    initStartJob() {
        var pedInfo = {
            model: "s_m_m_cntrybar_01",
            position: {
                x: 905.0872802734375,
                y: -1575.5552978515625,
                z: 30.81341552734375
            },
            heading: 45.43087387084961,
            marker: {
                x: 904.468017578125,
                y: -1575.1195068359375,
                z: 29.826210021972656,
                color: [255, 255, 125, 128],
                enterEvent: "carrier.jobshape.enter",
                leaveEvent: "carrier.jobshape.leave"
            },
        };
        mp.events.call('NPC.create', pedInfo);
    },
    setLoadInfo(data) {
        var price = [`$${data.productPrice}`];
        var sell = [`-${Math.ceil((1 - data.productSellK) * 100)}%`];

        mp.callCEFV(`selectMenu.setProp('carrierLoadFarms', 'farms', '${JSON.stringify(data.farms)}')`);
        mp.callCEFV(`selectMenu.setItemValues('carrierLoadProducts', 'Купить', '${JSON.stringify(price)}')`);
        mp.callCEFV(`selectMenu.setItemValues('carrierLoadProducts', 'Списать', '${JSON.stringify(sell)}')`);
    },
};

mp.events.add({
    "characterInit.done": () => {
        mp.carrier.initStartJob();
    },
    "carrier.load.info.set": (data) => {
        mp.carrier.setLoadInfo(data);
    },
    "carrier.jobshape.enter": () => {
        mp.events.call(`selectMenu.show`, `carrierJob`);
    },
    "carrier.jobshape.leave": () => {
        mp.events.call(`selectMenu.hide`);
    },
});
