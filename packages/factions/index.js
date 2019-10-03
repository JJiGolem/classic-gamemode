"use strict";
var bands = call('bands');
var inventory = call('inventory');
var mafia = call('mafia');
var money = require('../money')
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
    // Маркеры шкафов организаций
    holders: [],
    // Склад нескончаемых боеприпасов (навешен blip)
    ammoWarehouse: null,
    // Склад нескончаемых медикаментов (навешен blip)
    medicinesWarehouse: null,
    // Кол-во боеприпасов в ящике
    ammoBox: 500,
    // Кол-во медикаментов в ящике
    medicinesBox: 500,
    // TODO: Добавить адекватные модели авто
    // Модели авто, в которые можно грузить боеприпасы
    ammoVehModels: ["barracks", "barracks3", "moonbeam", "youga2", "insurgent2"],
    // Модели авто, в которые можно грузить медикаменты
    medicinesVehModels: ["granger", "fbi2"],
    // Макс. кол-во боеприпасов в авто
    ammoVehMax: 3000,
    // Макс. кол-во медикаментов в авто
    medicinesVehMax: 3000,
    // Белый лист организаций, которые могут пополнять склады
    whiteListWarehouse: {
        "ammo": {
            2: [4],
            3: [4],
            6: [2, 3, 6],
            // банды
            8: [8],
            9: [9],
            10: [10],
            11: [11],
            // мафии
            12: [8, 9, 10, 11, 12],
            13: [8, 9, 10, 11, 13],
            14: [8, 9, 10, 11, 14],
        },
        "medicines": {
            5: [2, 3, 4, 5, 6]
        }
    },
    // Кол-во минут онлайна, необходимых для получения ЗП
    payMins: 15,

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
            this.createHolderMarker(faction);
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

        var colshape = mp.colshapes.newSphere(pos.x, pos.y, pos.z, 1.5);
        colshape.onEnter = (player) => {
            var boxType = "";
            if (player.hasAttachment("ammoBox")) {
                boxType = "ammo";
            } else if (player.hasAttachment("medicinesBox")) {
                boxType = "medicines";
            } else if (this.isBandFaction(player.character.factionId) && this.isArmyFaction(faction)) {
                if (faction.ammo < this.ammoBox) return notifs.error(player, `Склад пустой`, `Склад ${faction.name}`);
                player.addAttachment("ammoBox");
                this.setAmmo(faction, faction.ammo - this.ammoBox);
                return;
            }

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

        var pos = warehouse.position;
        pos.z += 2;
        warehouse.label = mp.labels.new(`${faction.ammo} из ${faction.maxAmmo}\n${faction.medicines} из ${faction.maxMedicines}`,
            pos, {
                los: true,
                drawDistanse: 10,
            });
        this.warehouses.push(warehouse);
    },
    createStorageMarker(faction) {
        var pos = new mp.Vector3(faction.sX, faction.sY, faction.sZ - 1);

        var storage = mp.markers.new(1, pos, 0.5, {
            color: [0, 187, 255, 70]
        });
        this.storages.push(storage);

        var colshape = mp.colshapes.newSphere(pos.x, pos.y, pos.z, 1.5);
        colshape.onEnter = (player) => {
            if (player.character.factionId != faction.id) return notifs.error(player, `Отказано в доступе`, faction.name);

            if (this.isBandFaction(faction.id)) bands.sendStorageInfo(player);
            else if (this.isMafiaFaction(faction.id)) mafia.sendStorageInfo(player);

            player.call("factions.storage.showMenu", [faction.id]);
            player.insideFactionWarehouse = faction.id;
        };
        colshape.onExit = (player) => {
            player.call("selectMenu.hide");
            delete player.insideFactionWarehouse;
        };
        storage.colshape = colshape;
    },
    createHolderMarker(faction) {
        var pos = new mp.Vector3(faction.hX, faction.hY, faction.hZ - 1);

        var holder = mp.markers.new(1, pos, 0.5, {
            color: [0, 187, 255, 70]
        });
        holder.inventory = {
            items: {}, // предметов игроков в шкафе
        };
        this.holders.push(holder);

        var colshape = mp.colshapes.newSphere(pos.x, pos.y, pos.z, 1.5);
        colshape.onEnter = (player) => {
            if (player.character.factionId != faction.id) return notifs.error(player, `Отказано в доступе`, faction.name);

            mp.events.call("faction.holder.items.request", player, faction);
        };
        colshape.onExit = (player) => {
            mp.events.call("faction.holder.items.clear", player, faction);
        };
        holder.colshape = colshape;
    },
    createAmmoWarehouseMarker() {
        var pos = new mp.Vector3(211.51, -3091.53, 7.01 - 1);

        this.ammoWarehouse = mp.markers.new(1, pos, 0.5, {
            color: [255, 187, 0, 100]
        });
        this.ammoWarehouse.blip = mp.blips.new(473, pos, {
            color: 1,
            name: "Боеприпасы",
            shortRange: 10,
            scale: 1
        });
        var colshape = mp.colshapes.newSphere(pos.x, pos.y, pos.z, 1.5);
        colshape.onEnter = (player) => {
            if (!this.isArmyFaction(player.character.factionId) &&
                !this.isMafiaFaction(player.character.factionId)) return notifs.error(player, `Нет доступа`, `Склад боеприпасов`);
            player.call("factions.insideWarehouse", [true, "ammo"]);
            player.insideWarehouse = true;
        };
        colshape.onExit = (player) => {
            player.call("factions.insideWarehouse", [false]);
            delete player.insideWarehouse;
        };
    },
    createMedicinesWarehouseMarker() {
        var pos = new mp.Vector3(3608, 3720.03, 29.69 - 2);

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
    getHolder(id) {
        return this.holders[id - 1];
    },
    getBlip(id) {
        return this.blips[id - 1];
    },
    getFactionName(player) {
        if (!player.character.factionId) return null;
        return this.getFaction(player.character.factionId).name;
    },
    getRank(faction, rank) {
        if (typeof faction == 'number') faction = this.getFaction(faction);
        return faction.ranks[rank - 1];
    },
    getRankById(faction, rankId) {
        if (typeof faction == 'number') faction = this.getFaction(faction);
        var ranks = faction.ranks;
        for (var i = 0; i < ranks.length; i++) {
            if (ranks[i].id == rankId) return ranks[i];
        }
        return null;
    },
    getRankName(player) {
        if (!player.character.factionId) return null;
        return this.getRankById(player.character.factionId, player.character.factionRank).name;
    },
    getMinRank(faction) {
        if (typeof faction == 'number') faction = this.getFaction(faction);
        return faction.ranks[0];
    },
    getMaxRank(faction) {
        if (typeof faction == 'number') faction = this.getFaction(faction);
        return faction.ranks[faction.ranks.length - 1];
    },
    getRankNames(faction) {
        if (typeof faction == 'number') faction = this.getFaction(faction);
        var names = [];
        for (var i = 0; i < faction.ranks.length; i++) {
            names.push(faction.ranks[i].name);
        }
        return names;
    },
    setLeader(faction, player) {
        if (typeof faction == 'number') faction = this.getFaction(faction);
        var character = player.character;
        character.factionId = faction.id;
        character.factionRank = this.getMaxRank(faction).id;
        character.save();

        player.setVariable("factionId", character.factionId);
        player.call(`factions.faction.set`, [character.factionId]);
        // player.call(`mapCase.init`, [player.name, faction.id]);
        if (this.isPoliceFaction(faction)) mp.events.call(`mapCase.pd.init`, player);
        else if (this.isFibFaction(faction)) mp.events.call(`mapCase.fib.init`, player);
        else if (this.isHospitalFaction(faction)) mp.events.call(`mapCase.ems.init`, player);
        else if (this.isNewsFaction(faction)) mp.events.call(`mapCase.news.init`, player);

        mp.events.call(`player.faction.changed`, player);
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
    addMember(faction, player) {
        if (typeof faction == 'number') faction = this.getFaction(faction);
        var character = player.character;
        if (character.factionId) this.fullDeleteItems(character.id, character.factionId);
        character.factionId = faction.id;
        character.factionRank = this.getMinRank(faction).id;
        character.save();

        player.setVariable("factionId", character.factionId);
        player.call(`factions.faction.set`, [character.factionId]);
        // player.call(`mapCase.init`, [player.name, faction.id]);
        if (this.isPoliceFaction(faction)) mp.events.call(`mapCase.pd.init`, player);
        else if (this.isFibFaction(faction)) mp.events.call(`mapCase.fib.init`, player);
        else if (this.isHospitalFaction(faction)) mp.events.call(`mapCase.ems.init`, player);
        else if (this.isNewsFaction(faction)) mp.events.call(`mapCase.news.init`, player);

        mp.events.call(`player.faction.changed`, player);
        if (player.character.job) mp.events.call(`jobs.leave`, player);
    },
    deleteMember(player) {
        var character = player.character;
        if (this.isPoliceFaction(character.factionId)) require('../mapCase').removePoliceMember(player);
        else if (this.isFibFaction(character.factionId)) require('../mapCase').removeFibMember(player);
        else if (this.isHospitalFaction(character.factionId)) require('../mapCase').removeHospitalMember(player);
        else if (this.isNewsFaction(character.factionId)) require('../mapCase').removeNewsMember(player);
        this.fullDeleteItems(character.id, character.factionId);
        character.factionId = null;
        character.factionRank = null;
        character.save();

        player.setVariable("factionId", character.factionId);
        player.call(`factions.faction.set`, [null]);
        player.call(`mapCase.enable`, [false]);

        mp.events.call(`player.faction.changed`, player);
    },
    getMembers(player) {
        var members = [];
        mp.players.forEach((rec) => {
            if (!rec.character) return;
            if (rec.character.factionId != player.character.factionId) return;
            members.push(rec);
        });
        return members;
    },
    setRank(player, rank) {
        var character = player.character;
        if (typeof rank == 'number') rank = this.getRank(character.factionId, rank);

        character.factionRank = rank.id;
        character.save();

        mp.events.call("player.factionRank.changed", player);

        var type = "";
        if (this.isPoliceFaction(character.factionId)) type = "pd";
        else if (this.isFibFaction(character.factionId)) type = "fib";
        else if (this.isHospitalFaction(character.factionId)) type = "ems";
        else if (this.isNewsFaction(character.factionId)) type = "news";
        if (!type) return;

        var rank = this.getRankById(character.factionId, character.factionRank).rank;
        mp.players.forEach((rec) => {
            if (!rec.character) return;
            if (rec.character.factionId != character.factionId) return;

            rec.call(`mapCase.${type}.members.rank.set`, [character.id, rank]);
        });
    },
    isGovernmentFaction(faction) {
        if (typeof faction == 'number') faction = this.getFaction(faction);
        return faction && faction.id == 1;
    },
    isPoliceFaction(faction) {
        if (typeof faction == 'number') faction = this.getFaction(faction);
        return faction && (faction.id == 2 || faction.id == 3);
    },
    isFibFaction(faction) {
        if (typeof faction == 'number') faction = this.getFaction(faction);
        return faction && faction.id == 4;
    },
    isHospitalFaction(faction) {
        if (typeof faction == 'number') faction = this.getFaction(faction);
        return faction && faction.id == 5;
    },
    isArmyFaction(faction) {
        if (typeof faction == 'number') faction = this.getFaction(faction);
        return faction && faction.id == 6;
    },
    isNewsFaction(faction) {
        if (typeof faction == 'number') faction = this.getFaction(faction);
        return faction && faction.id == 7;
    },
    isStateFaction(faction) {
        if (typeof faction == 'number') faction = this.getFaction(faction);
        return faction && (faction.id >= 1 && faction.id <= 7);
    },
    isBandFaction(faction) {
        if (typeof faction == 'number') faction = this.getFaction(faction);
        return faction && (faction.id >= 8 && faction.id <= 11);
    },
    isMafiaFaction(faction) {
        if (typeof faction == 'number') faction = this.getFaction(faction);
        return faction && (faction.id >= 12 && faction.id <= 14);
    },
    getBandFactions() {
        return this.factions.filter(x => x.id >= 8 && x.id <= 11);
    },
    getMafiaFactions() {
        return this.factions.filter(x => x.id >= 12 && x.id <= 14);
    },
    takeBox(player, type) {
        var header = "";
        if (type == 'ammo') {
            header = "Склад боеприпасов";
            if (!this.isArmyFaction(player.character.factionId) &&
                !this.isMafiaFaction(player.character.factionId)) return notifs.error(player, `Нет доступа`, header);
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
            this.setAmmo(faction, faction.ammo + this.ammoBox);
            player.addAttachment("ammoBox", true);
            notifs.info(player, `Боеприпасы: ${faction.ammo} из ${faction.maxAmmo} ед.`, `Склад ${faction.name}`);
            if (faction.ammo == faction.maxAmmo) notifs.warning(player, `Склад заполнен`, `Склад ${faction.name}`);
        } else if (player.hasAttachment("medicinesBox")) {
            faction.medicines += this.medicinesBox;
            faction.save();
            player.addAttachment("medicinesBox", true);
            notifs.info(player, `Медикаменты: ${faction.medicines} из ${faction.maxMedicines} ед.`, `Склад ${faction.name}`);
            if (faction.medicines == faction.maxMedicines) notifs.warning(player, `Склад заполнен`, `Склад ${faction.name}`);
        } else return;
    },
    canFillWarehouse(player, boxType, faction) {
        if (!this.whiteListWarehouse[boxType]) return false;
        if (!this.whiteListWarehouse[boxType][player.character.factionId]) return false;
        return this.whiteListWarehouse[boxType][player.character.factionId].includes(faction.id)
    },
    canInvite(player) {
        if (!player.character.factionId) return false;
        var maxId = this.getMaxRank(player.character.factionId).id;
        return maxId - player.character.factionRank <= 1;
    },
    canUval(player) {
        if (!player.character.factionId) return false;
        var maxId = this.getMaxRank(player.character.factionId).id;
        return maxId - player.character.factionRank <= 2;
    },
    canGiveRank(player) {
        if (!player.character.factionId) return false;
        var maxId = this.getMaxRank(player.character.factionId).id;
        return maxId - player.character.factionRank <= 1;
    },
    sayRadio(player, text) {
        var factionId = player.character.factionId;
        if (!factionId) return notifs.error(player, `Вы не состоите в организации`, `Рация`);
        if (!this.isStateFaction(factionId)) return notifs.error(player, `Вы не в гос. структуре`, `Рация`);

        var rank = this.getRankById(factionId, player.character.factionRank);
        mp.players.forEach((rec) => {
            if (!rec.character) return;
            if (rec.character.factionId != factionId) return;

            rec.call('chat.action.walkietalkie', [player.name, player.id, rank.name, text]);
        });
    },
    pay(player) {
        if (!player.character.factionId) return;

        var faction = this.getFaction(player.character.factionId);
        var pay = this.getRankById(faction, player.character.factionRank).pay;

        var minutes = parseInt((Date.now() - player.authTime) / 1000 / 60 % 60);
        if (minutes < this.payMins) return notifs.warning(player, `Зарплата не получена из-за низкой активности`, faction.name);

        if (this.isBandFaction(faction) || this.isMafiaFaction(faction)) {
            if (faction.cash < pay) return notifs.error(player, `В общаке недостаточно средств для получения зарплаты`, faction.name);

            // TODO: не многовато запросов в БД получится?
            faction.cash -= pay;
            faction.save();
        }

        money.addMoney(player, pay, (res) => {
            if (!res) return console.log(`[factions] Ошибка выдачи ЗП для ${player.name}`);
            notifs.info(player, `Зарплата: $${pay}`, faction.name);
        });
    },
    fullDeleteItems(owner, faction) {
        if (typeof faction == 'number') faction = this.getFaction(faction);
        inventory.fullDeleteItemsByParams(null, ["owner", "faction"], [owner, faction.id]);
    },
    setAmmo(faction, count) {
        faction.ammo = count;
        faction.save();
        this.updateWarehosueLabel(faction);
    },
    setMedicines(faction, count) {
        faction.medicines = count;
        faction.save();
        this.updateWarehosueLabel(faction);
    },
    setMaxAmmo(faction, count) {
        faction.maxAmmo = count;
        faction.save();
        this.updateWarehosueLabel(faction);
    },
    setMaxMedicines(faction, count) {
        faction.maxMedicines = count;
        faction.save();
        this.updateWarehosueLabel(faction);
    },
    updateWarehosueLabel(faction) {
        var text = `${faction.ammo} из ${faction.maxAmmo}\n${faction.medicines} из ${faction.maxMedicines}`;
        var label = this.getWarehouse(faction.id).label;
        label.text = text;
    },
    addCash(faction, count) {
        if (typeof faction == 'number') faction = this.getFaction(faction);

        faction.cash += count;
        faction.save();
    },
    destroyHolderItems(player) {
        var count = 0;
        this.holders.forEach(holder => {
            var items = holder.inventory.items[player.character.id];
            if (!items) return;
            count += items.length;
            items.forEach(item => item.destroy());
            delete holder.inventory.items[player.character.id];
        });

        if (!count) return;
        notifs.warning(player, `Предмет из шкафа потеряны (${count} шт.)`, `Организация`);
    },
};
