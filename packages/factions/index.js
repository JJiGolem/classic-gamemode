"use strict";
var notifs = require('../notifications');

module.exports = {
    // Организации
    factions: [],
    // Маркеры организаций
    markers: [],
    // Блипы организаций
    blips: [],
    // Маркеры складов организаций
    warehouses: [],
    // Маркеры выдачи предметов организаций
    storages: [],
    // Склад нескончаемых боеприпасов (навешен blip)
    ammoWarehouse: null,
    // Склад нескончаемых медикаментов (навешен blip)
    medicinesWarehouse: null,
    // Кол-во боеприпасов в ящике
    ammoBox: 500,
    // Кол-во медикаментов в ящике
    medicinesBox: 500,
    // Белый лист организаций, которые могут пополнять склады
    whiteListWarehouse: {
        "ammo": {
            2: [4],
            3: [4],
            6: [2, 3, 6]
        },
        "medicines": {
            5: [2, 3, 4, 5, 6]
        }
    },

    async init() {
        await this.loadFactionsFromDB();
        this.initFactionMarkers();
        this.createAmmoWarehouseMarker();
        this.createMedicinesWarehouseMarker();
    },
    async loadFactionsFromDB() {
        var dbFactons = await db.Models.Faction.findAll({
            include: [{
                model: db.Models.FactionRank,
                as: "ranks"
            }]
        });
        this.factions = dbFactons;
        console.log(`[FACTIONS] Организации загужены (${dbFactons.length} шт.)`);
    },
    initFactionMarkers() {
        for (var i = 0; i < this.factions.length; i++) {
            var faction = this.factions[i];
            this.createFactionMarker(faction);
            this.createWarehouseMarker(faction);
            this.createStorageMarker(faction);
        }
    },
    createFactionMarker(faction) {
        var pos = new mp.Vector3(faction.x, faction.y, faction.z - 1);

        this.markers.push(mp.markers.new(1, pos, 0.5, {
            color: [255, 187, 0, 70]
        }));
        this.blips.push(mp.blips.new(faction.blip, pos, {
            color: faction.blipColor,
            name: faction.name,
            shortRange: 10,
            scale: 1
        }));
    },
    createWarehouseMarker(faction) {
        if (!faction.wX) return;
        var pos = new mp.Vector3(faction.wX, faction.wY, faction.wZ - 1);

        var warehouse = mp.markers.new(1, pos, 0.5, {
            color: [0, 187, 255, 70]
        });
        this.warehouses.push(warehouse);

        var colshape = mp.colshapes.newSphere(pos.x, pos.y, pos.z, 1.5);
        colshape.onEnter = (player) => {
            var boxType = "";
            if (player.hasAttachment("ammoBox")) {
                boxType = "ammo";
            } else if (player.hasAttachment("medicinesBox")) {
                boxType = "medicines";
            } else return;

            if (!this.canFillWarehouse(player, boxType, faction))
                return notifs.error(player, `Нет прав для пополнения`, `Склад ${faction.name}`);

            player.call("factions.insideFactionWarehouse", [true, boxType]);
            player.insideFactionWarehouse = faction;
        };
        colshape.onExit = (player) => {
            player.call("factions.insideFactionWarehouse", [false]);
            delete player.insideFactionWarehouse;
        };
        warehouse.colshape = colshape;
    },
    createStorageMarker(faction) {
        var pos = new mp.Vector3(faction.sX, faction.sY, faction.sZ - 1);

        var storage = mp.markers.new(1, pos, 0.5, {
            color: [0, 187, 255, 70]
        });
        this.storages.push(storage);

        var colshape = mp.colshapes.newSphere(pos.x, pos.y, pos.z, 1.5);
        colshape.onEnter = (player) => {
            console.log(`storage onEnter: ${player.name} ${faction.name}`)
        };
        colshape.onExit = (player) => {
            console.log(`storage onExit: ${player.name} ${faction.name}`)
        };
        storage.colshape = colshape;
    },
    createAmmoWarehouseMarker() {
        var pos = new mp.Vector3(-257.62, -339.59, 29.95 - 2);

        this.ammoWarehouse = mp.markers.new(1, pos, 2, {
            color: [255, 187, 0, 100]
        });
        this.ammoWarehouse.blip = mp.blips.new(473, pos, {
            color: 1,
            name: "Боеприпасы",
            shortRange: 10,
            scale: 1
        });
        var colshape = mp.colshapes.newSphere(pos.x, pos.y, pos.z, 2.5);
        colshape.onEnter = (player) => {
            if (!this.isArmyFaction(player.character.factionId)) return notifs.error(player, `Нет доступа`, `Склад боеприпасов`);
            player.call("factions.insideWarehouse", [true, "ammo"]);
            player.insideWarehouse = true;
        };
        colshape.onExit = (player) => {
            player.call("factions.insideWarehouse", [false]);
            delete player.insideWarehouse;
        };
    },
    createMedicinesWarehouseMarker() {
        var pos = new mp.Vector3(-255.80, -342.41, 29.88 - 2);

        this.ammoWarehouse = mp.markers.new(1, pos, 2, {
            color: [255, 187, 0, 100]
        });
        this.ammoWarehouse.blip = mp.blips.new(153, pos, {
            color: 1,
            name: "Медикаменты",
            shortRange: 10,
            scale: 1
        });
        var colshape = mp.colshapes.newSphere(pos.x, pos.y, pos.z, 2.5);
        colshape.onEnter = (player) => {
            if (!this.isHospitalFaction(player.character.factionId)) return notifs.error(player, `Нет доступа`, `Склад медикаментов`);
            player.call("factions.insideWarehouse", [true, "medicines"]);
            player.insideWarehouse = true;
        };
        colshape.onExit = (player) => {
            player.call("factions.insideWarehouse", [false]);
            delete player.insideWarehouse;
        };
    },
    getFaction(id) {
        return this.factions[id - 1];
    },
    getMarker(id) {
        return this.markers[id - 1];
    },
    getWarehouse(id) {
        return this.warehouses[id - 1];
    },
    getStorage(id) {
        return this.storages[id - 1];
    },
    getBlip(id) {
        return this.blips[id - 1];
    },
    getRank(factionId, rank) {
        return this.getFaction(factionId).ranks[rank - 1];
    },
    getRankById(factionId, rankId) {
        var ranks = this.getFaction(factionId).ranks;
        for (var i = 0; i < ranks.length; i++) {
            if (ranks[i].id == rankId) return ranks[i];
        }
        return null;
    },
    getMinRank(faction) {
        if (typeof faction == 'number') faction = this.getFaction(faction);
        return faction.ranks[0];
    },
    getMaxRank(faction) {
        if (typeof faction == 'number') faction = this.getFaction(faction);
        return faction.ranks[faction.ranks.length - 1];
    },
    setLeader(faction, character) {
        if (typeof faction == 'number') faction = this.getFaction(faction);

        character.factionId = faction.id;
        character.factionRank = this.getMaxRank(faction).id;
        character.save();
    },
    setBlip(faction, type, color) {
        if (typeof faction == 'number') faction = this.getFaction(faction);
        var blip = this.getBlip(faction.id);
        blip.model = type;
        blip.color = color;
        faction.blip = type;
        faction.blipColor = color;
        faction.save();
    },
    addMember(faction, character) {
        if (typeof faction == 'number') faction = this.getFaction(faction);
        character.factionId = faction.id;
        character.factionRank = this.getMinRank(faction).id;
        character.save();
    },
    deleteMember(faction, character) {
        if (typeof faction == 'number') faction = this.getFaction(faction);
        character.factionId = null;
        character.factionRank = null;
        character.save();
    },
    setRank(character, rank) {
        if (typeof rank == 'number') rank = this.getRank(character.factionId, rank);

        character.factionRank = rank.id;
        character.save();
    },
    isGovernmentFaction(faction) {
        if (typeof faction == 'number') faction = this.getFaction(faction);
        return faction.id == 1;
    },
    isPoliceFaction(faction) {
        if (typeof faction == 'number') faction = this.getFaction(faction);
        return faction.id == 2 || faction.id == 3;
    },
    isFibFaction(faction) {
        if (typeof faction == 'number') faction = this.getFaction(faction);
        return faction.id == 4;
    },
    isHospitalFaction(faction) {
        if (typeof faction == 'number') faction = this.getFaction(faction);
        return faction.id == 5;
    },
    isArmyFaction(faction) {
        if (typeof faction == 'number') faction = this.getFaction(faction);
        return faction.id == 6;
    },
    isNewsFaction(faction) {
        if (typeof faction == 'number') faction = this.getFaction(faction);
        return faction.id == 7;
    },
    isStateFaction(faction) {
        if (typeof faction == 'number') faction = this.getFaction(faction);
        return faction.id >= 1 && faction.id <= 7;
    },
    takeBox(player, type) {
        var header = "";
        if (type == 'ammo') {
            header = "Склад боеприпасов";
            if (!this.isArmyFaction(player.character.factionId)) return notifs.error(player, `Нет доступа`, header);
        } else if (type == 'medicines') {
            header = "Склад медикаментов";
            if (!this.isHospitalFaction(player.character.factionId)) return notifs.error(player, `Нет доступа`, header);
        }
        if (!player.insideWarehouse) return notifs.error(player, `Вы далеко`, header);
        var haveBox = player.hasAttachment("ammoBox") || player.hasAttachment("medicinesBox");
        if (haveBox) return notifs.error(player, `[S] Нельзя нести больше`, header);
        player.addAttachment(type + "Box");
    },
    putBox(player) {
        var faction = player.insideFactionWarehouse;
        if (!faction) return notifs.error(player, `Вы далеко`, `Склад организации`);
        if (player.hasAttachment("ammoBox")) {
            faction.ammo += this.ammoBox;
            faction.save();
            player.addAttachment("ammoBox", true);
            notifs.info(player, `Боеприпасы: ${faction.ammo} из ${faction.maxAmmo} ед.`, `Склад ${faction.name}`);
            if (faction.ammo == faction.maxAmmo) notifs.success(player, `Склад заполнен`, `Склад ${faction.name}`);
        } else if (player.hasAttachment("medicinesBox")) {
            faction.medicines += this.medicinesBox;
            faction.save();
            player.addAttachment("medicinesBox", true);
            notifs.info(player, `Медикаменты: ${faction.medicines} из ${faction.maxMedicines} ед.`, `Склад ${faction.name}`);
            if (faction.medicines == faction.maxMedicines) notifs.success(player, `Склад заполнен`, `Склад ${faction.name}`);
        } else return;
    },
    canFillWarehouse(player, boxType, faction) {
        if (!this.whiteListWarehouse[boxType][player.character.factionId]) return false;
        return this.whiteListWarehouse[boxType][player.character.factionId].includes(faction.id)
    },
    sayRadio(player, text) {
        var factionId = player.character.factionId;
        if (!factionId) return notifs.error(player, `Вы не состоите в организации`, `Рация`);
        if (!this.isStateFaction(factionId)) return notifs.error(player, `Вы не в гос. структуре`, `Рация`);

        var rank = this.getRankById(factionId, player.character.factionRank);
        mp.players.forEach((rec) => {
            if (rec.character && rec.character.factionId == factionId)
                rec.call('chat.action.walkietalkie', [player.name, player.id, rank.name, text]);
        });
    },
};
