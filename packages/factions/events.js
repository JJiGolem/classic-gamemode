let factions = require('./index.js');
module.exports = {
    "init": () => {
        factions.init();
    },
    "factions.warehouse.takeBox": (player, type) => {
        factions.takeBox(player, type);
    },
    "factions.warehouse.putBox": (player) => {
        factions.putBox(player);
    },
};
