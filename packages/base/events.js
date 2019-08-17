module.exports = {
    "playerEnterColshape": (player, colshape) => {
        if (colshape.onEnter) colshape.onEnter(player);
    },
    "playerExitColshape": (player, colshape) => {
        if (colshape.onExit) colshape.onExit(player);
    },
};
