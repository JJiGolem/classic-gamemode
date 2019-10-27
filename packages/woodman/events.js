let woodman = call('woodman');

module.exports = {
    "init": () => {
        woodman.init();
        inited(__dirname);
    },
    "auth.done": (player) => {
        player.call(`woodman.setTreesInfo`, [woodman.treesInfo.map(x => x.dataValues)]);
    },
    "woodman.items.buy": (player, index) => {
        woodman.buyItem(player, index);
    },
    "woodman.clothes.buy": (player, index) => {
        woodman.buyClothes(player, index);
    },
    "playerEnterWorldObject": (player, colshape) => {
        debug(`playerEnterWorldObject`)

        player.call(`woodman.tree.inside`, [colshape.db.pos, colshape.health]);
    },
    "playerExitWorldObject": (player, obj) => {
        debug(`playerExitWorldObject`)
        player.call(`woodman.tree.inside`);
    },
};
