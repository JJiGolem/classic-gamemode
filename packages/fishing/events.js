"use strict"

var fishing = require('./index.js');

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
    },
    "fishing.start": (player) => {
        player.call('fishing.start');
    },
    "fishing.end": (player) => {

    },
    "fishing.rod.buy": (player) => {
        if (!player.character) return;

        fishing.buyRod(player);
    },
}