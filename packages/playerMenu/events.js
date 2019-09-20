let playerMenu = call('playerMenu');

module.exports = {
    "characterInit.done": (player) => {
        playerMenu.init(player);
    },
    "player.faction.changed": (player) => {
        playerMenu.setFaction(player);
    },
    "player.factionRank.changed": (player) => {
        playerMenu.setFactionRank(player);
    },
}
