let clubs = call('clubs');

module.exports = {
    "bizes.done": () => {
        clubs.init();
        inited(__dirname);
    },
    "clubs.alcohol.buy": (player, index) => {
        clubs.buyAlcohol(player, index);
    },
};
