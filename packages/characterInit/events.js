"use strict";
/// Модуль выбора и создания персоонажа
let characterInit = require("./index.js");
let utils = call("utils");

module.exports = {
    "auth.done": (player) => {
        mp.events.call('characterInit.start', player);
    },
    "characterInit.start": async (player) => {
        let charInfos = await characterInit.init(player);
        player.call('characterInit.init', [charInfos]);
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
        }
        else {
            player.call('characterInit.choose.ans', [1]);
            characterInit.create(player);
        }
    },
    /// Разморозка игрока после выбора персоонажа
    "characterInit.done": (player) => {
        player.call('characterInit.done');
        player.spawn(new mp.Vector3(player.character.x, player.character.y, player.character.z));
        player.dimension = 0;
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

    // temp
    "playerDeath": (player) => {
        player.health = 100;
        // player.spawn(new mp.Vector3(-252.91534423828125, -338.6800231933594, 29.70627212524414));
        // player.spawn(new mp.Vector3(2019.1632080078125, 4984.546875, 41.21428680419922)); // farm
        player.spawn(new mp.Vector3(919.3203125, -1569.991455078125, 30.715885162353516)); // грузчики
        player.heading = 7;
    },
}
