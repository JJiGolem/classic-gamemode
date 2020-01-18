"use strict";
var army = require('../army');
var factions = require('../factions');
var inventory = require('../inventory');
var logger = require('../logger');
var money = require('../money');
var notifs = require('../notifications');
let vehicles = call('vehicles');

module.exports = {
    "init": () => {
        army.init();
        inited(__dirname);
    },
    "characterInit.done": (player) => {
        if (!factions.isArmyFaction(player.character.factionId)) return;
        // player.call(`mapCase.init`, [player.name, player.character.factionId]);
        mp.events.call(`mapCase.army.init`, player);
    },
    "army.storage.clothes.take": (player, index) => {
        if (!player.insideFactionWarehouse) return notifs.error(player, `Вы далеко`, `Склад Army`);
        if (!factions.isArmyFaction(player.character.factionId)) return notifs.error(player, `Вы не служите`, `Склад Army`);

        var character = player.character;
        var faction = factions.getFaction(character.factionId);
        var rank = factions.getRankById(faction, character.factionRank);
        var header = `Склад ${faction.name}`;

        var minRank = faction.clothesRanks.find(x => x.clothesIndex == index);
        if (minRank && minRank.rank > rank.rank) return notifs.error(player, `Доступно с ранга ${factions.getRank(faction, minRank.rank).name}`, header);

        if (faction.ammo < army.clothesAmmo) return notifs.error(player, `Недостаточно боеприпасов`, header);
        if (player.inventory.items.length) return notifs.error(player, `Необходимо раздеться, чтобы надеть форму`, header);

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

        // hatParams.faction = faction.id;
        // topParams.faction = faction.id;
        // legsParams.faction = faction.id;
        // feetsParams.faction = faction.id;
        // tiesParams.faction = faction.id;
        // masksParams.faction = faction.id;
        // glassesParams.faction = faction.id;

        topParams.pockets = '[5,5,5,5,10,5]';
        legsParams.pockets = '[5,5,5,5,10,5]';
        hatParams.clime = '[-10,15]';
        topParams.clime = '[-10,15]';
        legsParams.clime = '[-10,15]';
        feetsParams.clime = '[-10,15]';
        topParams.name = `Рубашка ${faction.name}`;
        legsParams.name = `Брюки ${faction.name}`;

        // hatParams.owner = character.id;
        // topParams.owner = character.id;
        // legsParams.owner = character.id;
        // feetsParams.owner = character.id;
        // tiesParams.owner = character.id;
        // masksParams.owner = character.id;
        // glassesParams.owner = character.id;

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
        var rank = factions.getRankById(faction, character.factionRank);
        var header = `Склад ${faction.name}`;

        if (faction.ammo < army.armourAmmo) return notifs.error(player, `Недостаточно боеприпасов`, header);
        var armours = inventory.getArrayByItemId(player, 3);

        var minRank = faction.itemRanks.find(x => x.itemId == 3);
        if (minRank && minRank.rank > rank.rank) return notifs.error(player, `Доступно с ранга ${factions.getRank(faction, minRank.rank).name}`, header);

        for (var key in armours) {
            var params = inventory.getParamsValues(armours[key]);
            if (factions.isArmyFaction(params.faction)) return notifs.error(player, `Вы уже имеете бронежилет`, header);
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

        // params.faction = character.factionId;
        // params.owner = character.id;
        params.health = 100;
        params.pockets = '[3,3,3,3,3,3,3,3,10,5,3,5,10,3,3,3]';
        params.sex = character.gender ? 0 : 1;

        inventory.addItem(player, 3, params, (e) => {
            if (e) return notifs.error(player, e, header);

            notifs.success(player, `Выдан бронежилет`, header);
            factions.setAmmo(faction, faction.ammo - army.armourAmmo);
        });
    },
    "army.storage.items.take": (player, index) => {
        if (!player.insideFactionWarehouse) return notifs.error(player, `Вы далеко`, `Склад Army`);
        if (!factions.isArmyFaction(player.character.factionId)) return notifs.error(player, `Вы не служите`, `Склад Army`);

        var character = player.character;
        var faction = factions.getFaction(character.factionId);
        var rank = factions.getRankById(faction, character.factionRank);
        var header = `Склад ${faction.name}`;


        var itemIds = [24, 28, 132];
        var types = ["medicines", "ammo"];

        index = Math.clamp(index, 0, itemIds.length - 1);
        var itemId = itemIds[index];
        var type = types[index];

        var minRank = faction.itemRanks.find(x => x.itemId == itemId);
        if (minRank && minRank.rank > rank.rank) return notifs.error(player, `Доступно с ранга ${factions.getRank(faction, minRank.rank).name}`, header);

        if (faction[type] < army.itemAmmo) return notifs.error(player, `Недостаточно на складе`, header);
        var itemName = inventory.getInventoryItem(itemId).name;
        // var items = inventory.getArrayByItemId(player, itemId);
        // if (items.length > 0) return notifs.error(player, `Вы уже имеете ${itemName}`, header);

        // inventory.fullDeleteItemsByParams(itemId, ["faction", "owner"], [character.factionId, character.id]);
        var params = {
            // faction: character.factionId,
            // owner: character.id,
        };
        if (index == 0) params.count = 2;
        if (index == 2) params.satiety = params.thirst = 100;

        inventory.addItem(player, itemId, params, (e) => {
            if (e) return notifs.error(player, e, header);

            notifs.success(player, `Вам выдано "${itemName}"`, header);
            factions.setProducts(faction, type, faction[type] - army.itemAmmo);
        });
    },
    "army.storage.guns.take": (player, index) => {
        if (!player.insideFactionWarehouse) return notifs.error(player, `Вы далеко`, `Склад Army`);
        if (!factions.isArmyFaction(player.character.factionId)) return notifs.error(player, `Вы не служите`, `Склад Army`);

        var character = player.character;
        var faction = factions.getFaction(character.factionId);
        var rank = factions.getRankById(faction, character.factionRank);
        var header = `Склад ${faction.name}`;

        if (faction.ammo < army.gunAmmo) return notifs.error(player, `Недостаточно боеприпасов`, header);

        var itemIds = [17, 80, 48, 21, 22, 107];
        var weaponIds = ["weapon_nightstick", "weapon_heavypistol",
            "weapon_smg", "weapon_pumpshotgun",
            "weapon_carbinerifle", "weapon_heavysniper"
        ];
        index = Math.clamp(index, 0, itemIds.length - 1);
        var itemId = itemIds[index];

        var minRank = faction.itemRanks.find(x => x.itemId == itemId);
        if (minRank && minRank.rank > rank.rank) return notifs.error(player, `Доступно с ранга ${factions.getRank(faction, minRank.rank).name}`, header);

        var gunName = inventory.getInventoryItem(itemId).name;
        var guns = inventory.getArrayByItemId(player, itemId);

        if (guns.length > 0) return notifs.error(player, `Вы уже имеете ${gunName}`, header);

        inventory.fullDeleteItemsByParams(itemId, ["faction", "owner"], [character.factionId, character.id]);
        var params = {
            weaponHash: mp.joaat(weaponIds[index]),
            ammo: 0,
            // faction: character.factionId,
            // owner: character.id
        };

        inventory.addItem(player, itemId, params, (e) => {
            if (e) return notifs.error(player, e, header);

            notifs.success(player, `Вам выдано оружие ${gunName}`, header);
            factions.setAmmo(faction, faction.ammo - army.gunAmmo);
            logger.log(`Взял оружие ${gunName} со склада ${faction.name}`, `faction`, player);
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
        var rank = factions.getRankById(faction, character.factionRank);
        var header = `Склад ${faction.name}`;

        var itemIds = [37, 38, 40, 39];
        index = Math.clamp(index, 0, itemIds.length - 1);
        if (faction.ammo < army.ammoAmmo * ammo) return notifs.error(player, `Недостаточно боеприпасов`, header);

        var minRank = faction.itemRanks.find(x => x.itemId == itemIds[index]);
        if (minRank && minRank.rank > rank.rank) return notifs.error(player, `Доступно с ранга ${factions.getRank(faction, minRank.rank).name}`, header);

        // inventory.fullDeleteItemsByParams(itemIds[index], ["faction", "owner"], [character.factionId, character.id]);
        var params = {
            count: ammo,
            // faction: character.factionId,
            // owner: character.id
        };
        inventory.addItem(player, itemIds[index], params, (e) => {
            if (e) return notifs.error(player, e, header);

            notifs.success(player, `Вам выданы ${inventory.getInventoryItem(itemIds[index]).name} (${ammo} ед.)`, header);
            factions.setAmmo(faction, faction.ammo - army.ammoAmmo * ammo);
        });
    },
    "army.capture.start": (player) => {
        army.startCapture(player);
    },
    "player.faction.changed": (player, oldVal) => {
        if (!factions.isArmyFaction(oldVal)) return;
        if (!army.inWar(player)) return;

        player.call(`army.capture.stop`);
        delete player.armyTeamId;
    },
    "playerDeath": (player, reason, killer) => {
        // killer = player; // for tests
        if (!killer || !killer.character) return;
        if (!player.character) return;
        if (!player.character.factionId) return;
        if (!factions.isArmyFaction(player.character.factionId)) return;
        if (!army.inWar(player)) return;
        if (player.getVariable("knocked")) return;
        if (!killer.character.factionId) return;
        if (!factions.isArmyFaction(killer.character.factionId)) return;
        if (!army.inWar(killer)) return;
        if (killer.armyTeamId == player.armyTeamId) return;

        army.giveScore(killer, player, reason);
    },
    "playerEnterColshape": (player, shape) => {
        if (!player.character) return;

        if (shape.isArmyFuelStation) {
            player.call('army.fuelstation.enter', [true]);
        }
    },
    "playerExitColshape": (player, shape) => {
        if (!player.character) return;

        if (shape.isArmyFuelStation) {
            player.call('army.fuelstation.enter', [false]);
        }
    },
    "army.fuelstation.fill": (player) => {
        let vehicle = player.vehicle;
        if (!vehicle) return notifs.error(player, 'Вы не в транспорте')
        if (vehicle.fuel >= vehicle.properties.maxFuel) return notifs.warning(player, 'Автомобиль полностью заправлен');
        if (vehicle.key != 'faction' || !factions.isArmyFaction(vehicle.owner)) return notifs.warning(player, 'Этот автомобиль нельзя заправить');

        let toFill = parseInt(vehicle.properties.maxFuel - vehicle.fuel);
        if (army.fuel < toFill) return notifs.warning(player, 'На заправке недостаточно топлива');
        vehicles.setFuel(vehicle, vehicle.properties.maxFuel);
        army.removeFuel(toFill);
        notifs.success(player, `Автомобиль заправлен на ${toFill} л.`);
    },
    "economy.done": () => {
        army.createFuelStation();
    }
}
