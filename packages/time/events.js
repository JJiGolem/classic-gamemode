"use strict";
var time = require('./index.js');

module.exports = {
    "init": () => {
        time.init();
    },
    "characterInit.done": (player) => {
        player.authTime = Date.now();
    },
}
