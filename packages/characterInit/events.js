"use strict";
/// Модуль выбора и создания персоонажа
let characterInit = require("./index.js");
let logger = call("logger");
let utils = call("utils");

module.exports = {
    "init": () => {
        characterInit.moduleInit();
        inited(__dirname);
    },
    "auth.done": (player) => {
        player.characterInit = {
            created: false,
        }
        mp.events.call('characterInit.start', player);
    },
    "characterInit.start": async (player) => {
        let charInfos = await characterInit.init(player);
        player.call('characterInit.init', [charInfos, player.account.slots]);
    },
    "characterInit.choose": (player, charnumber) => {
        if (charnumber == null || isNaN(charnumber)) return player.call('characterInit.choose.ans', [0]);
        if (charnumber < 0 || charnumber > 2) return player.call('characterInit.choose.ans', [0]);

        if (player.characters[charnumber]) {
            player.character = player.characters[charnumber];
            delete player.characters;
            characterInit.applyCharacter(player);

            player.call('characterInit.choose.ans', [1]);
            mp.events.call('characterInit.done', player);
        } else {
            player.call('characterInit.choose.ans', [1]);
            characterInit.create(player);
        }
    },
    /// Разморозка игрока после выбора персоонажа
    "characterInit.done": (player) => {
        player.call('characterInit.done');
        characterInit.spawn(player);
        player.authTime = Date.now();
        logger.log(`Авторизовал персонажа (IP: ${player.ip})`, "characterInit", player);
    },
    /// События создания персоонажа
    "player.joined": player => {
        player.usingCreator = false;
    },
    "characterInit.create.check": (player, fullname, charData) => {
        characterInit.save(player, fullname, charData);
    },
    "characterInit.create.exit": player => {
        if (player.usingCreator) {
            player.usingCreator = false;
        }
    },
    "characterInit.loadCharacter": (player) => {
        characterInit.applyCharacter(player);
    },
    "inventory.done": (player) => {
        player.characterInit.created && characterInit.setStartClothes(player);
    },
    "playerQuit": (player) => {
        if (!player.character) return;

        var minutes = parseInt((Date.now() - player.authTime) / 1000 / 60 % 60);
        player.character.minutes += minutes;
        if (!player.dimension) {
            player.character.x = player.position.x;
            player.character.y = player.position.y;
            player.character.z = player.position.z;
            player.character.h = player.heading;
        }
        player.character.save();

        player.account.lastIp = player.ip;
        player.account.lastDate = new Date();
        player.account.save();
        logger.log(`Деавторизовал персонажа`, "characterInit", player);
    },
}
