"use strict";
let factions = call('factions');

module.exports = {
    "init": () => {

    },
    "characterInit.done": (player) => {
        if (!factions.isNewsFaction(player.character.factionId)) return;
        player.call(`mapCase.init`, [player.name, player.character.factionId]);
        mp.events.call(`mapCase.news.init`, player);
    },
}
