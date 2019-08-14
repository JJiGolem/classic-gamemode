let terminal = require('./index.js');
module.exports = {
    "init": () => {},
    "characterInit.done": (player) => {
        if (player.character.admin >= terminal.access)
            player.call(`terminal.enable`, [true]);
    },
};
