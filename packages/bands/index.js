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
    warTime: 5 * 60 * 1000,
    // Промежуток часов, в который можно начать захват
    captureInterval: [13, 23],
    // Кол-во боеприпасов, списываемое за выдачу оружия
    gunAmmo: 100,
    // Кол-во боеприпасов, списываемое за выдачу патронов
    ammoAmmo: 1,
    // Наркопритон
    drugsStashMarker: null,
    // Цена за 1 г. нарко в наркопритоне (0% влияния в гетто)
    drugsPrice: 100,
    // Мин. цена 1 г. нарко в наркопритоне (100% влияния в гетто)
    drugsPriceMin: 30,
    // Прибавляемое кол-во здоровья от упротребления 1 г. нарко
    drugsHealth: 30,
    // Время эффекта наркотика (ms)
    drugsEffectTime: 30000,

    init() {
        factions = call('factions');
        notifs = call('notifications');

        this.loadBandZonesFromDB();
        this.createDrugsStashMarker();
    },

    async loadBandZonesFromDB() {
        var dbZones = await db.Models.BandZone.findAll();
        this.bandZones = dbZones;
        console.log(`[BANDS] Зоны гетто загружены (${dbZones.length} шт.)`)
    },
    convertToClientBandZones() {
        var zones = this.bandZones.map(x => x.dataValues);
        var warZoneIds = Object.keys(this.wars);
        if (warZoneIds.length) zones[warZoneIds[0] - 1].flash = true;

        return zones;
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
    isSpawnZone(zone) {
        var bands = factions.factions.filter(x => x.id >= 8 && x.id <= 11);
        for (var i = 0; i < bands.length; i++) {
            var marker = factions.getMarker(bands[i].id);
            var bandZone = this.getZoneByPos(marker.position);
            if (bandZone && zone.id == bandZone.id) return true;
        }
        return false;
    },
    getZoneByPos(pos) {
        if (!this.isInBandZones(pos)) return null;

        for (var i = 0; i < this.bandZones.length; i++) {
            var zone = this.bandZones[i];
            if (this.isInBandZone(pos, zone)) return zone;
        }

        return null;
    },
    // влияние банды от 0 до 1 (min: 0 - ниодной зоны не захвачено, max: 1 - всё гетто захвачено)
    getPowerBand(bandId) {
        var count = 0;
        for (var i = 0; i < this.bandZones.length; i++) {
            var zone = this.bandZones[i];
            if (zone.factionId == bandId) count++;
        }

        return count / this.bandZones.length;
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
        if (this.isSpawnZone(zone)) return out(`Нельзя захватить зону, в которой проживает банда`);
        if (Object.keys(this.wars).length) return out(`В гетто уже идет война`);

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
                rec.call(`bands.capture.start`, [zone.factionId, faction.id, this.warTime / 1000]);
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
    createDrugsStashMarker() {
        var pos = new mp.Vector3(2435.65, 4965.74, 42.35 - 1);

        var marker = mp.markers.new(1, pos, 0.5, {
            color: [187, 255, 0, 70]
        });
        marker.blip = mp.blips.new(140, pos, {
            color: 25,
            name: `Наркопритон`,
            shortRange: 10,
            scale: 1
        });

        var colshape = mp.colshapes.newSphere(pos.x, pos.y, pos.z, 1.5);
        colshape.onEnter = (player) => {
            if (!factions.isBandFaction(player.character.factionId)) return notifs.error(player, `Вы не член группировки`, `Наркопритон`);
            player.call("selectMenu.show", [`drugsStash`]);
            player.insideDrugsStash = true;
        };
        colshape.onExit = (player) => {
            player.call("selectMenu.hide");
            delete player.insideDrugsStash;
        };
        this.drugsStashMarker = marker;
    },
};
