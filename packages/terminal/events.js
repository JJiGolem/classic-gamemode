let terminal = require('./index.js');
module.exports = {
    "init": () => {},
    "characterInit.done": (player) => {
        if (terminal.haveAccess(player))
            player.call(`terminal.enable`, [true]);
    },
    "terminal.command.handle": (player, values) => {
        values = JSON.parse(values);
        terminal.handleCommand(player, values.shift(), values);
    },
};
