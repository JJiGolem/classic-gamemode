"use strict";

module.exports = {
    "__ragemp_cheat_detected": (player, cheatCode) => {
        console.log(`[ANTICHEAT] ${player.name} кикнут по подозрению в читерстве. Код: ${cheatCode}`);
        player.kick();
    }
}