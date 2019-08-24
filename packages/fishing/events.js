"use strict"

var fishing = require('./index.js');

module.exports = {
    "init": () => {
        fishing.init();
    },
    "playerEnterColshape": (player, shape) => {
        if (!player.character) return;

        if (shape.isFishingPlace) {
            player.call('chat.message.push', [`!{#ffffff}${player.name} зашел в колшейп fishing`]);
            player.call('fishing.menu.show');
            player.currentColshape = shape;
        }
    },
    "playerExitColshape": (player, shape) => {
        if (!player.character) return;

        if (shape.isFishingPlace) {
            player.call('chat.message.push', [`!{#ffffff}${player.name} вышел с колшейпа fishing`]);
            player.call('fishing.menu.close');
            player.currentColshape = null;
        }
    },
    "fishing.start": (player) => {

    },
    "fishing.end": (player) => {

    },
    "fishing.rod.buy": (player) => {
        
    },
}