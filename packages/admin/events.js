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

            cmd.handler(player, args, {
                log(text, player) {
                    let messages = text.split('<br/>');
                    if (player) {
                        messages.forEach((message) => {
                            if (!message) return;
                            player.call('chat.message.push', [`!{#e0b8ff} ${message}`])
                        });
                    } else {
                        messages.forEach((message) => {
                            if (!message) return;
                            mp.events.call('admin.notify.all', `!{#e0b8ff}[A] ${message}`);
                        });
                    }
                },
                info(text, player) {
                    let messages = text.split('<br/>');
                    if (player) {
                        messages.forEach((message) => {
                            if (!message) return;
                            player.call('chat.message.push', [`!{#59dbff} ${message}`])
                        });
                    } else {
                        messages.forEach((message) => {
                            if (!message) return;
                            mp.events.call('admin.notify.all', `!{#59dbff}[A] ${message}`);
                        });
                    }
                },
                warning(text, player) {
                    let messages = text.split('<br/>');
                    if (player) {
                        messages.forEach((message) => {
                            if (!message) return;
                            player.call('chat.message.push', [`!{#ffcc24} ${message}`])
                        });
                    } else {
                        messages.forEach((message) => {
                            if (!message) return;
                            mp.events.call('admin.notify.all', `!{#ffcc24}[A] ${message}`);
                        });
                    }
                },
                error(text, player) {
                    let messages = text.split('<br/>');
                    if (player) {
                        messages.forEach((message) => {
                            if (!message) return;
                            player.call('chat.message.push', [`!{#ff0000} ${message}`])
                        });
                    } else {
                        messages.forEach((message) => {
                            if (!message) return;
                            mp.events.call('admin.notify.all', `!{#ff0000}[A] ${message}`);
                        });
                    }
                },
                debug(text, player) {
                    let messages = text.split('<br/>');
                    if (player) {
                        messages.forEach((message) => {
                            if (!message) return;
                            player.call('chat.message.push', [`!{#ffffff} ${message}`])
                        });
                    } else {
                        messages.forEach((message) => {
                            if (!message) return;
                            mp.events.call('admin.notify.all', `!{#ffffff}[A] ${message}`);
                        });
                    }
                },
            });
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
    },
    // Поступила жалоба от игрока
    "admin.report": (player, message) => {
        mp.events.call("admin.notify.all", `!{#f29f53}[A] Жалоба от ${player.name}: ${message}`);
    },
}
