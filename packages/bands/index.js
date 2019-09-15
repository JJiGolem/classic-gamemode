"use strict";

let factions;
let notifs;

module.exports = {
    // Зоны гетто
    bandZones: [],
    // Мин. ранг, который может каптить
    captureRank: 8,
    // Зоны, на которых происходит капт
    wars: {},
    // Время захвата территории (ms)
    warTime: 10000,
    // Промежуток часов, в который можно начать захват
    captureInterval: [13, 23],

    init() {
        factions = call('factions');
        notifs = call('notifications');

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
    startCapture(player) {
        var header = `Захват территории`;
        var out = (text) => {
            notifs.error(player, text, header)
        };
        var faction = factions.getFaction(player.character.factionId);
        if (!factions.isBandFaction(faction)) return out(`Вы не член группировки`);
        var rank = factions.getRank(faction, this.captureRank);
        if (player.character.factionRank < rank.id) return out(`Доступно с ранга ${rank.name}`);
        var zone = this.getZoneByPos(player.position);
        if (!zone) return out(`Вы не в гетто`);
        if (zone.factionId == faction.id) return out(`Территория уже под контролем ${faction.name}`);
        if (this.wars[zone.id]) return out(`На данной территории уже идет война`);
        if (this.inWar(faction.id)) return out(`Ваша банда уже участвует в войне`);

        var hours = new Date().getHours();
        if (hours < this.captureInterval[0] || hours > this.captureInterval[1])
            return out(`Захват доступен с ${this.captureInterval[0]} до ${this.captureInterval[1]} ч.`);

        var enemyFaction = factions.getFaction(zone.factionId);
        this.wars[zone.id] = {
            band: {
                id: faction.id,
                score: 0,
            },
            enemyBand: {
                id: zone.factionId,
                score: 0,
            },
            startTime: Date.now()
        };
        setTimeout(() => {
            this.stopCapture(zone);
        }, this.warTime);
        mp.players.forEach(rec => {
            if (!rec.character) return;
            var factionId = rec.character.factionId;
            rec.call(`bands.bandZones.flash`, [zone.id, true]);
            if (!factionId) return;
            if (!factions.isBandFaction(factionId)) return;
            if (factionId == faction.id) {
                rec.call(`bands.capture.start`, [factionId, zone.factionId, this.warTime / 1000]);
                notifs.success(rec, `Ваша банда напала на ${enemyFaction.name}`, header);
            } else if (factionId == zone.factionId) {
                rec.call(`bands.capture.start`, [zone.factionId, factionId, this.warTime / 1000]);
                notifs.info(rec, `На вашу территорию напала банда ${faction.name}`, header);
            }
        });
    },
    stopCapture(zone) {
        if (typeof zone == 'number') zone = this.getZone(zone);
        if (!this.wars[zone.id]) return;

        var war = this.wars[zone.id];
        var winBandId = war.band.id;
        var loseBandId = war.enemyBand.id;
        if (war.enemyBand.score > war.band.score) {
            winBandId = war.enemyBand.id;
            loseBandId = war.band.id;
        }

        var header = `Захват территории`;
        mp.players.forEach(rec => {
            if (!rec.character) return;
            var factionId = rec.character.factionId;
            if (!factionId) return;
            if (!factions.isBandFaction(factionId)) return;
            if (factionId == winBandId) {
                var str = (war.band.id == winBandId) ? 'attack' : 'defender';
                rec.call(`prompt.showByName`, [`capture_${str}_win`]);
                notifs.success(rec, `Ваша банда победила`, header);
            } else if (factionId == loseBandId) {
                var str = (war.band.id == loseBandId) ? 'attack' : 'defender';
                rec.call(`prompt.showByName`, [`capture_${str}_lose`]);
                notifs.error(rec, `Ваша банда проиграла`, header);
            }
        });

        this.setBandZoneOwner(zone, winBandId);
        delete this.wars[zone.id];
    },
    inWar(factionId) {
        var i = Object.values(this.wars).findIndex(x => x.band.id == factionId || x.enemyBand.id == factionId);
        return i != -1;
    },
    giveScore(player, zone) {
        if (typeof zone == 'number') zone = this.getZone(zone);
        var war = this.wars[zone.id];
        if (!war) return;

        var bandId, score;

        if (player.character.factionId == war.band.id) {
            war.band.score++;
            bandId = war.band.id;
            score = war.band.score;
        } else if (player.character.factionId == war.enemyBand.id) {
            war.enemyBand.score++;
            bandId = war.enemyBand.id;
            score = war.enemyBand.score;
        }

        mp.players.forEach(rec => {
            if (!rec.character) return;
            var factionId = rec.character.factionId;
            if (!factionId) return;
            if (!factions.isBandFaction(factionId)) return;
            if (factionId != war.band.id && factionId != war.enemyBand.id) return;

            rec.call(`bands.capture.score.set`, [bandId, score]);
        });
    },
};
