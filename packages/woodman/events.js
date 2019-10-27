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
    "playerEnterWorldObject": (player, obj) => {
        debug(`playerEnterWorldObject`)

        player.call(`woodman.tree.inside`, [obj.pos, 47]);
    },
    "playerExitWorldObject": (player, obj) => {
        debug(`playerExitWorldObject`)
        player.call(`woodman.tree.inside`);
    },
};
