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
            player.call('chat.message.push', [`!{#ffffff}${player.name} зашел в колшейп fishing`]);
            player.call('fishing.menu.show');
            player.currentColshape = shape;
        }

        if (shape.isFishingPlace) {
            mp.events.call('fishing.start', player);
            player.currentColshape = shape;
        }
    },
    "playerExitColshape": (player, shape) => {
        if (!player.character) return;

        if (shape.isFishingPlaceMenu) {
            player.call('chat.message.push', [`!{#ffffff}${player.name} вышел с колшейпа fishing`]);
            player.call('fishing.menu.close');
            player.currentColshape = null;
        }

        if (shape.isFishingPlace) {
            mp.events.call('fishing.end', player);
            player.currentColshape = shape;
        }
    },
    "fishing.start": (player) => {
        if (!player.character) return;
        if (!inventory.getItemByItemId(player, fishing.getRodId())) return notifs.error(player, "У вас нет удочки", "Ошибка");

        player.call('fishing.start');
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