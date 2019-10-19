let afk = require('./index');

module.exports = {
    "afk.set": (player, enable) => {
        afk.setAfk(player, enable);
    },
};
