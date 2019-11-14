let clubs = call('clubs');

module.exports = {
    "bizes.done": () => {
        clubs.init();
        inited(__dirname);
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
