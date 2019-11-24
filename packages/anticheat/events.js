"use strict";

let anticheat = require('./index');

module.exports = {
    "__ragemp_cheat_detected": (player, cheatCode) => {
        console.log(`[ANTICHEAT] ${player.name} кикнут по подозрению в читерстве. Код: ${cheatCode}`);
        player.kick();
    },
    "anticheat.trigger": (player, reason) => {
        anticheat.trigger(player, reason);
    },
}
