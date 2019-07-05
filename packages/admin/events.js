let commands = require("./commands.js");

module.exports = {
    "admin.command.handle": (player, command, args) => {
        let cmd = commands[command];
        if (!cmd) return;

        // TODO: проверка на access

        cmd.handler(player, args);
    }
}