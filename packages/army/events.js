"use strict";
var army = require('../army');
var factions = require('../factions');
var inventory = require('../inventory');
var money = require('../money');
var notifs = require('../notifications');

module.exports = {
    "init": () => {},
    "characterInit.done": (player) => {},
    "army.storage.clothes.take": (player, index) => {
        if (!player.insideFactionWarehouse) return notifs.error(player, `Вы далеко`, `Склад Army`);
        if (!factions.isArmyFaction(player.character.factionId)) return notifs.error(player, `Вы не служите`, `Склад Army`);

        var character = player.character;
        var faction = factions.getFaction(character.factionId);
        var header = `Склад ${faction.name}`;

        if (faction.ammo < army.clothesAmmo) return notifs.error(player, `Недостаточно боеприпасов`, header);

        var hats = inventory.getArrayByItemId(player, 6);
        var tops = inventory.getArrayByItemId(player, 7);
        var legs = inventory.getArrayByItemId(player, 8);
        var feets = inventory.getArrayByItemId(player, 9);
        var masks = inventory.getArrayByItemId(player, 14);
        var glasses = inventory.getArrayByItemId(player, 1);

        for (var key in hats) {
            var params = inventory.getParamsValues(hats[key]);
            if (factions.isArmyFaction(params.faction)) return notifs.error(player, `Вы уже имеете головной убор`, header);
        }
        for (var key in tops) {
            var params = inventory.getParamsValues(tops[key]);
            if (factions.isArmyFaction(params.faction)) return notifs.error(player, `Вы уже имеете рубашку`, header);
        }
        for (var key in legs) {
            var params = inventory.getParamsValues(legs[key]);
            if (factions.isArmyFaction(params.faction)) return notifs.error(player, `Вы уже имеете брюки`, header);
        }
        for (var key in feets) {
            var params = inventory.getParamsValues(feets[key]);
            if (factions.isArmyFaction(params.faction)) return notifs.error(player, `Вы уже имеете ботинки`, header);
        }
        for (var key in masks) {
            var params = inventory.getParamsValues(masks[key]);
            if (factions.isArmyFaction(params.faction)) return notifs.error(player, `Вы уже имеете шлем`, header);
        }
        for (var key in glasses) {
            var params = inventory.getParamsValues(glasses[key]);
            if (factions.isArmyFaction(params.faction)) return notifs.error(player, `Вы уже имеете очки`, header);
        }


        inventory.fullDeleteItemsByParams(6, ["faction", "owner"], [character.factionId, character.id]);
        inventory.fullDeleteItemsByParams(7, ["faction", "owner"], [character.factionId, character.id]);
        inventory.fullDeleteItemsByParams(8, ["faction", "owner"], [character.factionId, character.id]);
        inventory.fullDeleteItemsByParams(9, ["faction", "owner"], [character.factionId, character.id]);
        inventory.fullDeleteItemsByParams(10, ["faction", "owner"], [character.factionId, character.id]);
        inventory.fullDeleteItemsByParams(14, ["faction", "owner"], [character.factionId, character.id]);
        inventory.fullDeleteItemsByParams(1, ["faction", "owner"], [character.factionId, character.id]);

        var hatParams, topParams, legsParams, feetsParams, masksParams, glassesParams;
        var f = 0;
        if (character.gender == 0) { // муж.
            hatParams = {
                sex: 1,
                variation: [
                    [-1, 117, 107, 107, 39, -1, -1, -1],
                    [124, 114, 114, 113, -1]
                ][f][index],
                texture: [
                    [0, 13, 3, 0, 0, 0, 0, 0],
                    [10, 4, 9, 4, -1]
                ][f][index]
            };
            topParams = {
                sex: 1,
                torso: [
                    [0, 136, 5, 5, 5, 4, 20, 42],
                    [60, 1, 94, 1, 36]
                ][f][index],
                tTexture: [
                    [-1, 5, -1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1, -1, -1],
                ][f][index],
                variation: [
                    [208, 50, 239, 239, 251, 248, 209, 209],
                    [220, 192, 192, 221, 228]
                ][f][index],
                texture: [
                    [4, 0, 3, 0, 1, 0, 11, 10],
                    [11, 0, 0, 10, 0]
                ][f][index],
                undershirt: [
                    [-1, -1, -1, -1, -1, -1, -1, -1],
                    [-1, 101, 101, 130, -1]
                ][f][index],
                uTexture: [
                    [-1, -1, -1, -1, -1, -1, -1, -1],
                    [0, 10, 10, 0, 0]
                ][f][index],
            };
            legsParams = {
                sex: 1,
                variation: [
                    [86, 86, 86, 86, 98, 98, 86, 86],
                    [86, 86, 86, 86, 92]
                ][f][index],
                texture: [
                    [4, 5, 3, 0, 1, 1, 11, 10],
                    [16, 10, 10, 10, 0]
                ][f][index]
            };
            feetsParams = {
                sex: 1,
                variation: [
                    [35, 72, 24, 24, 24, 60, 60, 60],
                    [50, 27, 27, 27, 51]
                ][f][index],
                texture: [
                    [0, 5, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0]
                ][f][index]
            };
            masksParams = {
                sex: 1,
                variation: [
                    [-1, 114, -1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1]
                ][f][index],
                texture: [
                    [-1, 9, -1, -1, -1, -1, -1, -1],
                    [0, 0, 0, 0, 0]
                ][f][index]
            };
            glassesParams = {
                sex: 1,
                variation: [
                    [-1, -1, -1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1]
                ][f][index],
                texture: [
                    [0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0]
                ][f][index]
            };
        } else {
            hatParams = {
                sex: 0,
                variation: [
                    [-1, -1, 106, 106, 38, -1, -1, -1],
                    [123, 113, 113, 113, -1]
                ][f][index],
                texture: [
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [12, 0, 7, 6, 0]
                ][f][index]
            };
            topParams = {
                sex: 0,
                torso: [
                    [14, 3, 14, 14, 14, 20, 20, 42],
                    [60, 67, 57, 31, 67]
                ][f][index],
                variation: [
                    [212, 54, 212, 212, 213, 212, 213, 213],
                    [230, 194, 194, 224, 232]
                ][f][index],
                texture: [
                    [4, 0, 0, 0, 3, 0, 11, 10],
                    [17, 0, 10, 10, 10]
                ][f][index],
                undershirt: [
                    [-1, -1, -1, -1, -1, -1, -1, -1],
                    [-1, 127, 136, -1, -1]
                ][f][index],
                uTexture: [
                    [-1, -1, -1, -1, -1, -1, -1, -1],
                    [0, 10, 10, 0, 0]
                ][f][index],
            };
            legsParams = {
                sex: 0,
                variation: [
                    [90, 89, 89, 89, 89, 92, 89, 89],
                    [89, 89, 89, 89, 86]
                ][f][index],
                texture: [
                    [4, 5, 3, 0, 3, 0, 11, 10],
                    [15, 10, 10, 10, 8]
                ][f][index]
            };
            feetsParams = {
                sex: 0,
                variation: [
                    [36, 62, 55, 55, 55, 55, 55, 55],
                    [25, 77, 26, 25, 70]
                ][f][index],
                texture: [
                    [0, 1, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0]
                ][f][index]
            };
            masksParams = {
                sex: 0,
                variation: [
                    [-1, 114, -1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1]
                ][f][index],
                texture: [
                    [0, 9, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0]
                ][f][index]
            };
            glassesParams = {
                sex: 0,
                variation: [
                    [-1, -1, -1, -1, 27, -1, -1, -1],
                    [-1, -1, -1, -1, -1]
                ][f][index],
                texture: [
                    [0, 0, 0, 0, 4, 0, 0, 0],
                    [0, 0, 0, 0, 0]
                ][f][index]
            };
        }
        if (topParams.undershirt == -1) delete topParams.undershirt;
        if (topParams.uTexture == -1) delete topParams.uTexture;
        if (topParams.tTexture == -1) delete topParams.tTexture;

        hatParams.faction = faction.id;
        topParams.faction = faction.id;
        legsParams.faction = faction.id;
        feetsParams.faction = faction.id;
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
        masksParams.owner = character.id;
        glassesParams.owner = character.id;

        var response = (e) => {
            if (e) notifs.error(player, e, header);
        };

        if (hatParams.variation != -1) inventory.addItem(player, 6, hatParams, response);
        if (topParams.variation != -1) inventory.addItem(player, 7, topParams, response);
        if (legsParams.variation != -1) inventory.addItem(player, 8, legsParams, response);
        if (feetsParams.variation != -1) inventory.addItem(player, 9, feetsParams, response);
        if (masksParams.variation != -1) inventory.addItem(player, 14, masksParams, response);
        if (glassesParams.variation != -1) inventory.addItem(player, 1, glassesParams, response);

        notifs.success(player, `Форма выдана`, header);
        faction.ammo -= army.clothesAmmo;
        faction.save();
    },
    "army.storage.armour.take": (player) => {
        if (!player.insideFactionWarehouse) return notifs.error(player, `Вы далеко`, `Склад Army`);
        if (!factions.isArmyFaction(player.character.factionId)) return notifs.error(player, `Вы не служите`, `Склад Army`);

        var character = player.character;
        var faction = factions.getFaction(character.factionId);
        var header = `Склад ${faction.name}`;

        if (faction.ammo < army.armourAmmo) return notifs.error(player, `Недостаточно боеприпасов`, header);
        var armours = inventory.getArrayByItemId(player, 3);

        for (var key in armours) {
            var params = inventory.getParamsValues(armours[key]);
            if (factions.isArmyFaction(params.faction)) return notifs.error(player, `Вы уже имеете бронежилет`, header);
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
        faction.ammo -= army.armourAmmo;
        faction.save();
    },
    "army.storage.items.take": (player, index) => {
        if (!player.insideFactionWarehouse) return notifs.error(player, `Вы далеко`, `Склад Army`);
        if (!factions.isArmyFaction(player.character.factionId)) return notifs.error(player, `Вы не служите`, `Склад Army`);

        var character = player.character;
        var faction = factions.getFaction(character.factionId);
        var header = `Склад ${faction.name}`;

        if (faction.ammo < army.itemAmmo) return notifs.error(player, `Недостаточно боеприпасов`, header);

        var itemIds = [24];

        index = Math.clamp(index, 0, itemIds.length - 1);
        var itemId = itemIds[index];

        var itemName = inventory.getInventoryItem(itemId).name;
        // var items = inventory.getArrayByItemId(player, itemId);
        // if (items.length > 0) return notifs.error(player, `Вы уже имеете ${itemName}`, header);

        // inventory.fullDeleteItemsByParams(itemId, ["faction", "owner"], [character.factionId, character.id]);
        var params = {
            faction: character.factionId,
            owner: character.id,
            count: 5,
        };

        inventory.addItem(player, itemId, params, (e) => {
            if (e) return notifs.error(player, e, header);

            notifs.success(player, `Вам выданы ${itemName}`, header);
            faction.ammo -= army.itemAmmo;
            faction.save();
        });
    },
    "army.storage.guns.take": (player, index) => {
        if (!player.insideFactionWarehouse) return notifs.error(player, `Вы далеко`, `Склад Army`);
        if (!factions.isArmyFaction(player.character.factionId)) return notifs.error(player, `Вы не служите`, `Склад Army`);

        var character = player.character;
        var faction = factions.getFaction(character.factionId);
        var header = `Склад ${faction.name}`;

        if (faction.ammo < army.gunAmmo) return notifs.error(player, `Недостаточно боеприпасов`, header);

        var itemIds = [17, 80, 48, 21, 22];
        var weaponIds = ["weapon_nightstick", "weapon_heavypistol",
            "weapon_smg", "weapon_pumpshotgun",
            "weapon_carbinerifle"
        ];
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
            faction.ammo -= army.gunAmmo;
            faction.save();
        });
    },
    "army.storage.ammo.take": (player, values) => {
        values = JSON.parse(values);
        var index = values[0];
        var ammo = values[1];
        if (!player.insideFactionWarehouse) return notifs.error(player, `Вы далеко`, `Склад Army`);
        if (!factions.isArmyFaction(player.character.factionId)) return notifs.error(player, `Вы не служите`, `Склад Army`);

        var character = player.character;
        var faction = factions.getFaction(character.factionId);
        var header = `Склад ${faction.name}`;

        var itemIds = [37, 38, 40, 39];
        index = Math.clamp(index, 0, itemIds.length - 1);
        if (faction.ammo < army.ammoAmmo * ammo) return notifs.error(player, `Недостаточно боеприпасов`, header);

        // inventory.fullDeleteItemsByParams(itemIds[index], ["faction", "owner"], [character.factionId, character.id]);
        var params = {
            count: ammo,
            faction: character.factionId,
            owner: character.id
        };
        inventory.addItem(player, itemIds[index], params, (e) => {
            if (e) return notifs.error(player, e, header);

            notifs.success(player, `Вам выданы ${inventory.getInventoryItem(itemIds[index]).name} (${ammo} ед.)`, header);
            faction.ammo -= army.ammoAmmo * ammo;
            faction.save();
        });
    },
}
