"use strict";

module.exports = {

    log(player, text) {
        var data = {};
        if (typeof player == 'string') text = player;
        else {
            data.characterId = player.character.id,
            data.playerId = player.id
        }
        data.text = text;

        db.Models.Log.create(data);
    }
};
