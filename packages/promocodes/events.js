let promocodes = call("promocodes");

module.exports = {
    "init": () => {
        promocodes.init();
    },
    "characterInit.done": (player) => {
        promocodes.check(player);
    },
    "promocodes.activate": (player, code) => {
        promocodes.activate(player, code);
    },
};
