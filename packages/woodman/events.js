let woodman = call('woodman');

module.exports = {
    "init": () => {
        woodman.init();
        inited(__dirname);
    },
    "auth.done": (player) => {
        player.call(`woodman.setTreesInfo`, [woodman.treesInfo.map(x => x.dataValues)]);
    },
};
