let notifs = call('notifications');
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
    "woodman.trees.hit": (player) => {
        var header = `Лесоруб`;
        var out = (text) => {
            notifs.error(player, text, header);
        };
        if (!player.tree) return out(`Вы не у дерева`);
        woodman.hitTree(player, player.tree);
    },
    "playerEnterWorldObject": (player, colshape) => {
        debug(`playerEnterWorldObject`)
        player.tree = colshape;
        player.call(`woodman.tree.inside`, [colshape.db.pos, colshape.health]);
    },
    "playerExitWorldObject": (player, obj) => {
        debug(`playerExitWorldObject`)
        delete player.tree;
        player.call(`woodman.tree.inside`);
    },
};
