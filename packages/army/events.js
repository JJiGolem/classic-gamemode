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
        var ties = inventory.getArrayByItemId(player, 2);
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
        for (var key in ties) {
            var params = inventory.getParamsValues(ties[key]);
            if (factions.isArmyFaction(params.faction)) return notifs.error(player, `Вы уже имеете аксессуар`, header);
        }
        for (var key in masks) {
            var params = inventory.getParamsValues(masks[key]);
            if (factions.isArmyFaction(params.faction)) return notifs.error(player, `Вы уже имеете шлем`, header);
        }
        for (var key in glasses) {
            var params = inventory.getParamsValues(glasses[key]);
            if (factions.isArmyFaction(params.faction)) return notifs.error(player, `Вы уже имеете очки`, header);
        }


        inventory.fullDeleteItemsByParams([6, 7, 8, 9, 10, 2, 14, 1], ["faction", "owner"], [character.factionId, character.id]);

        var hatParams, topParams, legsParams, feetsParams, tiesParams, masksParams, glassesParams;
        if (character.gender == 0) { // муж.
            hatParams = { // prop 0
                sex: 1,
                variation: [-1, -1, 103, 107, 107, 106, 106, 106, 113, 38, 117][index],
                texture: [-1, -1, 1, 1, 1, 1, 19, 9, 16, 0, 17][index]
            };
            topParams = { // clothes 11 / 3 / 8
                sex: 1,
                torso: // /clothes 3
                    [0, 4, 4, 0, 0, 0, 1, 0, 4, 16, 17][index],
                tTexture: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 3][index],
                variation: // clothes 11
                    [208, 220, 220, 222, 221, 222, 24, 221, 24, 48, 220][index],
                texture: [3, 3, 1, 1, 1, 1, 1, 9, 1, 0, 9][index],
                undershirt: // clothes 8
                    [-1, -1, -1, -1, -1, -1, 121, -1, 10, 15, -1][index],
                uTexture: [-1, -1, -1, -1, -1, -1, 19, -1, 8, -1, -1][index],
            };
            legsParams = { // clothes 4
                sex: 1,
                variation: [87, 87, 87, 87, 87, 87, 28, 87, 28, 30, 87][index],
                texture: [3, 3, 1, 1, 1, 1, 4, 9, 4, 0, 9][index]
            };
            feetsParams = { // clothes 6
                sex: 1,
                variation: [25, 25, 25, 35, 35, 35, 21, 35, 21, 63, 35][index],
                texture: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0][index]
            };
            tiesParams = { // clothes 7
                sex: 1,
                variation: [-1, -1, -1, -1, -1, -1, -1, -1, -1, 33, -1][index],
                texture: [-1, -1, -1, -1, -1, -1, -1, -1, -1, 0, -1][index]
            };
            masksParams = { // clothes 1
                sex: 1,
                variation: [-1, -1, -1, -1, -1, -1, -1, -1, -1, 122, 104][index],
                texture: [-1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 9][index]
            };
            glassesParams = { // prop 1
                sex: 1,
                variation: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 25][index],
                texture: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 4][index]
            };
        } else {
            hatParams = { // prop 0
                sex: 0,
                variation: [-1, -1, 102, -1, 106, 105, 105, 105, 112, 37, 116][index],
                texture: [-1, -1, 3, -1, 1, 1, 24, 9, 8, 0, 17][index]
            };
            topParams = { // clothes 11 / 3 / 8
                sex: 0,
                torso: // /clothes 3
                    [14, 14, 14, 14, 14, 14, 1, 4, 1, 17, 18][index],
                tTexture: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 3][index],
                variation: // clothes 11
                    [224, 230, 230, 232, 231, 231, 24, 222, 24, 41, 230][index],
                texture: [3, 3, 3, 1, 1, 1, 11, 9, 11, 0, 9][index],
                undershirt: // clothes 8
                    [-1, -1, -1, -1, -1, -1, 20, -1, 38, 2, -1][index],
                uTexture: [-1, -1, -1, -1, -1, -1, 1, -1, 8, -1, -1][index],
            };
            legsParams = { // clothes 4
                sex: 0,
                variation: [90, 80, 90, 90, 90, 90, 23, 90, 23, 29, 90][index],
                texture: [3, 3, 3, 1, 1, 1, 5, 9, 5, 0, 9][index]
            };
            feetsParams = { // clothes 6
                sex: 0,
                variation: [25, 25, 25, 36, 36, 36, 6, 36, 6, 66, 36][index],
                texture: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0][index]
            };
            tiesParams = { // clothes 7
                sex: 0,
                variation: [-1, -1, -1, -1, -1, -1, -1, -1, -1, 16, 15][index],
                texture: [-1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 2][index]
            };
            masksParams = { // clothes 1
                sex: 0,
                variation: [-1, -1, -1, -1, -1, -1, -1, -1, -1, 122, 104][index],
                texture: [-1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 9][index]
            };
            glassesParams = { // prop 1
                sex: 0,
                variation: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 27][index],
                texture: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 4][index]
            };
        }
        if (topParams.undershirt == -1) delete topParams.undershirt;
        if (topParams.uTexture == -1) delete topParams.uTexture;
        if (topParams.tTexture == -1) delete topParams.tTexture;

        hatParams.faction = faction.id;
        topParams.faction = faction.id;
        legsParams.faction = faction.id;
        feetsParams.faction = faction.id;
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
        if (tiesParams.variation != -1) inventory.addItem(player, 2, tiesParams, response);
        if (masksParams.variation != -1) inventory.addItem(player, 14, masksParams, response);
        if (glassesParams.variation != -1) inventory.addItem(player, 1, glassesParams, response);

        notifs.success(player, `Форма выдана`, header);
        factions.setAmmo(faction, faction.ammo - army.clothesAmmo);
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
        factions.setAmmo(faction, faction.ammo - army.armourAmmo);
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
            count: 2,
        };

        inventory.addItem(player, itemId, params, (e) => {
            if (e) return notifs.error(player, e, header);

            notifs.success(player, `Вам выданы ${itemName}`, header);
            factions.setAmmo(faction, faction.ammo - army.itemAmmo);
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
            factions.setAmmo(faction, faction.ammo - army.gunAmmo);
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
            factions.setAmmo(faction, faction.ammo - army.ammoAmmo * ammo);
        });
    },
}
