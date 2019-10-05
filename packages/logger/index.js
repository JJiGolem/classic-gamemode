"use strict";

module.exports = {

    log(text, moduleName = null, player = null) {
        var data = {
            text: text
        };
        if (moduleName) data.module = moduleName;
        if (player) {
            if (typeof player == 'number') data.characterId = player;
            else {
                data.characterId = player.character.id,
                data.playerId = player.id;
            }
        }

        db.Models.Log.create(data);
    }
};
