let wedding = call('wedding');

module.exports = {
    "characterInit.done": (player) => {
        wedding.initSpouse(player);
    },
};
