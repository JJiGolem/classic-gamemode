"use strict";
let admin = require("./index.js");
let commands = {};

module.exports = {
    "init": () => {
        /// Список всех команд на сервере
        admin.init();
        commands = admin.getCommands();
    },
    /// обработка админ команд
    "admin.command.handle": (player, command, args) => {
        if (command == "/ahelp") return mp.events.call('admin.command.help', player, args);
        let cmd = commands[command];
        if (!cmd) return;

        // TODO: проверка на access
        if (player.character.admin >= cmd.access) {
            if (cmd.args) {
                let requiredArgs = cmd.args.split('] ').length;

                if (args.length < requiredArgs) {
                    return player.call('chat.message.push', [`!{#ffffff} Используйте: ${command} ${cmd.args}`]);
                }
            }

            // TODO: Swift: реализиовать вывод ответа команд в чат
            // Если player не передан, значит выводить сообщение всем админам
            // пример в terminal/index.js
            cmd.handler(player, args, {
                log(text, player) {
                    console.log(`${player.name}: ${text}`);
                },
                info(text, player) {
                    console.log(`${player.name}: ${text}`);
                },
                warning(text, player) {
                    console.log(`${player.name}: ${text}`);
                },
                error(text, player) {
                    console.log(`${player.name}: ${text}`);
                },
                debug(text, player) {
                    console.log(`${player.name}: ${text}`);
                },
            });
            // console.log(requiredArgs);

        }
    },
    /// обработка команды ahelp
    "admin.command.help": (player, args) => {
        if (!args[0] || isNaN(parseInt(args[0]))) return player.call('chat.message.push', [`!{#ffffff} Используйте /ahelp [уровень администрирования]`]);

        if (args[0] < 1 || args[0] > player.character.admin) return player.call('chat.message.push', [`!{#ffffff} Нет доступа`]);

        player.call('chat.message.push', [`!{#c1f051}Команды ${args[0]} уровня администрирования:`]);
        for (let cmd in commands) {
            if (commands[cmd].access == args[0]) {
                player.call('chat.message.push', [`!{#ffffff} ${commands[cmd].description}: ${cmd} ${commands[cmd].args}`]);
            }
        }
    },
    /// Отправить сообщение всем админам
    "admin.notify.all": (message) => {
        mp.players.forEach((current) => {
            if (current.character) {
                if (current.character.admin > 0) {
                    try {
                        current.call('chat.message.push', [message]);
                    } catch (err) {
                        console.log(err);
                    }
                }
            }
        });
    },
    /// Отправить сообщение всем игрокам
    "admin.notify.players": (message) => {
        mp.players.forEach((current) => {
            if (!current.character) return;
            try {
                current.call('chat.message.push', [message]);
            } catch (err) {
                console.log(err);
            }
        });
    }
}
