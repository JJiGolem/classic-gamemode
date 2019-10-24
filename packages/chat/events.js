"use strict";
var factions = require('../factions');
var chat = require('./index');
let news = call('news');

module.exports = {

    "characterInit.done": (player) => { //characterInit.done
        player.call('chat.load');
        player.call('chat.message.push', ['!{#00abff} Добро пожаловать на Classic Roleplay!']);

        if (player.character.admin > 0) {
            mp.events.call('admin.notify.all', `!{#f7f692}[A] Администратор ${player.character.admin} уровня ${player.name} авторизовался`);
        }
    },

    // "playerJoin": (player) => {
    //     player.call('chat.load');
    //     player.call('chat.message.push', ['!{#00abff} Добро пожаловать на Classic Roleplay!']);
    // },

    "chat.tags.update": () => {
        /*
        TODO:
        Вызывать функцию при выборе персонажа/принятии/увольнении
        Сделать проверку на то, состоит ли человек в организации
        Если состоит, вызываем на клиенте addChatTags и передаем туда массив нужных тэгов
        Рация
        */
    },


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
            if (!/\S/.test(message)) return;

            if (message == ')') return mp.events.call('/me', player, 'улыбается');
            if (message == '))') return mp.events.call('/me', player, 'смеется');
            if (message == '(') return mp.events.call('/me', player, 'расстроился');
            if (message == '((') return mp.events.call('/me', player, 'сильно расстроился');

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
            case '/f':
            case '/n':
            case '/b':
            case '/me':
            case '/do':
            case '/try':
            case '/gnews':
            case '/d':
                if (!/\S/.test(args.join(' '))) return;
                if (command == '/b') command = '/n';
                mp.events.call(command, player, args);
                break;
            default:
                if (!player.character.admin) return;
                mp.events.call('admin.command.handle', player, command, args);
                break;
        }
    },

    "chat.action.say": (player, message) => {
        var playerInStream = news.isInStream(player);

        mp.players.forEachInRange(player.position, 10, (currentPlayer) => {
            if (currentPlayer.dimension == player.dimension) {
                // Тот, кто участвует в эфире Weazel News, не слышит себя в чате
                if (playerInStream && currentPlayer.id == player.id) return;

                currentPlayer.call('chat.action.say', [player.name, player.id, message]);

                if (currentPlayer.spy) { // если на игроке установлена прослушка
                    var fibAgent = mp.players.at(currentPlayer.spy.playerId);
                    if (!fibAgent) return delete currentPlayer.spy;
                    if (!fibAgent.character) return delete currentPlayer.spy;
                    if (fibAgent.character.id != currentPlayer.spy.characterId) return delete currentPlayer.spy;

                    var dist = parseInt(fibAgent.dist(currentPlayer.position));
                    if (dist > 100) {
                        fibAgent.call('chat.action.say', [player.name, player.id, `* сигнал потерян *`]);
                        return delete currentPlayer.spy;
                    }
                    var text = (dist > 50) ? `* пшшшшшшш пшшшш пшшшш *` : `${message} (${dist} м.)`;
                    fibAgent.call('chat.action.say', [player.name, player.id, text]);
                }
            };
        });
    },

    "/s": (player, message) => {
        var playerInStream = news.isInStream(player);

        mp.players.forEachInRange(player.position, 20, (currentPlayer) => {
            if (currentPlayer.dimension == player.dimension) {
                // Тот, кто участвует в эфире Weazel News, не слышит себя в чате
                if (playerInStream && currentPlayer.id == player.id) return;

                currentPlayer.call('chat.action.shout', [player.name, player.id, message]);

                if (currentPlayer.spy) { // если на игроке установлена прослушка
                    var fibAgent = mp.players.at(currentPlayer.spy.playerId);
                    if (!fibAgent) return delete currentPlayer.spy;
                    if (!fibAgent.character) return delete currentPlayer.spy;
                    if (fibAgent.character.id != currentPlayer.spy.characterId) return delete currentPlayer.spy;

                    var dist = parseInt(player.dist(currentPlayer.position));
                    if (dist > 100) {
                        fibAgent.call('chat.action.shout', [player.name, player.id, `* сигнал потерян *`]);
                        return delete currentPlayer.spy;
                    }
                    var text = (dist > 50) ? `* пшшшшшшш пшшшш пшшшш *` : `${message} (${dist} м.)`;
                    fibAgent.call('chat.action.shout', [player.name, player.id, text]);
                }
            };
        });
    },

    "/r": (player, message) => {
        factions.sayRadio(player, message.join(' '));
    },

    "/f": (player, message) => {
        if (factions.isStateFaction(player.character.factionId) || !factions.isLeader(player)) {
            mp.events.call('/d', player, message);
        } else {
            factions.sayRadio(player, message.join(' '));
        }
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

    "/gnews": (player, message) => {
        if (!player.character) return;
        if (!factions.isStateFaction(player.character.factionId) || !factions.isLeader(player)) return;

        mp.players.forEach((currentPlayer) => {
            if (!currentPlayer.character) return;
            currentPlayer.call('chat.message.split', [message.join(' '), `!{#498fff}[Гос. новости] ${player.character.name}[${player.id}]: `]);
        });
    },

    "/d": (player, message) => {
        if (!player.character) return;
        if (!factions.isStateFaction(player.character.factionId)) return;

        let rank = factions.getRankById(player.character.factionId, player.character.factionRank).name;
        mp.players.forEach((currentPlayer) => {
            if (!currentPlayer.character) return;
            if (!factions.isStateFaction(currentPlayer.character.factionId)) return;
            currentPlayer.call('chat.message.split', [message.join(' '), `!{#59b3cf}[D] ${rank} ${player.character.name}[${player.id}]: `]);
        });
    },

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
