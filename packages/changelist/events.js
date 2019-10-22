let changelist = call('changelist');

module.exports = {
    "init": () => {
        changelist.init();
        inited(__dirname);
    },
    "characterInit.done": (player) => {
        changelist.sendLikes(player);
    },
    "changelist.like": (player, changelistId) => {
        if (!player.account) return;

        changelist.like(player, changelistId);
    },
};
