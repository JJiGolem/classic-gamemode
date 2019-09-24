let promocodes = call("promocodes");

module.exports = {
    "init": () => {
        promocodes.init();
    },
    "promocodes.activate": (player, code) => {
        promocodes.activate(player, code);
    },
};
