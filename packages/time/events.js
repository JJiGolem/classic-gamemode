"use strict";
var time = require('./index.js');

module.exports = {
    "init": () => {
        time.init();
    },
    "characterInit.done": (player) => {
        player.authTime = Date.now();
    },
    "playerQuit": (player) => {
        // if (!player.character) return;
        //
        // var minutes = parseInt((Date.now() - player.authTime) / 1000 / 60 % 60);
        // player.character.minutes += minutes;
        // player.character.save();
    },
}
