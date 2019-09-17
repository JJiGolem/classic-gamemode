"use strict";
var government = require('../government');
var factions = require('../factions');
var inventory = require('../inventory');
var notifs = require('../notifications');

module.exports = {
    "init": () => {

    },
    "characterInit.done": (player) => {

    },
    "government.storage.clothes.take": (player, index) => {
        if (!player.insideFactionWarehouse) return notifs.error(player, `Вы далеко`, `Склад Government`);
        if (!factions.isGovernmentFaction(player.character.factionId)) return notifs.error(player, `Вы не из правительства`, `Склад Government`);

        var character = player.character;
        var faction = factions.getFaction(character.factionId);
        var header = `Склад ${faction.name}`;

        if (faction.ammo < government.clothesAmmo) return notifs.error(player, `Недостаточно боеприпасов`, header);

        var hats = inventory.getArrayByItemId(player, 6);
        var tops = inventory.getArrayByItemId(player, 7);
        var legs = inventory.getArrayByItemId(player, 8);
        var feets = inventory.getArrayByItemId(player, 9);
        var ears = inventory.getArrayByItemId(player, 10);
        var ties = inventory.getArrayByItemId(player, 2);
        var masks = inventory.getArrayByItemId(player, 14);
        var glasses = inventory.getArrayByItemId(player, 1);

        for (var key in hats) {
            var params = inventory.getParamsValues(hats[key]);
            if (factions.isGovernmentFaction(params.faction)) return notifs.error(player, `Вы уже имеете головной убор`, header);
        }
        for (var key in tops) {
            var params = inventory.getParamsValues(tops[key]);
            if (factions.isGovernmentFaction(params.faction)) return notifs.error(player, `Вы уже имеете рубашку`, header);
        }
        for (var key in legs) {
            var params = inventory.getParamsValues(legs[key]);
            if (factions.isGovernmentFaction(params.faction)) return notifs.error(player, `Вы уже имеете брюки`, header);
        }
        for (var key in feets) {
            var params = inventory.getParamsValues(feets[key]);
            if (factions.isGovernmentFaction(params.faction)) return notifs.error(player, `Вы уже имеете ботинки`, header);
        }
        for (var key in ears) {
            var params = inventory.getParamsValues(ears[key]);
            if (factions.isGovernmentFaction(params.faction)) return notifs.error(player, `Вы уже имеете наушники`, header);
        }
        for (var key in ties) {
            var params = inventory.getParamsValues(ties[key]);
            if (factions.isGovernmentFaction(params.faction)) return notifs.error(player, `Вы уже имеете аксессуар`, header);
        }
        for (var key in masks) {
            var params = inventory.getParamsValues(masks[key]);
            if (factions.isGovernmentFaction(params.faction)) return notifs.error(player, `Вы уже имеете шлем`, header);
        }
        for (var key in glasses) {
            var params = inventory.getParamsValues(glasses[key]);
            if (factions.isGovernmentFaction(params.faction)) return notifs.error(player, `Вы уже имеете очки`, header);
        }


        inventory.fullDeleteItemsByParams([6, 7, 8, 9, 10, 2, 14, 1], ["faction", "owner"], [character.factionId, character.id]);

        var hatParams, topParams, legsParams, feetsParams, earsParams, tiesParams, masksParams, glassesParams;
        if (character.gender == 0) { // муж.
            hatParams = { // prop 0
                sex: 1,
                variation: [-1, -1, -1, -1, -1][index],
                texture: [-1, -1, -1, -1, -1][index]
            };
            topParams = { // clothes 11 / 3 / 8
                sex: 1,
                torso: // /clothes 3
                    [11, 11, 12, 11, 11][index],
                tTexture: [-1, -1, -1, -1, -1][index],
                variation: // clothes 11
                    [26, 21, 4, 25, 120][index],
                texture: [0, 0, 3, 0, 0][index],
                undershirt: // clothes 8
                    [130, 144, 25, 144, 144][index]
            };
            legsParams = { // clothes 4
                sex: 1,
                variation: [25, 25, 25, 28, 28][index],
                texture: [0, 0, 1, 8, 13][index]
            };
            feetsParams = { // clothes 6
                sex: 1,
                variation: [20, 20, 20, 21, 21][index],
                texture: [0, 2, 0, 9, 9][index]
            };
            earsParams = { // prop 2
                sex: 1,
                variation: [0, 0, -1, -1, -1][index],
                texture: [0, 0, -1, -1, -1][index]
            };
            tiesParams = { // clothes 7
                sex: 1,
                variation: [-1, -1, -1, -1, -1][index],
                texture: [-1, -1, -1, -1, -1][index]
            };
            masksParams = { // clothes 1
                sex: 1,
                variation: [-1, -1, -1, -1, -1][index],
                texture: [-1, -1, -1, -1, -1][index]
            };
            glassesParams = { // prop 1
                sex: 1,
                variation: [8, -1, 4, -1, 4][index],
                texture: [0, -1, 2, -1, 0][index]
            };
        } else {
            hatParams = { // prop 0
                sex: 0,
                variation: [-1, -1, -1, 123, -1, -1][index],
                texture: [-1, -1, -1, 0, -1, -1][index]
            };
            topParams = { // clothes 11 / 3 / 8
                sex: 0,
                torso: // /clothes 3
                    [0, 7, 1, 0, 1, 7][index],
                tTexture: [-1, -1, -1, -1, -1, -1][index],
                variation: // clothes 11
                    [27, 90, 103, 46, 139, 90][index],
                texture: [5, 1, 3, 1, 2, 0][index],
                undershirt: // clothes 8
                    [160, 39, 159, 159, 39, 64][index]
            };
            legsParams = { // clothes 4
                sex: 0,
                variation: [37, 51, 54, 30, 51, 51][index],
                texture: [2, 1, 2, 2, 0, 0][index]
            };
            feetsParams = { // clothes 6
                sex: 0,
                variation: [29, 29, 29, 25, 29, 29][index],
                texture: [0, 1, 0, 0, 1, 2][index]
            };
            earsParams = { // prop 2
                sex: 0,
                variation: [-1, -1, -1, -1, -1, -1][index],
                texture: [-1, -1, -1, -1, -1, -1][index]
            };
            tiesParams = { // clothes 7
                sex: 0,
                variation: [98, 95, -1, -1, 95, -1, 95][index],
                texture: [0, 0, -1, -1, 0, -1, 0][index]
            };
            masksParams = { // clothes 1
                sex: 0,
                variation: [-1, -1, -1, 52, -1, -1][index],
                texture: [-1, -1, -1, 1, -1, -1][index]
            };
            glassesParams = { // prop 1
                sex: 0,
                variation: [-1, -1, -1, -1, -1, -1][index],
                texture: [-1, -1, -1, -1, -1, -1][index]
            };
        }
        if (topParams.undershirt == -1) delete topParams.undershirt;
        if (topParams.uTexture == -1) delete topParams.uTexture;
        if (topParams.tTexture == -1) delete topParams.tTexture;

        hatParams.faction = faction.id;
        topParams.faction = faction.id;
        legsParams.faction = faction.id;
        feetsParams.faction = faction.id;
        earsParams.faction = faction.id;
        tiesParams.faction = faction.id;
        masksParams.faction = faction.id;
        glassesParams.faction = faction.id;

        topParams.pockets = '[5,5,5,5,5,5,10,10]';
        legsParams.pockets = '[5,5,5,5,5,5,10,10]';
        topParams.name = `Рубашка ${faction.name}`;
        legsParams.name = `Брюки ${faction.name}`;

        hatParams.owner = character.id;
        topParams.owner = character.id;
        legsParams.owner = character.id;
        feetsParams.owner = character.id;
        earsParams.owner = character.id;
        tiesParams.owner = character.id;
        masksParams.owner = character.id;
        glassesParams.owner = character.id;

        var response = (e) => {
            if (e) notifs.error(player, e, header);
        };

        if (hatParams.variation != -1) inventory.addItem(player, 6, hatParams, response);
        if (topParams.variation != -1) inventory.addItem(player, 7, topParams, response);
        if (legsParams.variation != -1) inventory.addItem(player, 8, legsParams, response);
        if (feetsParams.variation != -1) inventory.addItem(player, 9, feetsParams, response);
        if (earsParams.variation != -1) inventory.addItem(player, 10, earsParams, response);
        if (tiesParams.variation != -1) inventory.addItem(player, 2, tiesParams, response);
        if (masksParams.variation != -1) inventory.addItem(player, 14, masksParams, response);
        if (glassesParams.variation != -1) inventory.addItem(player, 1, glassesParams, response);

        notifs.success(player, `Форма выдана`, header);
        factions.setAmmo(faction, faction.ammo - government.clothesAmmo);
    },
}
