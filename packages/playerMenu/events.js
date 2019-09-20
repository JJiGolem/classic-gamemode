let playerMenu = call('playerMenu');

module.exports = {
    "characterInit.done": (player) => {
        playerMenu.init(player);
    },
}
