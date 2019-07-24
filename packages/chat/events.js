"use strict";
module.exports = {

    "characterInit.done": (player) => {     //characterInit.done
        player.call('chat.load');
        player.call('chat.message.push', ['!{#00abff} Добро пожаловать на Classic Roleplay!']);
        player.setVariable('nick', player.name);
    },

    "chat.tags.update": () => {
        /* 
        TODO:
        Вызывать функцию при выборе персонажа/принятии/увольнении
        Сделать проверку на то, состоит ли человек в организации
        Если состоит, вызываем на клиенте addChatTags и передаем туда массив нужных тэгов
        Рация
        */
    },


    //TODO: добавить проверки на мут, организацию, знакомство (???)
    "chat.message.get": (player, type, message) => {

        if (message.length > 100) {
            message = message.slice(0, 100);
        };

        if (message[0] == '/') {

            let args = message.split(' ');
            let command = args[0];
            args.splice(0, 1);
            mp.events.call('chat.command.handle', player, command, args)

        } else {
            switch (type) {
                case 0: {
                    mp.events.call('chat.action.say', player, message);
                    break;
                }
                case 1: {
                    mp.events.call('/s', player, message);
                    break;
                }
                case 2: {
                    mp.events.call('/r', player, message);
                    break;
                }
                case 3: {
                    mp.events.call('/n', player, message);
                    break;
                }
                case 4: {
                    mp.events.call('/me', player, message);
                    break;
                }
                case 5: {
                    mp.events.call('/do', player, message);
                    break;
                }
                case 6: {
                    mp.events.call('/try', player, message);
                    break;
                }
            }
        }
    },

    "chat.command.handle": (player, command, args) => {
        switch (command) {
            case '/s':
            case '/r':
            case '/n':
            case '/me':
            case '/do':
            case '/try':
                mp.events.call(command, player, args);
                break;
            default:
                // TODO: проверка на админа
                mp.events.call('admin.command.handle', player, command, args);
                break;
        }
    },

    "chat.action.say": (player, message) => {
        mp.players.forEachInRange(player.position, 10, (currentPlayer) => {
            if (currentPlayer.dimension == player.dimension) {
                currentPlayer.call('chat.action.say', [player.name, player.id, message]);
            };
        });
    },

    "/s": (player, message) => {
        mp.players.forEachInRange(player.position, 20, (currentPlayer) => {
            if (currentPlayer.dimension == player.dimension) {
                currentPlayer.call('chat.action.shout', [player.name, player.id, message]);
            };
        });
    },

    "/r": (player, message) => {
        mp.players.forEach((currentPlayer) => {
            if (true) {
                currentPlayer.call('chat.action.walkietalkie', [player.name, player.id, message]);
            };
        });
    },

    "/n": (player, message) => {
        mp.players.forEachInRange(player.position, 10, (currentPlayer) => {
            if (currentPlayer.dimension == player.dimension) {
                currentPlayer.call('chat.action.nonrp', [player.name, player.id, message]);
            };
        });
    },

    "/me": (player, message) => {
        mp.players.forEachInRange(player.position, 10, (currentPlayer) => {
            if (currentPlayer.dimension == player.dimension) {
                currentPlayer.call('chat.action.me', [player.name, player.id, message]);
            };
        });
    },
    "/do": (player, message) => {
        mp.players.forEachInRange(player.position, 10, (currentPlayer) => {
            if (currentPlayer.dimension == player.dimension) {
                currentPlayer.call('chat.action.do', [player.name, player.id, message]);
            };
        });
    },


    // "/gnews": (player, message) => {
    //     mp.players.forEach((currentPlayer) => {
    //         currentPlayer.call('playerGnews', [player.name, player.id, message]);
    //     });
    // },

    "/try": (player, message) => {

        let result = false;
        if (Math.random() > 0.5) result = true;

        mp.players.forEachInRange(player.position, 10, (currentPlayer) => {
            if (currentPlayer.dimension == player.dimension) {
                currentPlayer.call('chat.action.try', [player.name, player.id, message, result]);
            };
        });
    }

}