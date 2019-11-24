"use strict";

module.exports = {

    trigger(player, reason) {
        mp.events.call("admin.notify.all", `!{#ff0000} ANTICHEAT: ${player.name} kicked (${reason})`);
        player.kick();
    },
};
