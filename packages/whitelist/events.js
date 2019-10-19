"use strict";

let whitelist = require('./index.js');
let allowed = whitelist.getAllowed();

module.exports = {
    "init": () => {
        whitelist.init();
    },
    "player.joined": (player) => {
        if (!whitelist.isEnabled()) return;

        if (allowed.includes(player.socialClub)) {
            console.log(`[WHITELIST]${player.socialClub} зашел на сервер по вайтлисту`);
        } else {
            console.log(`[WHITELIST]${player.socialClub} пытался войти, но его нет в вайтлисте`);
            player.kick("Kicked");
        }
    }
}