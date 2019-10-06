"use strict";

let walking = call('walking');

module.exports = {
    // Кол-во походок
    walkingCount: 7,
    // Кол-во эмоций
    moodCount: 7,

    apply(player) {
        var mood = player.character.settings.mood;

        walking.set(player, player.character.settings.walking);
    }
};
