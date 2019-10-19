let terminal = require('./index.js');
let admin = require('../admin');
module.exports = {
    "init": () => {
        terminal.commands = admin.getCommands();
    },
    "characterInit.done": (player) => {
        if (terminal.haveAccess(player))
            player.call(`terminal.enable`, [true]);
    },
    "terminal.command.handle": (player, values) => {
        if (typeof values == 'string') values = JSON.parse(values);
        terminal.handleCommand(player, values.shift(), values);
    },
};
