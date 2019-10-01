"use strict";
var bands = require('../bands');
var factions = require('../factions');
var inventory = require('../inventory');
var mafia = require('../mafia');
var money = require('../money');
var notifs = require('../notifications');
var police = require('../police')

module.exports = {
    "init": () => {

    },
    "characterInit.done": (player) => {
        player.call(`police.wanted.set`, [player.character.wanted]);
        if (!factions.isPoliceFaction(player.character.factionId)) return;
        mp.events.call(`mapCase.pd.init`, player);

        if (!player.character.arrestTime) return;
        var time = player.character.arrestTime;
        if (player.character.arrestType == 0) police.startCellArrest(player, null, time);
        else if (player.character.arrestType == 1) police.startJailArrest(player, null, time);
    },
    "police.storage.clothes.take": (player, index) => {
        if (!player.insideFactionWarehouse) return notifs.error(player, `Вы далеко`, `Склад Police`);
        if (!factions.isPoliceFaction(player.character.factionId)) return notifs.error(player, `Вы не являетесь сотрудником`, `Склад Police`);

        var character = player.character;
        var faction = factions.getFaction(character.factionId);
        var header = `Склад ${faction.name}`;

        if (faction.ammo < police.clothesAmmo) return notifs.error(player, `Недостаточно боеприпасов`, header);
        if (player.inventory.items.length) return notifs.error(player, `Необходимо раздеться, чтобы надеть форму`, header);

        inventory.fullDeleteItemsByParams([6, 7, 8, 9, 10, 2, 14, 1], ["faction", "owner"], [character.factionId, character.id]);

        var hatParams, topParams, legsParams, feetsParams, tiesParams, masksParams, glassesParams;
        var f = character.factionId - 2;
        if (character.gender == 0) { // муж.
            hatParams = { // prop 0
                sex: 1,
                variation: [
                    [58, 46, 46, -1, -1, 39, 46, 46],
                    [58, 13, 13, 39, 17, 13, 13]
                ][f][index],
                texture: [
                    [2, 0, 0, -1, -1, 0, 0, 0],
                    [2, 2, 2, 0, 5, 2, 2]
                ][f][index]
            };
            topParams = { // clothes 11 / 3 / 8
                sex: 1,
                torso: [ // /clothes 3
                    [0, 0, 0, 11, 1, 17, 0, 0],
                    [0, 11, 14, 17, 11, 11, 11]
                ][f][index],
                tTexture: [
                    [-1, -1, -1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1, -1]
                ][f][index],
                variation: [ // clothes 11
                    [242, 55, 55, 13, 31, 53, 55, 55],
                    [242, 26, 230, 53, 26, 26, 13]
                ][f][index],
                texture: [
                    [4, 0, 0, 0, 2, 0, 0, 0],
                    [4, 2, 1, 2, 2, 2, 0]
                ][f][index],
                undershirt: [ // clothes 8
                    [122, 58, 58, 130, 31, 130, 122, 130],
                    [122, 58, 27, 130, 58, 122, 130]
                ][f][index],
                decal: [ // clothes 10
                    [-1, -1, 8, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1, -1]
                ][f][index],
                dTexture: [
                    [-1, -1, 1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1, -1]
                ][f][index],
            };
            legsParams = { // clothes 4
                sex: 1,
                variation: [
                    [25, 25, 25, 25, 25, 33, 25, 48],
                    [25, 25, 25, 46, 31, 25, 25]
                ][f][index],
                texture: [
                    [2, 2, 2, 1, 2, 0, 2, 0],
                    [6, 6, 6, 0, 0, 6, 6]
                ][f][index]
            };
            feetsParams = { // clothes 6
                sex: 1,
                variation: [
                    [25, 25, 25, 10, 10, 25, 25, 25],
                    [25, 25, 25, 25, 25, 25, 25]
                ][f][index],
                texture: [
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0]
                ][f][index]
            };
            tiesParams = { // clothes 7
                sex: 1,
                variation: [
                    [-1, -1, -1, 38, 38, -1, -1, -1],
                    [-1, -1, -1, -1, -1, 38, 38]
                ][f][index],
                texture: [
                    [-1, -1, -1, 0, 6, -1, -1, -1],
                    [-1, -1, -1, -1, -1, 7, 1]
                ][f][index]
            };
            masksParams = { // clothes 1
                sex: 1,
                variation: [
                    [-1, -1, -1, -1, -1, 122, -1, -1],
                    [-1, -1, -1, 122, -1, -1, -1]
                ][f][index],
                texture: [
                    [-1, -1, -1, -1, -1, 0, -1, -1],
                    [-1, -1, -1, -1, -1, -1, -1]
                ][f][index]
            };
            glassesParams = { // prop 1
                sex: 1,
                variation: [
                    [-1, -1, -1, -1, -1, 15, -1, -1],
                    [-1, -1, -1, 15, 15, -1, -1]
                ][f][index],
                texture: [
                    [-1, -1, -1, -1, -1, 9, -1, -1],
                    [-1, -1, -1, 9, 9, -1, -1]
                ][f][index]
            };
        } else {
            hatParams = { // prop 0
                sex: 0,
                variation: [
                    [85, 45, 45, -1, -1, 38, 45, 45],
                    [58, 58, 58, 38, 17, 58, 58]
                ][f][index],
                texture: [
                    [2, 0, 0, -1, -1, 0, 0, 0],
                    [2, 0, 0, 2, 5, 0, 0]
                ][f][index]
            };
            topParams = { // clothes 11 / 3 / 8
                sex: 0,
                torso: [ // /clothes 3
                    [14, 14, 14, 0, 3, 18, 14, 14],
                    [14, 0, 0, 18, 0, 0, 0]
                ][f][index],
                tTexture: [
                    [-1, -1, -1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1, -1]
                ][f][index],
                variation: [ // clothes 11
                    [250, 48, 48, 27, 57, 46, 48, 48],
                    [250, 27, 240, 46, 27, 27, 27]
                ][f][index],
                texture: [
                    [4, 0, 0, 0, 2, 0, 0, 0],
                    [4, 2, 1, 2, 2, 2, 0]
                ][f][index],
                undershirt: [ // clothes 8
                    [122, 35, 35, 160, 64, 160, 152, 152],
                    [159, 35, 38, 160, 35, 152, 160]
                ][f][index]
            };
            legsParams = { // clothes 4
                sex: 0,
                variation: [
                    [37, 37, 37, 37, 37, 32, 37, 37],
                    [37, 37, 37, 48, 30, 37, 37]
                ][f][index],
                texture: [
                    [2, 2, 2, 0, 2, 0, 1, 1],
                    [6, 6, 6, 0, 0, 6, 6]
                ][f][index]
            };
            feetsParams = { // clothes 6
                sex: 0,
                variation: [
                    [27, 27, 27, 13, 13, 25, 13, 13],
                    [27, 27, 27, 25, 25, 27, 27]
                ][f][index],
                texture: [
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0]
                ][f][index]
            };
            tiesParams = { // clothes 7
                sex: 0,
                variation: [
                    [-1, -1, -1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1, -1]
                ][f][index],
                texture: [
                    [-1, -1, -1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1, -1]
                ][f][index]
            };
            masksParams = { // clothes 1
                sex: 0,
                variation: [
                    [-1, -1, -1, -1, -1, 122, -1, -1],
                    [-1, -1, -1, 122, -1, -1, -1]
                ][f][index],
                texture: [
                    [-1, -1, -1, -1, -1, 0, -1, -1],
                    [-1, -1, -1, 0, -1, -1, -1]
                ][f][index]
            };
            glassesParams = { // prop 1
                sex: 0,
                variation: [
                    [-1, -1, -1, -1, -1, 9, -1, -1],
                    [-1, -1, -1, 9, 15, -1, -1]
                ][f][index],
                texture: [
                    [-1, -1, -1, -1, -1, 9, -1, -1],
                    [-1, -1, -1, 9, 9, -1, -1]
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
        factions.setAmmo(faction, faction.ammo - police.clothesAmmo);
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
        if (character.gender == 0) { // муж.
            params = {
                variation: 12,
                texture: 1
            };
        } else {
            params = {
                variation: 12,
                texture: 1
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
        factions.setAmmo(faction, faction.ammo - police.armourAmmo);
    },
    "police.storage.items.take": (player, index) => {
        if (!player.insideFactionWarehouse) return notifs.error(player, `Вы далеко`, `Склад Police`);
        if (!factions.isPoliceFaction(player.character.factionId)) return notifs.error(player, `Вы не являетесь сотрудником`, `Склад Police`);

        var character = player.character;
        var faction = factions.getFaction(character.factionId);
        var header = `Склад ${faction.name}`;


        var itemIds = [28, 24];
        index = Math.clamp(index, 0, itemIds.length - 1);
        var itemId = itemIds[index];
        if (itemId == 24) {
            if (faction.medicines < police.itemAmmo) return notifs.error(player, `Недостаточно медикаментов`, header);
        } else {
            if (faction.ammo < police.itemAmmo) return notifs.error(player, `Недостаточно боеприпасов`, header);
        }

        var itemName = inventory.getName(itemId);
        // var items = inventory.getArrayByItemId(player, itemId);
        // if (items.length > 0) return notifs.error(player, `Вы уже имеете ${itemName}`, header);

        // inventory.fullDeleteItemsByParams(itemId, ["faction", "owner"], [character.factionId, character.id]);
        var params = {
            faction: character.factionId,
            owner: character.id
        };
        if (itemId == 24) params.count = 2;

        inventory.addItem(player, itemId, params, (e) => {
            if (e) return notifs.error(player, e, header);

            notifs.success(player, `Вам выданы ${itemName}`, header);

            if (itemId == 24) factions.setMedicines(faction, faction.medicines - police.itemAmmo);
            else factions.setAmmo(faction, faction.ammo - police.itemAmmo);
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
            "weapon_carbinerifle"
        ];
        index = Math.clamp(index, 0, itemIds.length - 1);
        var itemId = itemIds[index];

        var gunName = inventory.getName(itemId);
        var guns = inventory.getArrayByItemId(player, itemId);

        if (guns.length > 0) return notifs.error(player, `Вы уже имеете ${gunName}`, header);

        inventory.fullDeleteItemsByParams(itemId, ["faction", "owner"], [character.factionId, character.id]);
        var params = {
            weaponHash: mp.joaat(weaponIds[index]),
            ammo: 30,
            faction: character.factionId,
            owner: character.id
        };

        inventory.addItem(player, itemId, params, (e) => {
            if (e) return notifs.error(player, e, header);

            notifs.success(player, `Вам выдано оружие ${gunName}`, header);
            factions.setAmmo(faction, faction.ammo - police.gunAmmo);
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
            factions.setAmmo(faction, faction.ammo - police.ammoAmmo * ammo);
        });
    },
    // снять/надеть наручники
    "police.cuffs": (player, data) => {
        if (typeof data == 'string') data = JSON.parse(data);
        var rec = (data.recId != null) ? mp.players.at(data.recId) : mp.players.getNear(player);
        if (!rec) return notifs.error(player, `Гражданин не найден`, `Наручники`);
        var dist = player.dist(rec.position);
        if (dist > 20) return notifs.error(player, `${rec.name} далеко`, `Наручники`);
        var character = player.character;
        if (!factions.isPoliceFaction(character.factionId) && !factions.isFibFaction(character.factionId)) return notifs.error(player, `Вы не сотрудник полиции/агент`, `Наручники`);
        if (rec.vehicle) return notifs.error(player, `${rec.name} находится в авто`, `Наручники`);

        if (!rec.cuffs) {
            var cuffs = (data.cuffsSqlId) ? inventory.getItem(player, data.cuffsSqlId) : inventory.getItemByItemId(player, 28);
            if (!cuffs) return notifs.error(player, `Предмет ${inventory.getName(28)} не найден`, `Наручники`);
            inventory.deleteItem(player, cuffs);
            police.setCuffs(rec, cuffs);

            notifs.info(rec, `${player.name} задержал вас`, `Наручники`);
            notifs.success(player, `${rec.name} задержан`, `Наручники`);
        } else {
            inventory.addOldItem(player, rec.cuffs, (e) => {
                if (e) return notifs.error(player, e, `Наручники`);
            });

            notifs.info(rec, `${player.name} отпустил вас`, `Наручники`);
            notifs.info(player, `${rec.name} отпущен`, `Наручники`);

            police.setCuffs(rec, null);
            delete rec.isFollowing;
            rec.call(`police.follow.stop`);
        }
    },
    "police.follow": (player, recId) => {
        var rec = mp.players.at(recId);
        if (!rec) return notifs.error(player, `Гражданин не найден`, `Следование`);
        if (!factions.isPoliceFaction(player.character.factionId) && !factions.isFibFaction(player.character.factionId)) return notifs.error(player, `Вы не сотрудник полиции/агент`, `Следование`);

        if (!rec.isFollowing) {
            if (!rec.cuffs) return notifs.error(player, `${rec.name} не в наручниках`, `Следование`);
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
    "police.wanted": (player, recId) => {
        var rec = mp.players.at(recId);
        if (!rec) return notifs.error(player, `Гражданин не найден`, `Следование`);
        if (!factions.isPoliceFaction(player.character.factionId) && !factions.isFibFaction(player.character.factionId)) return notifs.error(player, `Вы не сотрудник полиции/агент`, `Следование`);

        police.setWanted(rec, rec.character.wanted + 1);

        // notifs.success(player, `${rec.name} имеет ${rec.character.wanted} ур.`, `Розыск`);
        notifs.info(rec, `${player.name} выдал вам ${rec.character.wanted} ур.`, `Розыск`);

        mp.players.forEach(cop => {
            if (!cop.character) return;
            if (!factions.isPoliceFaction(cop.character.factionId) && !factions.isFibFaction(cop.character.factionId)) return;

            notifs.warning(cop, `${player.name} выдал ${rec.character.wanted} ур. ${rec.name}`, `Розыск`);
        });
    },
    "police.wanted.lower": (player) => {
        if (!player.character.wanted) return;

        police.setWanted(player, player.character.wanted - 1);

        notifs.warning(player, `Ваш уровень розыска понизился`);
    },
    "police.search": (player, recId) => {
        var rec = mp.players.at(recId);
        if (!rec) return notifs.error(player, `Игрок #${recId} не найден`);
        if (!rec.character.wanted) return notifs.error(player, `${rec.name} не в розыске`);
        if (!factions.isPoliceFaction(player.character.factionId) && !factions.isFibFaction(player.character.factionId)) return notifs.error(player, `Вы не сотрудник`);
        if (rec.dimension != 0) return notifs.error(player, `${rec.name} достаточно хорошо скрыт`);
        if (player.lastWantedSearch && Date.now() - player.lastWantedSearch < police.searchTime) return notifs.warning(player, `Ожидайте...`);
        player.lastWantedSearch = Date.now();

        var pos = police.getSearchPosition(rec.position);

        player.call(`police.search.blip.create`, [rec.name, pos]);
        notifs.success(player, `Приблизительное местоположение ${rec.name} отмечено на карте`);
    },
    // арестовать в КПЗ ЛСПД
    "police.cells.arrest": (player, recId) => {
        var rec = mp.players.at(recId);
        if (!rec) return notifs.error(player, `Гражданин не найден`, `Арест`);
        if (!factions.isPoliceFaction(player.character.factionId)) return notifs.error(player, `Вы не сотрудник полиции`, `Арест`);

        if (rec.arrestTime > 0) {
            console.log("stopArrest")
            // rec.utils.clearArrest();
            // return rec.utils.info(`${player.name} выпустил Вас на свободу`);
        }
        if (!rec.character.wanted) return notifs.error(player, `${rec.name} не преступник`, `Арест`);

        var cell = police.getNearCell(player);
        if (!cell) return notifs.error(player, `Вы далеко от камеры`, `Арест`);
        if (rec.cuffs) {
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
    // арестовать в тюрьму за городом
    "police.jail.arrest": (player, recId) => {
        var rec = mp.players.at(recId);
        if (!rec) return notifs.error(player, `Гражданин не найден`, `Арест`);
        if (!factions.isPoliceFaction(player.character.factionId) && !factions.isFibFaction(player.character.factionId)) return notifs.error(player, `Вы не сотрудник полиции/агент`, `Арест`);

        if (rec.arrestTime > 0) {
            console.log("stopArrest")
            // rec.utils.clearArrest();
            // return rec.utils.info(`${player.name} выпустил Вас на свободу`);
        }
        if (!rec.character.wanted) return notifs.error(player, `${rec.name} не преступник`, `Арест`);

        var cell = police.getNearJailCell(player);
        if (!cell) return notifs.error(player, `Вы далеко от камеры`, `Арест`);
        if (rec.cuffs) {
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
        police.startJailArrest(rec, cell, time);
        notifs.info(rec, `${player.name} посадил вас в тюрьму`, `Арест`);
        notifs.success(player, `Вы посадили ${rec.name} к тюрьму`, `Арест`);

        money.addCash(player, police.arrestPay, (res) => {
            if (!res) return console.log(`[police] Ошибка выдачи ЗП за арест ${player.name}`);
            notifs.info(player, `+ $${police.arrestPay}`, `Бонус`);
        });

        //todo broadcast to radio
    },
    "police.vehicle.put": (player, recId) => {
        var header = `Посадка`;
        var rec = mp.players.at(recId);
        if (!rec) return notifs.error(player, `Гражданин не найден`, header);
        if (rec.vehicle) return notifs.error(player, `${rec.name} уже в авто`, header);
        if (!factions.isPoliceFaction(player.character.factionId) && !factions.isFibFaction(player.character.factionId)) return notifs.error(player, `Вы не сотрудник полиции/агент`, header);

        var veh = mp.vehicles.getNear(player);
        if (!veh) return notifs.error(player, `Авто не найдено`, header);
        var dist = player.dist(veh.position);
        if (dist > 3) return notifs.error(player, `Авто далеко`, header);
        var freeSeat = [0, 1, 2];
        var occupants = veh.getOccupants();
        for (var i = 0; i < occupants.length; i++) {
            var occ = occupants[i];
            var index = freeSeat.indexOf(occ.seat);
            if (index != -1) freeSeat.splice(index, 1);
        }

        if (freeSeat.length == 0) return notifs.error(player, `В авто нет места`, header);
        rec.call(`police.follow.stop`);
        delete rec.isFollowing;
        rec.putIntoVehicle(veh, freeSeat[0]);
        notifs.success(player, `${rec.name} посажен в авто`, header);
        notifs.info(rec, `${player.name} посадил вас в авто`, header);
    },
    "police.vehicle.remove": (player, recId) => {
        var header = `Высадка`;
        var rec = mp.players.at(recId);
        if (!rec) return notifs.error(player, `Гражданин не найден`, header);
        if (!rec.vehicle) return notifs.error(player, `${rec.name} не в авто`, header);
        if (!factions.isPoliceFaction(player.character.factionId) && !factions.isFibFaction(player.character.factionId)) return notifs.error(player, `Вы не сотрудник полиции/агент`, header);

        rec.removeFromVehicle();
        notifs.success(player, `${rec.name} высажен из авто`, header);
        notifs.info(rec, `${player.name} высадил вас из авто`, header);
    },
    "police.licenses.gun.give": (player, recId) => {
        var header = `Лицензия на оружие`;
        var rec = mp.players.at(recId);
        if (!rec) return notifs.error(player, `Гражданин не найден`, header);
        var character = rec.character;
        if (character.gunLicenseDate) return notifs.error(player, `${rec.name} уже имеет лицензию`, header);

        character.gunLicenseDate = new Date();
        character.save();

        notifs.success(player, `Выдана лицензия ${rec.name}`, header);
        notifs.info(rec, `${player.name} выдал вам лицензию`, header);
    },
    "police.licenses.gun.take": (player, recId) => {
        var header = `Лицензия на оружие`;
        var rec = mp.players.at(recId);
        if (!rec) return notifs.error(player, `Гражданин не найден`, header);
        var character = rec.character;
        if (!character.gunLicenseDate) return notifs.error(player, `${rec.name} не имеет лицензию`, header);

        character.gunLicenseDate = null;
        character.save();

        notifs.success(player, ` Лицензия изъята ${rec.name}`, header);
        notifs.info(rec, `${player.name} изъял у вас лицензию`, header);
    },
    "playerDeath": (player, reason, killer) => {
        if (player.cuffs) police.setCuffs(player, false);
        if (!killer) return;

        // Если бандит убил бандита в гетто, то розыск не выдаем
        if (factions.isBandFaction(killer.character.factionId) && factions.isBandFaction(player.character.factionId) &&
            bands.isInBandZones(killer.position) && bands.isInBandZones(player.position)) return;

        // Если мафия убила мафию в зоне для бизвара, то розыск не выдаем
        if (factions.isMafiaFaction(killer.character.factionId) && factions.isMafiaFaction(player.character.factionId) &&
            mafia.getZoneByPos(killer.position) && mafia.getZoneByPos(player.position)) return;

        // Если полицейский/агент убил преступника, то розыск не выдаем
        if ((factions.isPoliceFaction(killer.character.factionId) || factions.isFibFaction(killer.character.factionId)) &&
            player.character.wanted) return;

        police.setWanted(killer, killer.character.wanted + 1, `Убийство мирного жителя`);
    },
    "playerQuit": (player) => {
        if (!player.character) return;
        if (!player.character.arrestTime) return;
        var date = (player.character.arrestType == 0) ? player.cellArrestDate : player.jailArrestDate;
        var time = Date.now() - date;
        player.character.arrestTime -= time;
        player.character.save();
        clearTimeout(player.cellArrestTimer);
        clearTimeout(player.jailArrestTimer);
    },
}
