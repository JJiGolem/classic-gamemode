"use strict";

let mood = call('mood');
let walking = call('walking');

module.exports = {
    // Кол-во походок
    walkingCount: 7,
    // Кол-во эмоций
    moodCount: 7,

    apply(player) {
        walking.set(player, player.character.settings.walking);
        mood.set(player, player.character.settings.mood);
    }
};
