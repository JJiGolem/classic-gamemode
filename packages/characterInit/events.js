"use strict";
/// Модуль выбора и создания персоонажа
let characterInit = require("./index.js");
let utils = call("utils");

module.exports = {
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
        player.spawn(new mp.Vector3(player.character.x, player.character.y, player.character.z));
        player.dimension = 0;
        player.authTime = Date.now();
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
        player.character.save();
    },
}
