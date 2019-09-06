"use strict";
var factions = require('../factions');
var inventory = require('../inventory');
var money = require('../money');
var notifs = require('../notifications');
var hospital = require('../hospital');

module.exports = {
    "init": () => {

    },
    "characterInit.done": (player) => {

    },
    "hospital.storage.clothes.take": (player, index) => {
        if (!player.insideFactionWarehouse) return notifs.error(player, `Вы далеко`, `Склад Hospital`);
        if (!factions.isHospitalFaction(player.character.factionId)) return notifs.error(player, `Вы не являетесь медиком`, `Склад Hospital`);

        var character = player.character;
        var faction = factions.getFaction(character.factionId);
        var header = `Склад ${faction.name}`;

        if (faction.ammo < hospital.clothesAmmo) return notifs.error(player, `Недостаточно боеприпасов`, header);

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
            if (factions.isHospitalFaction(params.faction)) return notifs.error(player, `Вы уже имеете головной убор`, header);
        }
        for (var key in tops) {
            var params = inventory.getParamsValues(tops[key]);
            if (factions.isHospitalFaction(params.faction)) return notifs.error(player, `Вы уже имеете рубашку`, header);
        }
        for (var key in legs) {
            var params = inventory.getParamsValues(legs[key]);
            if (factions.isHospitalFaction(params.faction)) return notifs.error(player, `Вы уже имеете брюки`, header);
        }
        for (var key in feets) {
            var params = inventory.getParamsValues(feets[key]);
            if (factions.isHospitalFaction(params.faction)) return notifs.error(player, `Вы уже имеете ботинки`, header);
        }
        for (var key in ears) {
            var params = inventory.getParamsValues(ears[key]);
            if (factions.isHospitalFaction(params.faction)) return notifs.error(player, `Вы уже имеете наушники`, header);
        }
        for (var key in ties) {
            var params = inventory.getParamsValues(ties[key]);
            if (factions.isHospitalFaction(params.faction)) return notifs.error(player, `Вы уже имеете аксессуар`, header);
        }
        for (var key in masks) {
            var params = inventory.getParamsValues(masks[key]);
            if (factions.isHospitalFaction(params.faction)) return notifs.error(player, `Вы уже имеете шлем`, header);
        }
        for (var key in glasses) {
            var params = inventory.getParamsValues(glasses[key]);
            if (factions.isHospitalFaction(params.faction)) return notifs.error(player, `Вы уже имеете очки`, header);
        }

        inventory.fullDeleteItemsByParams([6, 7, 8, 9, 10, 2, 14, 1], ["faction", "owner"], [character.factionId, character.id]);

        var hatParams, topParams, legsParams, feetsParams, earsParams, tiesParams, masksParams, glassesParams;
        if (character.gender == 0) { // муж.
            hatParams = {
                sex: 1,
                variation: [-1, -1][index],
                texture: [0, 0][index]
            };
            topParams = {
                sex: 1,
                torso: [90, 85][index],
                variation: [249, 250][index],
                texture: [0, 0][index],
                undershirt: [-1, -1][index],
            };
            legsParams = {
                sex: 1,
                variation: [96, 96][index],
                texture: [0, 0][index]
            };
            feetsParams = {
                sex: 1,
                variation: [8, 7][index],
                texture: [0, 0][index]
            };
            earsParams = {
                sex: 1,
                variation: [-1, -1][index],
                texture: [0, 0][index]
            };
            tiesParams = {
                sex: 1,
                variation: [126, 0][index],
                texture: [0, 0][index]
            };
            masksParams = {
                sex: 1,
                variation: [-1, -1][index],
                texture: [0, 0][index]
            };
            glassesParams = {
                sex: 1,
                variation: [-1, -1][index],
                texture: [0, 0][index]
            };
        } else {
            hatParams = {
                sex: 0,
                variation: [-1, -1][index],
                texture: [0, 0][index]
            };
            topParams = {
                sex: 0,
                torso: [98, 98][index],
                variation: [250, 283][index],
                texture: [1, 0][index]
            };
            legsParams = {
                sex: 0,
                variation: [99, 99][index],
                texture: [0, 0][index]
            };
            feetsParams = {
                sex: 0,
                variation: [19, 19][index],
                texture: [0, 0][index]
            };
            earsParams = {
                sex: 0,
                variation: [-1, -1][index],
                texture: [0, 0][index]
            };
            tiesParams = {
                sex: 0,
                variation: [-1, 96][index],
                texture: [0, 0][index]
            };
            masksParams = {
                sex: 0,
                variation: [-1, -1][index],
                texture: [0, 0][index]
            };
            glassesParams = {
                sex: 0,
                variation: [-1, -1][index],
                texture: [0, 0][index]
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
        if (earsParams.variation != -1) inventory.addItem(player, 10, tiesParams, response);
        if (tiesParams.variation != -1) inventory.addItem(player, 2, tiesParams, response);
        if (masksParams.variation != -1) inventory.addItem(player, 14, masksParams, response);
        if (glassesParams.variation != -1) inventory.addItem(player, 1, glassesParams, response);

        notifs.success(player, `Форма выдана`, header);
        faction.ammo -= hospital.clothesAmmo;
        faction.save();
    },
    "hospital.storage.items.take": (player, index) => {
        if (!player.insideFactionWarehouse) return notifs.error(player, `Вы далеко`, `Склад Hospital`);
        if (!factions.isHospitalFaction(player.character.factionId)) return notifs.error(player, `Вы не являетесь медиком`, `Склад Hospital`);

        var character = player.character;
        var faction = factions.getFaction(character.factionId);
        var header = `Склад ${faction.name}`;

        if (faction.medicines < hospital.itemMedicines) return notifs.error(player, `Недостаточно медикаментов`, header);

        var itemIds = [24, 27, 25];

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
        if (itemId == 24) { // малая аптечка
            params.count = 5;
        } else if (itemId == 27) { // большая аптечка
            params.count = 10;
        } else if (itemId == 25) { // пластырь
            params.count = 5;
        }

        inventory.addItem(player, itemId, params, (e) => {
            if (e) return notifs.error(player, e, header);

            notifs.success(player, `Вам выданы ${itemName}`, header);
            faction.ammo -= hospital.itemAmmo;
            faction.save();
        });
    },
    // лечение игрока (пополнение ХП) | показ + принятие + отмена:
    "hospital.healing.show": (player, recId) => {
        var header = `Лечение`;
        var rec = mp.players.at(recId);
        if (!rec) return notifs.error(player, `Игрок #${recId} не найден`, header);
        if (player.dist(rec.position) > 10) return notifs.error(player, `${rec.name} далеко`, header);
        if (!factions.isHospitalFaction(player.character.factionId)) return notifs.error(player, `Вы не медик`, header);
        if (rec.health == 100) return notifs.error(player, `${rec.name} полностью здоров`, header);
        var med = inventory.getItemByItemId(player, [24, 27]);
        if (!med) return notifs.error(player, `Аптечка не найдена`, header);
        var count = inventory.getParam(med, 'count').value;
        if (!count) return notifs.error(player, `Количество: 0 ед.`, header);


        rec.offer = {
            type: "hospital_healing",
            inviterId: player.id,
            health: 100 - rec.health
        };
        rec.call(`offerDialog.show`, ["hospital_healing", {
            name: player.name,
            price: parseInt(hospital.healingPrice * rec.offer.health)
        }]);
    },
    "hospital.healing.accept": (player) => {
        var header = `Лечение`;
        if (!player.offer || player.offer.type != "hospital_healing") return notifs.error(player, `Приглашение не найдено`, header);
        var offer = player.offer;
        delete player.offer;

        var inviter = mp.players.at(offer.inviterId);
        if (!inviter) return notifs.error(player, `Медик не найден`, header);
        if (player.dist(inviter.position) > 10) return notifs.error(player, `${inviter.name} далеко`, header);
        if (!factions.isHospitalFaction(inviter.character.factionId)) return notifs.error(player, `${inviter.name} не медик`, header);
        if (player.health == 100) {
            notifs.error(player, `Вы полностью здоровы`, header);
            notifs.error(inviter, `${player.name} полностью здоров`, header);
            return;
        }
        var price = offer.health * hospital.healingPrice;
        if (player.character.cash < price) return notifs.error(player, `Необходимо $${price}`, header);
        var med = inventory.getItemByItemId(inviter, [24, 27]);
        if (!med) {
            notifs.error(player, `${inviter.name} не имеет аптечки`, header);
            notifs.error(inviter, `Аптечка не найдена`, header);
            return;
        }
        var count = inventory.getParam(med, 'count').value;
        if (!count) return notifs.error(inviter, `Количество: 0 ед.`, header);

        money.removeCash(player, price, (res) => {
            if (!res) return notifs.error(player, `Непредв. ошибка 1! Обратитесь к разработчикам CRP.`, header);
            money.addCash(inviter, price, (res) => {
                if (!res) return notifs.error(player, `Непредв. ошибка 2! Обратитесь к разработчикам CRP.`, header);

                count--;
                if (!count) inventory.deleteItem(inviter, med);
                else inventory.updateParam(inviter, med, 'count', count);

                player.health = Math.clamp(player.health + offer.health, 1, 100);
                notifs.success(inviter, `${player.name} вылечился`, header);
                notifs.success(player, `${inviter.name} вас вылечил`, header);
            });
        });
    },
    "hospital.healing.cancel": (player) => {
        if (!player.offer) return;
        var inviter = mp.players.at(player.offer.inviterId);
        delete player.offer;
        if (!inviter) return;
        notifs.info(player, `Предложение отклонено`, `Лечение`);
        notifs.info(inviter, `${player.name} отклонил предложение`, `Лечение`);
    },
}
