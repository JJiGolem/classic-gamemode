"use strict";

let anticheat = require('./index');

module.exports = {
    "__ragemp_cheat_detected": (player, cheatCode) => {
        console.log(`[ANTICHEAT] ${player.name} кикнут по подозрению в читерстве. Код: ${cheatCode}`);
        player.kick();
    },
    "init": async () => {
        await anticheat.init();
        inited(__dirname);
    },
    "characterInit.done": (player) => {
        anticheat.initForPlayer(player);
    },
    "anticheat.trigger": (player, name, reason) => {
        anticheat.trigger(player, name, reason);
    },
}
