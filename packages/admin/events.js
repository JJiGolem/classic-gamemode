"use strict";
let admin = require("./index.js");
let commands = {};

module.exports = {
    "init": () => {
        /// Список всех команд на сервере
        commands = admin.init();
    },
    /// обработка админ команд
    "admin.command.handle": (player, command, args) => {
        if (command == "/ahelp") return mp.events.call('admin.command.help', player, args);
        let cmd = commands[command];
        if (!cmd) return;

        // TODO: проверка на access

        cmd.handler(player, args);
    },
    /// обработка команды ahelp
    "admin.command.help": (player, args) => {
        if (!args[0] || isNaN(parseInt(args[0]))) return player.call('chat.message.push', [`!{#ffffff} Используйте /ahelp [уровень администрирования]`]);
        //TODO: Проверка на уровень админки

        player.chat.push(`!{#c1f051}Команды ${args[0]} уровня администрирования:`);
        for (let cmd in commands) {
            if (commands[cmd].access == args[0]) {
                player.chat.push(`!{#ffffff} ${commands[cmd].description}: ${cmd} ${commands[cmd].args}`);
            }
        }
    }
}