"use strict";

let dmv = {
    x: -129.16294860839844,
    y: -648.9642944335938,
    z: 40.68580627441406,
    enter: {
        x: -129.16294860839844,
        y: -648.9642944335938,
        z: 40.68580627441406,
        toX: -140.92169189453125,
        toY: -616.5048828125,
        toZ: 168.82040405273438,
        toD: 1,
        toH: 190.4051055908203
    },
    exit: {
        x: -139.50723266601562,
        y: -613.8941650390625,
        z: 168.82052612304688,
        d: 1,
        toX: -128.3179931640625,
        toY: -646.96044921875,
        toZ: 40.49969482421875,
        toH: 329.2262878417969
    },
    menu: {
        x: -139.287841796875,
        y: -632.2716674804688,
        z: 168.85995483398438
    }
}
let menuShape;

const PRICE = {
    CAR: 250,
    PASSENGER: 750,
    BIKE: 200,
    TRUCK: 1500,
    AIR: 15000,
    BOAT: 3500
}
module.exports = {
    init() {
        mp.blips.new(545, new mp.Vector3(dmv.x, dmv.y, dmv.z),
            {
                name: "Департамент лицензирования",
                shortRange: true,
                color: 36
            });

        let enter = mp.colshapes.newSphere(dmv.enter.x, dmv.enter.y, dmv.enter.z, 1.5);
        enter.onEnter = (player) => {
            player.position = new mp.Vector3(dmv.enter.toX, dmv.enter.toY, dmv.enter.toZ);
            player.dimension = dmv.enter.toD;
            player.heading = dmv.enter.toH;
        }

        mp.markers.new(2, new mp.Vector3(dmv.enter.x, dmv.enter.y, dmv.enter.z - 0.3), 0.75, {
            rotation: new mp.Vector3(0, 180, 0),
            dimension: 0
        });

        let exit = mp.colshapes.newSphere(dmv.exit.x, dmv.exit.y, dmv.exit.z, 1.5);
        exit.dimension = dmv.exit.d;
        exit.onEnter = (player) => {
            player.position = new mp.Vector3(dmv.exit.toX, dmv.exit.toY, dmv.exit.toZ);
            player.dimension = 0;
            player.heading = dmv.exit.toH;
        }

        mp.markers.new(2, new mp.Vector3(dmv.exit.x, dmv.exit.y, dmv.exit.z - 0.05), 0.75, {
            rotation: new mp.Vector3(0, 180, 0),
            dimension: dmv.exit.d
        });


        mp.markers.new(1, new mp.Vector3(dmv.menu.x, dmv.menu.y, dmv.menu.z - 1.2), 0.4,
            {
                color: [255, 143, 190, 111],
                visible: true,
                dimension: 1
            });
        menuShape = mp.colshapes.newSphere(dmv.menu.x, dmv.menu.y, dmv.menu.z, 1.2);
        menuShape.dimension = 1;
        menuShape.onEnter = (player) => {
            player.call('dmv.menu.show', [PRICE])
        }
        menuShape.onExit = (player) => {
            player.call('dmv.menu.close')
        }
    },
    getDMVdata() {
        return dmv;
    },
    getPriceConfig() {
        return PRICE;
    }
}

