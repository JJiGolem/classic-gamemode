"use strict";

let factions = call('factions');

module.exports = {
    // Зоны гетто
    bandZones: [],

    init() {
        this.loadBandZonesFromDB();
    },

    async loadBandZonesFromDB() {
        var dbZones = await db.Models.BandZone.findAll();
        this.bandZones = dbZones;
        console.log(`[BANDS] Зоны гетто загружены (${dbZones.length} шт.)`)
    },
    convertToClientBandZones() {
        return this.bandZones.map(x => x.dataValues);
    },
    getZone(id) {
        return this.bandZones[id - 1];
    },
    isInBandZones(pos) {
        var first = this.bandZones[0];
        var last = this.bandZones[this.bandZones.length - 1];

        return pos.x > first.x - 100 && pos.x < last.x + 100 && pos.y < first.y + 100 && pos.y > last.y - 100;
    },
    isInBandZone(pos, zone) {
        return pos.x > zone.x - 100 && pos.x < zone.x + 100 && pos.y < zone.y + 100 && pos.y > zone.y - 100;
    },
    getZoneByPos(pos) {
        if (!this.isInBandZones(pos)) return null;

        for (var i = 0; i < this.bandZones.length; i++) {
            var zone = this.bandZones[i];
            if (this.isInBandZone(pos, zone)) return zone;
        }

        return null;
    },
    setBandZoneOwner(zone, factionId) {
        if (typeof zone == 'number') zone = this.getZone(zone);
        if (!factions.isBandFaction(factionId)) return;

        zone.factionId = factionId;
        zone.save();
        mp.players.forEach(rec => {
            if (!rec.character) return;
            rec.call(`bands.bandZones.set`, [zone.id, factionId]);
        });
    },
};
