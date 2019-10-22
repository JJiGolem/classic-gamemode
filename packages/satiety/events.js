let satiety = require('./index.js');
module.exports = {
    "init": () => {
        inited(__dirname);
    },
    "characterInit.done": (player) => {
        player.health = player.character.health;
        satiety.startTimer(player);
    },
    "playerQuit": (player) => {
        if (!player.character) return;
        satiety.stopTimer(player);
        player.character.health = player.health;
        player.character.save();
    }
};
