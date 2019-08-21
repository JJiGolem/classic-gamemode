let satiety = require('./index.js');
module.exports = {
    "init": () => {},
    "characterInit.done": (player) => {
        player.health = player.character.health;
        satiety.startTimer(player);
    },
    "playerQuit": (player) => {
        satiety.stopTimer(player);
        player.character.health = player.health;
        player.character.save();
    }
};