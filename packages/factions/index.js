"use strict";

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

    async init() {
        await this.loadFactionsFromDB();
        this.initFactionMarkers();
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
            scale: 0.7
        }));
    },
    createWarehouseMarker(faction) {
        var pos = new mp.Vector3(faction.wX, faction.wY, faction.wZ - 1);

        this.warehouses.push(mp.markers.new(1, pos, 0.5, {
            color: [0, 187, 255, 70]
        }));

        var colshape = mp.colshapes.newSphere(pos.x, pos.y, pos.z, 1.5);
        colshape.onEnter = (player) => {
            console.log(`warehouse onEnter: ${player.name} ${faction.name}`)
        };
        colshape.onExit = (player) => {
            console.log(`warehouse onExit: ${player.name} ${faction.name}`)
        };
    },
    createStorageMarker(faction) {
        var pos = new mp.Vector3(faction.sX, faction.sY, faction.sZ - 1);
        this.storages.push(mp.markers.new(1, pos, 0.5, {
            color: [0, 187, 255, 70]
        }));

        var colshape = mp.colshapes.newSphere(pos.x, pos.y, pos.z, 1.5);
        colshape.onEnter = (player) => {
            console.log(`storage onEnter: ${player.name} ${faction.name}`)
        };
        colshape.onExit = (player) => {
            console.log(`storage onExit: ${player.name} ${faction.name}`)
        };
    },
    getFaction(id) {
        return this.factions[id - 1];
    },
    getBlip(id) {
        return this.blips[id - 1];
    },
    getRank(factionId, rank) {
        return this.getFaction(factionId).ranks[rank - 1];
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
        if (typeof faction == 'number') faction = this.faction[faction - 1];

        character.factionId = faction.id;
        character.factionRank = this.getMaxRank(faction).id;
        character.save();
    },
    setBlip(faction, type, color) {
        var blip = this.getBlip(faction.id);
        blip.model = type;
        blip.color = color;
        faction.blip = type;
        faction.blipColor = color;
        faction.save();
    },
    addMember(faction, character) {
        if (typeof faction == 'number') faction = this.faction[faction - 1];
        character.factionId = faction.id;
        character.factionRank = this.getMinRank(faction).id;
        character.save();
    },
    deleteMember(faction, character) {
        if (typeof faction == 'number') faction = this.faction[faction - 1];
        character.factionId = null;
        character.factionRank = null;
        character.save();
    },
    setRank(character, rank) {
        if (typeof rank == 'number') rank = this.getRank(character.factionId, rank);

        character.factionRank = rank.id;
        character.save();
    },
};
