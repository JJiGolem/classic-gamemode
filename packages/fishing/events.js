"use strict"

let fishing = require('./index.js');
let inventory = call('inventory');
let notifs = call('notifications');

module.exports = {
    "init": () => {
        fishing.init();
    },
    "playerEnterColshape": (player, shape) => {
        if (!player.character) return;

        if (shape.isFishingPlaceMenu) {
            player.call('fishing.menu.show');
            player.currentColshape = shape;
        }

        if (shape.isFishingPlace) {
            mp.events.call('fishing.game.menu', player);
            player.currentColshape = shape;
        }
    },
    "playerExitColshape": (player, shape) => {
        if (!player.character) return;

        if (shape.isFishingPlaceMenu) {
            player.call('fishing.menu.close');
            player.currentColshape = null;
        }

        if (shape.isFishingPlace) {
            mp.events.call('fishing.game.menu.close', player);
            player.currentColshape = shape;
        }
    },
    "fishing.game.menu": (player) => {
        if (!player.character) return;
        player.call('fishing.game.menu'); 
    },
    "fishing.game.menu.close": (player) => {
        if (!player.character) return;
        player.call('fishing.game.menu.close'); 
    },
    "fishing.start": (player) => {
        if (!player.character) return;
        if (!inventory.getItemByItemId(player, fishing.getRodId())) return notifs.error(player, "У вас нет удочки", "Ошибка");

        let cam = fishing.setCamera(player);
        player.call('fishing.start', [cam]);
    },
    "fishing.end": (player) => {
        if (!player.character) return;
        
        player.call('fishing.end');
    },
    "fishing.rod.buy": (player) => {
        if (!player.character) return;

        fishing.buyRod(player);
    },
}