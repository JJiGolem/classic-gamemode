let clubs = call('clubs');

module.exports = {
    "bizes.done": () => {
        clubs.init();
        inited(__dirname);
    },
    "characterInit.done": (player) => {
        player.call(`clubs.drunkennessData.init`, [{
            walkingDrunkenness: clubs.walkingDrunkenness,
            vfxDrunkenness: clubs.vfxDrunkenness,
            vfxName: clubs.vfxName,
            drunkennessWaitClear: clubs.drunkennessWaitClear,
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
    "clubs.drunkenness.sync": (player) => {
        clubs.deleteDrunkenness(player, clubs.drunkennessDec);
    },
};
