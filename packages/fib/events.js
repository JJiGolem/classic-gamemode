"use strict";
var fib = require('../fib')
var factions = require('../factions');
var inventory = require('../inventory');
var notifs = require('../notifications');

module.exports = {
    "init": () => {

    },
    "characterInit.done": (player) => {

    },
    "fib.storage.clothes.take": (player, index) => {
        if (!player.insideFactionWarehouse) return notifs.error(player, `Вы далеко`, `Склад FIB`);
        if (!factions.isFibFaction(player.character.factionId)) return notifs.error(player, `Вы не агент`, `Склад FIB`);

        var character = player.character;
        var faction = factions.getFaction(character.factionId);
        var header = `Склад ${faction.name}`;

        if (faction.ammo < fib.clothesAmmo) return notifs.error(player, `Недостаточно боеприпасов`, header);

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
            if (factions.isFibFaction(params.faction)) return notifs.error(player, `Вы уже имеете головной убор`, header);
        }
        for (var key in tops) {
            var params = inventory.getParamsValues(tops[key]);
            if (factions.isFibFaction(params.faction)) return notifs.error(player, `Вы уже имеете рубашку`, header);
        }
        for (var key in legs) {
            var params = inventory.getParamsValues(legs[key]);
            if (factions.isFibFaction(params.faction)) return notifs.error(player, `Вы уже имеете брюки`, header);
        }
        for (var key in feets) {
            var params = inventory.getParamsValues(feets[key]);
            if (factions.isFibFaction(params.faction)) return notifs.error(player, `Вы уже имеете ботинки`, header);
        }
        for (var key in ears) {
            var params = inventory.getParamsValues(ears[key]);
            if (factions.isFibFaction(params.faction)) return notifs.error(player, `Вы уже имеете наушники`, header);
        }
        for (var key in ties) {
            var params = inventory.getParamsValues(ties[key]);
            if (factions.isFibFaction(params.faction)) return notifs.error(player, `Вы уже имеете аксессуар`, header);
        }
        for (var key in masks) {
            var params = inventory.getParamsValues(masks[key]);
            if (factions.isFibFaction(params.faction)) return notifs.error(player, `Вы уже имеете шлем`, header);
        }
        for (var key in glasses) {
            var params = inventory.getParamsValues(glasses[key]);
            if (factions.isFibFaction(params.faction)) return notifs.error(player, `Вы уже имеете очки`, header);
        }


        inventory.fullDeleteItemsByParams(6, ["faction", "owner"], [character.factionId, character.id]);
        inventory.fullDeleteItemsByParams(7, ["faction", "owner"], [character.factionId, character.id]);
        inventory.fullDeleteItemsByParams(8, ["faction", "owner"], [character.factionId, character.id]);
        inventory.fullDeleteItemsByParams(9, ["faction", "owner"], [character.factionId, character.id]);
        inventory.fullDeleteItemsByParams(10, ["faction", "owner"], [character.factionId, character.id]);
        inventory.fullDeleteItemsByParams(2, ["faction", "owner"], [character.factionId, character.id]);
        inventory.fullDeleteItemsByParams(14, ["faction", "owner"], [character.factionId, character.id]);
        inventory.fullDeleteItemsByParams(1, ["faction", "owner"], [character.factionId, character.id]);

        var hatParams, topParams, legsParams, feetsParams, earsParams, tiesParams, masksParams, glassesParams;
        var f = character.factionId - 2;
        if (character.gender == 0) { // муж.
            hatParams = {
                sex: 1,
                variation: [-1, -1, 124, 117, -1][index],
                texture: [0, 0, 0, 0, 0][index]
            };
            topParams = {
                sex: 1,
                torso: [4, 12, 8, 8, 17][index],
                variation: [3, 10, 89, 50, 221][index],
                texture: [4, 0, 0, 0, 20][index],
                undershirt: [27, 36, -1, -1, -1][index],
            };
            legsParams = {
                sex: 1,
                variation: [25, 13, 31, 31, 31][index],
                texture: [0, 0, 0, 0, 0][index]
            };
            feetsParams = {
                sex: 1,
                variation: [10, 21, 24, 24, 24][index],
                texture: [0, 0, 0, 0, 0][index]
            };
            earsParams = {
                sex: 1,
                variation: [-1, -1, -1, -1, -1][index],
                texture: [0, 0, 0, 0, 0][index]
            };
            tiesParams = {
                sex: 1,
                variation: [125, 125, -1, -1, -1][index],
                texture: [0, 0, 0, 0, 0][index]
            };
            masksParams = {
                sex: 1,
                variation: [121, 121, 55, 52, 53][index],
                texture: [0, 0, 0, 5, 0][index]
            };
            glassesParams = {
                sex: 1,
                variation: [8, 8, -1, -1, -1][index],
                texture: [6, 6, 0, 0, 0][index]
            };
        } else {
            hatParams = {
                sex: 0,
                variation: [-1, -1, 19, 118, -1][index],
                texture: [0, 0, 0, 0, 0][index]
            };
            topParams = {
                sex: 0,
                torso: [9, 9, 18, 18, 18][index],
                variation: [9, 79, 43, 136, 231][index],
                texture: [0, 0, 0, 3, 20][index]
            };
            legsParams = {
                sex: 0,
                variation: [47, 50, 30, 30, 30][index],
                texture: [0, 1, 0, 0, 0][index]
            };
            feetsParams = {
                sex: 0,
                variation: [13, 13, 25, 25, 25][index],
                texture: [0, 0, 0, 0, 0][index]
            };
            earsParams = {
                sex: 0,
                variation: [-1, -1, -1, -1, -1][index],
                texture: [0, 0, 0, 0, 0][index]
            };
            tiesParams = {
                sex: 0,
                variation: [95, 95, 0, 0, 0][index],
                texture: [0, 0, 0, 0, 0][index]
            };
            masksParams = {
                sex: 0,
                variation: [121, 121, 57, 57, 57][index],
                texture: [0, 0, 0, 0, 0][index]
            };
            glassesParams = {
                sex: 0,
                variation: [11, 11, -1, -1, -1][index],
                texture: [0, 0, 0, 0, 0][index]
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
        faction.ammo -= fib.clothesAmmo;
        faction.save();
    },
    "fib.storage.armour.take": (player) => {
        if (!player.insideFactionWarehouse) return notifs.error(player, `Вы далеко`, `Склад FIB`);
        if (!factions.isFibFaction(player.character.factionId)) return notifs.error(player, `Вы не агент`, `Склад FIB`);

        var character = player.character;
        var faction = factions.getFaction(character.factionId);
        var header = `Склад ${faction.name}`;

        if (faction.ammo < fib.armourAmmo) return notifs.error(player, `Недостаточно боеприпасов`, header);
        var armours = inventory.getArrayByItemId(player, 3);

        for (var key in armours) {
            var params = inventory.getParamsValues(armours[key]);
            if (factions.isFibFaction(params.faction)) return notifs.error(player, `Вы уже имеете бронежилет`, header);
        }

        inventory.fullDeleteItemsByParams(3, ["faction", "owner"], [character.factionId, character.id]);
        var params;
        if (player.sex == 1) {
            params = {
                variation: 16,
                texture: 2
            };
        } else {
            params = {
                variation: 18,
                texture: 2
            };
        }

        params.faction = character.factionId;
        params.owner = character.id;
        params.health = 100;
        params.pockets = '[2,3,1,3,1,3,6,3,3,2,4,2,2,2,2,2,4,2,3,2]';
        params.sex = !character.gender;

        inventory.addItem(player, 3, params, (e) => {
            if (e) return notifs.error(player, e, header);
        });
        notifs.success(player, `Выдан бронежилет`, header);
        faction.ammo -= fib.armourAmmo;
        faction.save();
    },
    "fib.storage.items.take": (player, index) => {
        if (!player.insideFactionWarehouse) return notifs.error(player, `Вы далеко`, `Склад FIB`);
        if (!factions.isFibFaction(player.character.factionId)) return notifs.error(player, `Вы не агент`, `Склад FIB`);

        var character = player.character;
        var faction = factions.getFaction(character.factionId);
        var header = `Склад ${faction.name}`;

        if (faction.ammo < fib.itemAmmo) return notifs.error(player, `Недостаточно боеприпасов`, header);

        var itemIds = [28, 24];

        index = Math.clamp(index, 0, itemIds.length - 1);
        var itemId = itemIds[index];

        var itemName = inventory.getInventoryItem(itemId).name;
        // var items = inventory.getArrayByItemId(player, itemId);
        // if (items.length > 0) return notifs.error(player, `Вы уже имеете ${itemName}`, header);

        // inventory.fullDeleteItemsByParams(itemId, ["faction", "owner"], [character.factionId, character.id]);
        var params = {
            faction: character.factionId,
            owner: character.id
        };
        if (itemId == 24) { // аптечка
            params.count = 5;
        }

        inventory.addItem(player, itemId, params, (e) => {
            if (e) return notifs.error(player, e, header);

            notifs.success(player, `Вам выданы ${itemName}`, header);
            faction.ammo -= fib.itemAmmo;
            faction.save();
        });
    },
    "fib.storage.guns.take": (player, index) => {
        if (!player.insideFactionWarehouse) return notifs.error(player, `Вы далеко`, `Склад FIB`);
        if (!factions.isFibFaction(player.character.factionId)) return notifs.error(player, `Вы не агент`, `Склад FIB`);

        var character = player.character;
        var faction = factions.getFaction(character.factionId);
        var header = `Склад ${faction.name}`;

        if (faction.ammo < fib.gunAmmo) return notifs.error(player, `Недостаточно боеприпасов`, header);

        var itemIds = [107, 99];
        var weaponIds = ["weapon_heavysniper", "weapon_carbinerifle_mk2"];
        index = Math.clamp(index, 0, itemIds.length - 1);
        var itemId = itemIds[index];

        var gunName = inventory.getInventoryItem(itemId).name;
        var guns = inventory.getArrayByItemId(player, itemId);

        if (guns.length > 0) return notifs.error(player, `Вы уже имеете ${gunName}`, header);

        inventory.fullDeleteItemsByParams(itemId, ["faction", "owner"], [character.factionId, character.id]);
        var params = {
            weaponHash: mp.joaat(weaponIds[index]),
            ammo: 0,
            faction: character.factionId,
            owner: character.id
        };

        inventory.addItem(player, itemId, params, (e) => {
            if (e) return notifs.error(player, e, header);

            notifs.success(player, `Вам выдано оружие ${gunName}`, header);
            faction.ammo -= fib.gunAmmo;
            faction.save();
        });
    },
    "fib.storage.ammo.take": (player, values) => {
        values = JSON.parse(values);
        var index = values[0];
        var ammo = values[1];
        if (!player.insideFactionWarehouse) return notifs.error(player, `Вы далеко`, `Склад FIB`);
        if (!factions.isFibFaction(player.character.factionId)) return notifs.error(player, `Вы не агент`, `Склад FIB`);

        var character = player.character;
        var faction = factions.getFaction(character.factionId);
        var header = `Склад ${faction.name}`;

        var itemIds = [37, 38, 40, 39];
        index = Math.clamp(index, 0, itemIds.length - 1);
        if (faction.ammo < fib.ammoAmmo * ammo) return notifs.error(player, `Недостаточно боеприпасов`, header);

        // inventory.fullDeleteItemsByParams(itemIds[index], ["faction", "owner"], [character.factionId, character.id]);
        var params = {
            count: ammo,
            faction: character.factionId,
            owner: character.id
        };
        inventory.addItem(player, itemIds[index], params, (e) => {
            if (e) return notifs.error(player, e, header);

            notifs.success(player, `Вам выданы ${inventory.getInventoryItem(itemIds[index]).name} (${ammo} ед.)`, header);
            faction.ammo -= fib.ammoAmmo * ammo;
            faction.save();
        });
    }
}
