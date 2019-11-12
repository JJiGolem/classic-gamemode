"use strict";

let info = {
    x: 936.0476684570312,
    y: 47.1480598449707,
    z: 81.09574890136719,
    enter: {
        x: 936.0476684570312,
        y: 47.1480598449707,
        z: 81.09574890136719,
        toX: 1090.128662109375,
        toY: 208.46066284179688,
        toZ: -48.9999885559082,
        toD: 1,
        toH: 358.18463134765625
    },
    exit: {
        x: 1089.6820068359375,
        y: 205.87353515625,
        z: -48.999732971191406,
        d: 1,
        toX: 935.1140747070312,
        toY: 45.80738830566406,
        toZ: 81.09574890136719,
        toH: 140.51380920410156
    },
    area: {
        x: 1100.5877685546875,
        y: 219.75877380371094,
        z: -48.748653411865234
    }
}
let casinoArea;
let infoShape;

module.exports = {
    minDiceCash: 100,
    maxDiceCash: 10000,
    init() {
        mp.blips.new(617, new mp.Vector3(info.x, info.y, info.z),
            {
                name: "Казино",
                shortRange: true,
                color: 4
            });

        let enter = mp.colshapes.newSphere(info.enter.x, info.enter.y, info.enter.z, 1.5);
        enter.onEnter = (player) => {
            player.position = new mp.Vector3(info.enter.toX, info.enter.toY, info.enter.toZ);
            player.dimension = info.enter.toD;
            player.heading = info.enter.toH;
        }

        mp.markers.new(2, new mp.Vector3(info.enter.x, info.enter.y, info.enter.z - 0.3), 0.75, {
            rotation: new mp.Vector3(0, 180, 0),
            dimension: 0
        });

        let exit = mp.colshapes.newSphere(info.exit.x, info.exit.y, info.exit.z, 1.5);
        exit.dimension = info.exit.d;
        exit.onEnter = (player) => {
            player.position = new mp.Vector3(info.exit.toX, info.exit.toY, info.exit.toZ);
            player.dimension = 0;
            player.heading = info.exit.toH;
        }

        mp.markers.new(2, new mp.Vector3(info.exit.x, info.exit.y, info.exit.z - 0.05), 0.75, {
            rotation: new mp.Vector3(0, 180, 0),
            dimension: info.exit.d
        });

        casinoArea = mp.colshapes.newSphere(info.area.x, info.area.y, info.area.z, 100);
        casinoArea.dimension = 1;
        casinoArea.onEnter = (player) => {
            player.call('casino.area.enter', [true]);
        }
        casinoArea.onExit = (player) => {
            player.call('casino.area.enter', [false]);
        }

        infoShape = mp.colshapes.newSphere(1088.2305908203125, 219.5839080810547, -49.200382232666016, 1.2)
        infoShape.dimension = 1;
        infoShape.onEnter = (player) => {
            player.call('casino.info.show', [true]);
        }
        infoShape.onExit = (player) => {
            player.call('casino.info.show', [false]);
        }
    },
    isPlayerInCasinoArea(player) {
        return casinoArea.isPointWithin(player.position);
    }
}

