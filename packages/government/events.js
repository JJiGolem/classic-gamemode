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
        if (player.inventory.items.length) return notifs.error(player, `Необходимо раздеться, чтобы надеть форму`, header);

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
                variation: [-1, -1, -1, -1, -1][index],
                texture: [-1, -1, -1, -1, -1][index]
            };
            topParams = { // clothes 11 / 3 / 8
                sex: 0,
                torso: // /clothes 3
                    [0, 0, 1, 1, 1][index],
                tTexture: [-1, -1, -1, -1, -1][index],
                variation: // clothes 11
                    [27, 181, 57, 25, 57][index],
                texture: [0, 0, 0, 2, 2][index],
                undershirt: // clothes 8
                    [160, 178, 37, 37, 37][index]
            };
            legsParams = { // clothes 4
                sex: 0,
                variation: [54, 54, 54, 51, 51][index],
                texture: [2, 2, 2, 0, 1][index]
            };
            feetsParams = { // clothes 6
                sex: 0,
                variation: [29, 29, 29, 20, 23][index],
                texture: [0, 0, 0, 2, 0][index]
            };
            earsParams = { // prop 2
                sex: 0,
                variation: [2, 0, -1, -1, -1][index],
                texture: [0, 0, -1, -1, -1][index]
            };
            tiesParams = { // clothes 7
                sex: 0,
                variation: [-1, -1, -1, -1, -1][index],
                texture: [-1, -1, -1, -1, -1][index]
            };
            masksParams = { // clothes 1
                sex: 0,
                variation: [-1, -1, -1, -1, -1][index],
                texture: [-1, -1, -1, -1, -1][index]
            };
            glassesParams = { // prop 1
                sex: 0,
                variation: [-1, -1, -1, -1, -1][index],
                texture: [-1, -1, -1, -1, -1][index]
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
        hatParams.clime = '[-5,20]';
        topParams.clime = '[-5,20]';
        legsParams.clime = '[-5,20]';
        feetsParams.clime = '[-5,20]';
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
    "government.storage.items.take": (player, index) => {
        if (!player.insideFactionWarehouse) return notifs.error(player, `Вы далеко`, `Склад Government`);
        if (!factions.isGovernmentFaction(player.character.factionId)) return notifs.error(player, `Вы не охрана`, `Склад Government`);

        var character = player.character;
        var faction = factions.getFaction(character.factionId);
        var header = `Склад ${faction.name}`;

        if (faction.ammo < government.itemAmmo) return notifs.error(player, `Недостаточно боеприпасов`, header);

        var itemIds = [24, 28];

        index = Math.clamp(index, 0, itemIds.length - 1);
        var itemId = itemIds[index];

        var itemName = inventory.getInventoryItem(itemId).name;
        // var items = inventory.getArrayByItemId(player, itemId);
        // if (items.length > 0) return notifs.error(player, `Вы уже имеете ${itemName}`, header);

        // inventory.fullDeleteItemsByParams(itemId, ["faction", "owner"], [character.factionId, character.id]);
        var params = {
            faction: character.factionId,
            owner: character.id,
        };
        if (index == 0) params.count = 2;

        inventory.addItem(player, itemId, params, (e) => {
            if (e) return notifs.error(player, e, header);

            notifs.success(player, `Вам выданы ${itemName}`, header);
            factions.setAmmo(faction, faction.ammo - government.itemAmmo);
        });
    },
    "government.storage.guns.take": (player, index) => {
        if (!player.insideFactionWarehouse) return notifs.error(player, `Вы далеко`, `Склад Government`);
        if (!factions.isGovernmentFaction(player.character.factionId)) return notifs.error(player, `Вы не служите`, `Склад Government`);

        var character = player.character;
        var faction = factions.getFaction(character.factionId);
        var header = `Склад ${faction.name}`;

        if (faction.ammo < government.gunAmmo) return notifs.error(player, `Недостаточно боеприпасов`, header);

        var itemIds = [19, 80, 87, 100, 93];
        var weaponIds = ["weapon_stungun", "weapon_heavypistol", "weapon_assaultsmg", "weapon_advancedrifle", "weapon_bullpupshotgun"];
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
            factions.setAmmo(faction, faction.ammo - government.gunAmmo);
        });
    },
    "government.storage.ammo.take": (player, values) => {
        values = JSON.parse(values);
        var index = values[0];
        var ammo = values[1];
        if (!player.insideFactionWarehouse) return notifs.error(player, `Вы далеко`, `Склад Government`);
        if (!factions.isGovernmentFaction(player.character.factionId)) return notifs.error(player, `Вы не служите`, `Склад Government`);

        var character = player.character;
        var faction = factions.getFaction(character.factionId);
        var header = `Склад ${faction.name}`;

        var itemIds = [37, 38, 40, 39];
        index = Math.clamp(index, 0, itemIds.length - 1);
        if (faction.ammo < government.ammoAmmo * ammo) return notifs.error(player, `Недостаточно боеприпасов`, header);

        // inventory.fullDeleteItemsByParams(itemIds[index], ["faction", "owner"], [character.factionId, character.id]);
        var params = {
            count: ammo,
            faction: character.factionId,
            owner: character.id
        };
        inventory.addItem(player, itemIds[index], params, (e) => {
            if (e) return notifs.error(player, e, header);

            notifs.success(player, `Вам выданы ${inventory.getInventoryItem(itemIds[index]).name} (${ammo} ед.)`, header);
            factions.setAmmo(faction, faction.ammo - government.ammoAmmo * ammo);
        });
    },
}
