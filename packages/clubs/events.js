let clubs = call('clubs');

module.exports = {
    "bizes.done": () => {
        clubs.init();
        inited(__dirname);
    },
    "characterInit.done": (player) => {
        player.call(`clubs.drunkennessData.init`, [{
            vfxDrunkenness: clubs.vfxDrunkenness,
            vfxName: clubs.vfxName,
        }]);
    },
    "clubs.alcohol.buy": (player, index) => {
        clubs.buyAlcohol(player, index);
    },
    "clubs.snacks.buy": (player, index) => {
        clubs.buySnack(player, index);
    },
    "clubs.smoke.buy": (player, index) => {
        clubs.buySmoke(player, index);
    },
};
