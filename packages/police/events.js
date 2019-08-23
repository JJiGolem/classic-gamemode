"use strict";
var factions = require('../factions');
var inventory = require('../inventory');
var money = require('../money');
var notifs = require('../notifications');
var police = require('../police')

module.exports = {
    "init": () => {

    },
    "characterInit.done": (player) => {
        if (!player.character.arrestTime) return;

        console.log(`arrestTime: ${player.character.arrestTime}`)

        var time = player.character.arrestTime;
        police.startCellArrest(player, null, time);
    },
    "police.storage.clothes.take": (player, index) => {
        if (!player.insideFactionWarehouse) return notifs.error(player, `Вы далеко`, `Склад Police`);
        if (!factions.isPoliceFaction(player.character.factionId)) return notifs.error(player, `Вы не являетесь сотрудником`, `Склад Police`);

        var character = player.character;
        var faction = factions.getFaction(character.factionId);
        var header = `Склад ${faction.name}`;

        if (faction.ammo < police.clothesAmmo) return notifs.error(player, `Недостаточно боеприпасов`, header);

        var hats = inventory.getArrayByItemId(player, 6);
        var tops = inventory.getArrayByItemId(player, 7);
        var legs = inventory.getArrayByItemId(player, 8);
        var feets = inventory.getArrayByItemId(player, 9);
        var ties = inventory.getArrayByItemId(player, 2);
        var masks = inventory.getArrayByItemId(player, 14);
        var glasses = inventory.getArrayByItemId(player, 1);

        for (var key in hats) {
            var params = inventory.getParamsValues(hats[key]);
            if (factions.isPoliceFaction(params.faction)) return notifs.error(player, `Вы уже имеете головной убор`, header);
        }
        for (var key in tops) {
            var params = inventory.getParamsValues(tops[key]);
            if (factions.isPoliceFaction(params.faction)) return notifs.error(player, `Вы уже имеете рубашку`, header);
        }
        for (var key in legs) {
            var params = inventory.getParamsValues(legs[key]);
            if (factions.isPoliceFaction(params.faction)) return notifs.error(player, `Вы уже имеете брюки`, header);
        }
        for (var key in feets) {
            var params = inventory.getParamsValues(feets[key]);
            if (factions.isPoliceFaction(params.faction)) return notifs.error(player, `Вы уже имеете ботинки`, header);
        }
        for (var key in ties) {
            var params = inventory.getParamsValues(ties[key]);
            if (factions.isPoliceFaction(params.faction)) return notifs.error(player, `Вы уже имеете аксессуар`, header);
        }
        for (var key in masks) {
            var params = inventory.getParamsValues(masks[key]);
            if (factions.isPoliceFaction(params.faction)) return notifs.error(player, `Вы уже имеете шлем`, header);
        }
        for (var key in glasses) {
            var params = inventory.getParamsValues(glasses[key]);
            if (factions.isPoliceFaction(params.faction)) return notifs.error(player, `Вы уже имеете очки`, header);
        }


        inventory.fullDeleteItemsByParams(6, ["faction", "owner"], [character.factionId, character.id]);
        inventory.fullDeleteItemsByParams(7, ["faction", "owner"], [character.factionId, character.id]);
        inventory.fullDeleteItemsByParams(8, ["faction", "owner"], [character.factionId, character.id]);
        inventory.fullDeleteItemsByParams(9, ["faction", "owner"], [character.factionId, character.id]);
        inventory.fullDeleteItemsByParams(10, ["faction", "owner"], [character.factionId, character.id]);
        inventory.fullDeleteItemsByParams(2, ["faction", "owner"], [character.factionId, character.id]);
        inventory.fullDeleteItemsByParams(14, ["faction", "owner"], [character.factionId, character.id]);
        inventory.fullDeleteItemsByParams(1, ["faction", "owner"], [character.factionId, character.id]);

        var hatParams, topParams, legsParams, feetsParams, tiesParams, masksParams, glassesParams;
        var f = character.factionId - 2;
        if (character.gender == 0) { // муж.
            hatParams = {
                sex: 1,
                variation: [
                    [46, 124, 46],
                    [117, -1, -1, 58, -1, -1, 13]
                ][f][index],
                texture: [
                    [0, 15, 0],
                    [0, 0, 0, 1, 0, 0, 0]
                ][f][index]
            };
            topParams = {
                sex: 1,
                torso: [
                    [0, 108, 11],
                    [17, 0, 11, 11, 11, 11, 6]
                ][f][index],
                tTexture: [
                    [-1, 9, -1],
                    [-1, -1, -1, -1, -1, -1, -1]
                ][f][index],
                variation: [
                    [55, 89, 13],
                    [53, 242, 13, 13, 13, 13, 156]
                ][f][index],
                texture: [
                    [0, 0, 1],
                    [3, 2, 1, 1, 1, 2, 0]
                ][f][index],
                undershirt: [
                    [58, 129, -1],
                    [122, 129, 58, 58, 122, 130, 115]
                ][f][index]
            };
            legsParams = {
                sex: 1,
                variation: [
                    [35, 59, 35],
                    [47, 22, 22, 22, 37, 37, 25]
                ][f][index],
                texture: [
                    [0, 9, 0],
                    [1, 1, 1, 1, 1, 1, 6]
                ][f][index]
            };
            feetsParams = {
                sex: 1,
                variation: [
                    [25, 25, 10],
                    [25, 25, 25, 25, 25, 10, 10, 10]
                ][f][index],
                texture: [
                    [0, 0, 0],
                    [0, 0, 0, 0, 12, 0, 12]
                ][f][index]
            };
            tiesParams = {
                sex: 1,
                variation: [
                    [-1, -1, 21],
                    [-1, -1, 38, -1, 38, 38, -1]
                ][f][index],
                texture: [
                    [0, 0, 1],
                    [0, 0, 0, 0, 0, 1, 0]
                ][f][index]
            };
            masksParams = {
                sex: 1,
                variation: [
                    [-1, 35, -1],
                    [52, -1, -1, -1, -1, -1, -1]
                ][f][index],
                texture: [
                    [-1, 0, -1],
                    [0, 0, 0, 0, 0, 0, 0]
                ][f][index]
            };
            glassesParams = {
                sex: 1,
                variation: [
                    [-1, -1, -1],
                    [-1, -1, -1, -1, -1, -1, -1]
                ][f][index],
                texture: [
                    [0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0]
                ][f][index]
            };
        } else {
            hatParams = {
                sex: 0,
                variation: [
                    [45, 124, 45],
                    [116, -1, -1, 58, -1, -1, 20]
                ][f][index],
                texture: [
                    [0, 0, 0],
                    [0, 0, 0, 1, 0, 0, 1]
                ][f][index]
            };
            topParams = {
                sex: 0,
                torso: [
                    [31, 23, 31],
                    [18, 0, 0, 20, 20, 20, 20]
                ][f][index],
                variation: [
                    [48, 103, 48],
                    [46, 165, 27, 27, 27, 27, 183]
                ][f][index],
                texture: [
                    [0, 0, 0],
                    [3, 0, 2, 2, 2, 2, 2]
                ][f][index],
                undershirt: [
                    [-1, -1, 35],
                    [160, 78, 35, 35, 152, 152, 37]
                ][f][index]
            };
            legsParams = {
                sex: 0,
                variation: [
                    [34, 33, 34],
                    [49, 41, 64, 64, 41, 37, 37]
                ][f][index],
                texture: [
                    [0, 0, 0],
                    [1, 1, 2, 2, 1, 6, 6]
                ][f][index]
            };
            feetsParams = {
                sex: 0,
                variation: [
                    [29, 25, 29],
                    [25, 13, 55, 55, 29, 29, 29]
                ][f][index],
                texture: [
                    [0, 0, 0],
                    [0, 0, 0, 0, 0, 2, 2]
                ][f][index]
            };
            tiesParams = {
                sex: 1,
                variation: [
                    [-1, -1, -1],
                    [-1, -1, -1, -1, -1, -1, 95]
                ][f][index],
                texture: [
                    [0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0]
                ][f][index]
            };
            masksParams = {
                sex: 0,
                variation: [
                    [-1, -1, -1],
                    [57, -1, -1, -1, -1, -1, -1]
                ][f][index],
                texture: [
                    [0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0]
                ][f][index]
            };
            glassesParams = {
                sex: 0,
                variation: [
                    [-1, -1, -1, -1, 27, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1, -1]
                ][f][index],
                texture: [
                    [0, 0, 0, 0, 4, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0]
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
        faction.ammo -= police.clothesAmmo;
        faction.save();
    },
    "police.storage.armour.take": (player) => {
        if (!player.insideFactionWarehouse) return notifs.error(player, `Вы далеко`, `Склад Police`);
        if (!factions.isPoliceFaction(player.character.factionId)) return notifs.error(player, `Вы не являетесь сотрудником`, `Склад Police`);

        var character = player.character;
        var faction = factions.getFaction(character.factionId);
        var header = `Склад ${faction.name}`;

        if (faction.ammo < police.armourAmmo) return notifs.error(player, `Недостаточно боеприпасов`, header);
        var armours = inventory.getArrayByItemId(player, 3);

        for (var key in armours) {
            var params = inventory.getParamsValues(armours[key]);
            if (factions.isPoliceFaction(params.faction)) return notifs.error(player, `Вы уже имеете бронежилет`, header);
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
        faction.ammo -= police.armourAmmo;
        faction.save();
    },
    "police.storage.items.take": (player, index) => {
        if (!player.insideFactionWarehouse) return notifs.error(player, `Вы далеко`, `Склад Police`);
        if (!factions.isPoliceFaction(player.character.factionId)) return notifs.error(player, `Вы не являетесь сотрудником`, `Склад Police`);

        var character = player.character;
        var faction = factions.getFaction(character.factionId);
        var header = `Склад ${faction.name}`;

        if (faction.ammo < police.itemAmmo) return notifs.error(player, `Недостаточно боеприпасов`, header);

        var itemIds = [28];

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

        inventory.addItem(player, itemId, params, (e) => {
            if (e) return notifs.error(player, e, header);

            notifs.success(player, `Вам выданы ${itemName}`, header);
            faction.ammo -= police.itemAmmo;
            faction.save();
        });
    },
    "police.storage.guns.take": (player, index) => {
        if (!player.insideFactionWarehouse) return notifs.error(player, `Вы далеко`, `Склад Police`);
        if (!factions.isPoliceFaction(player.character.factionId)) return notifs.error(player, `Вы не являетесь сотрудником`, `Склад Police`);

        var character = player.character;
        var faction = factions.getFaction(character.factionId);
        var header = `Склад ${faction.name}`;

        if (faction.ammo < police.gunAmmo) return notifs.error(player, `Недостаточно боеприпасов`, header);

        var itemIds = [18, 17, 19, 20, 48, 21, 22];
        var weaponIds = ["weapon_flashlight", "weapon_nightstick", "weapon_stungun",
            "weapon_combatpistol", "weapon_smg", "weapon_pumpshotgun",
            "weapon_carbinerifle", "weapon_sniperrifle"
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
            faction.ammo -= police.gunAmmo;
            faction.save();
        });
    },
    "police.storage.ammo.take": (player, values) => {
        values = JSON.parse(values);
        var index = values[0];
        var ammo = values[1];
        if (!player.insideFactionWarehouse) return notifs.error(player, `Вы далеко`, `Склад Police`);
        if (!factions.isPoliceFaction(player.character.factionId)) return notifs.error(player, `Вы не являетесь сотрудником`, `Склад Police`);

        var character = player.character;
        var faction = factions.getFaction(character.factionId);
        var header = `Склад ${faction.name}`;

        var itemIds = [37, 38, 40, 39];
        index = Math.clamp(index, 0, itemIds.length - 1);
        if (faction.ammo < police.ammoAmmo * ammo) return notifs.error(player, `Недостаточно боеприпасов`, header);

        // inventory.fullDeleteItemsByParams(itemIds[index], ["faction", "owner"], [character.factionId, character.id]);
        var params = {
            count: ammo,
            faction: character.factionId,
            owner: character.id
        };
        inventory.addItem(player, itemIds[index], params, (e) => {
            if (e) return notifs.error(player, e, header);

            notifs.success(player, `Вам выданы ${inventory.getInventoryItem(itemIds[index]).name} (${ammo} ед.)`, header);
            faction.ammo -= police.ammoAmmo * ammo;
            faction.save();
        });
    },
    // снять/надеть наручники
    "police.cuffs": (player, recId) => {
        var rec = mp.players.at(recId);
        if (!rec) return notifs.error(player, `Гражданин не найден`, `Наручники`);
        var dist = player.dist(rec.position);
        if (dist > 20) return notifs.error(player, `${rec.name} далеко`, `Наручники`);
        var character = player.character;
        if (!factions.isPoliceFaction(character.factionId)) return notifs.error(player, `Вы не сотрудник полиции`, `Наручники`);
        if (rec.vehicle) return notifs.error(player, `${rec.name} находится в авто`, `Наручники`);

        if (!rec.hasCuffs) {
            var cuffs = inventory.getArrayByItemId(rec, 28);
            if (!cuffs.length) return notifs.error(player, `Необходим предмет`, `Наручники`);
            inventory.deleteItem(player, cuffs[0]);

            notifs.info(rec, `${player.name} задержал вас`, `Наручники`);
            notifs.success(player, `${rec.name} задержан`, `Наручники`);
        } else {
            var params = {
                faction: character.factionId,
                owner: character.id
            };
            inventory.addItem(player, 28, params, (e) => {
                if (e) return notifs.error(player, e, `Наручники`);
            });

            notifs.info(rec, `${player.name} отпустил вас`, `Наручники`);
            notifs.info(player, `${rec.name} отпущен`, `Наручники`);

            // delete rec.isFollowing;
            // rec.call(`stopFollowToPlayer`);
        }

        police.setCuffs(rec, !rec.hasCuffs);
    },
    "police.follow": (player, recId) => {
        var rec = mp.players.at(recId);
        if (!rec) return notifs.error(player, `Гражданин не найден`, `Следование`);
        if (!factions.isPoliceFaction(player.character.factionId)) return notifs.error(player, `Вы не сотрудник полиции`, `Следование`);

        if (!rec.isFollowing) {
            if (!rec.hasCuffs) return notifs.error(player, `${rec.name} не в наручниках`, `Следование`);
            rec.isFollowing = true;
            rec.call(`police.follow.start`, [player.id]);
            notifs.success(player, `${rec.name} следует за вами`, `Следование`);
            notifs.info(rec, `Вы следуете за ${player.name}`, `Следование`);
        } else {
            delete rec.isFollowing;
            rec.call(`police.follow.stop`);
            notifs.success(player, `${rec.name} не следует за вами`, `Следование`);
            notifs.info(rec, `Вы не следуете за ${player.name}`, `Следование`);
        }
    },
    // арестовать в КПЗ ЛСПД
    "police.cells.arrest": (player, recId) => {
        var rec = mp.players.at(recId);
        if (!rec) return notifs.error(player, `Гражданин не найден`, `Следование`);
        if (!factions.isPoliceFaction(player.character.factionId)) return notifs.error(player, `Вы не сотрудник полиции`, `Следование`);

        if (rec.arrestTime > 0) {
            console.log("stopArrest")
            // rec.utils.clearArrest();
            // return rec.utils.info(`${player.name} выпустил Вас на свободу`);
        }
        if (!rec.character.wanted) return notifs.error(player, `${rec.name} не преступник`, `Арест`);

        var cell = police.getNearCell(player);
        if (!cell) return notifs.error(player, `Вы далеко от камеры`, `Арест`);
        if (rec.hasCuffs) {
            var params = {
                faction: player.character.factionId,
                owner: player.character.id
            };
            inventory.addItem(player, 28, params, (e) => {
                if (e) return notifs.error(player, e, `Наручники`);
            });
        }

        var time = police.arrestTime * rec.character.wanted;
        rec.character.arrestTime = time;
        police.startCellArrest(rec, cell, time);
        notifs.info(rec, `${player.name} посадил вас в КПЗ`, `Арест`);
        notifs.success(player, `Вы посадили ${rec.name} к КПЗ`, `Арест`);

        money.addCash(player, police.arrestPay, (res) => {
            if (!res) return console.log(`[police] Ошибка выдачи ЗП за арест ${player.name}`);
            notifs.info(player, `+ $${police.arrestPay}`, `Бонус`);
        });

        //todo broadcast to radio
    },
    "playerDeath": (player) => {
        if (player.hasCuffs) police.setCuffs(player, false);
    },
    "playerQuit": (player) => {
        if (!player.character.arrestTime) return;
        var time = Date.now() - player.cellArrestDate;
        player.character.arrestTime -= time;
        player.character.save();
    },
}
