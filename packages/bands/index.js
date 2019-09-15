"use strict";

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
};
