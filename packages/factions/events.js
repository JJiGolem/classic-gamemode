let factions = require('./index.js');
module.exports = {
    "init": () => {
        factions.init();
    },
    // TODO: Вынести куда-то в общее место
    "playerEnterColshape": (player, colshape) => {
        if (colshape.onEnter) colshape.onEnter(player);
    },
    "playerExitColshape": (player, colshape) => {
        if (colshape.onExit) colshape.onExit(player);
    },
};
