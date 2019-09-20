"use strict";

let bizes = call('bizes');

module.exports = {
    init(player) {
        var biz = bizes.getBizByCharId(player.character.id);

        var data = {
            playerName: player.name,
            admin: player.character.admin,
            factionId: player.character.factionId,
            donate: player.account.donate,
        };
        debug(biz)
        player.call(`playerMenu.init`, [data]);
    },
};
