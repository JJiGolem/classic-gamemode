let tattoo = require('./index.js');

module.exports = {
    "init": () => {
        tattoo.init();
        inited(__dirname);
    },
    "characterInit.done": async (player) => {
        await tattoo.loadCharacterTattoos(player);
        tattoo.setCharacterTattoos(player)
    }
}