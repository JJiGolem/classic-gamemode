let commands = require("./commands.js");

module.exports = {
    "admin.command.handle": (player, command, args) => {
        if (command == "/ahelp") return mp.events.call('admin.command.help', player, args);
        let cmd = commands[command];
        if (!cmd) return;

        // TODO: проверка на access

        cmd.handler(player, args);
    },
    "admin.command.help": (player, args) => {
        if (!args[0] || isNaN(parseInt(args[0]))) return player.call('chat.message.push', [`!{#ffffff} Используйте /ahelp [уровень администрирования]`]);
        //TODO: Проверка на уровень админки

        player.call('chat.message.push', [`!{#c1f051}Команды ${args[0]} уровня администрирования:`]);
        for (let cmd in commands) {
            if (commands[cmd].access == args[0]) {
                player.call('chat.message.push', [`!{#ffffff} ${commands[cmd].description}: ${cmd} ${commands[cmd].args}`]);
            }
          }
    }
}