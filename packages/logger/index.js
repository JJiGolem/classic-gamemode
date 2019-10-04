"use strict";

module.exports = {
    /// text должен начинаться с [${moduleName}], для понимания источника логов
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
