"use strict";

let factions;
let inventory;
let notifs;
let terminal;
let timer;

module.exports = {
    bandZones: [],
    
    captureRank: 8,
    
    robRank: 8,
    
    wars: {},
    
    lastWarTime: 0,
    
    waitWarTime: 20 * 60 * 1000,
    
    reveangeKill: false,
    
    warTime: 5 * 60 * 1000,
    
    captureInterval: [11, 20],
    
    bandZonesPrice: 100,
    
    gunAmmo: 100,
    
    ammoAmmo: 1,
    
    drugsStashMarker: null,
    
    drugsPrice: [20, 40, 60, 120],
    
    drugsPriceMin: [10, 20, 30, 60],
    
    drugsHealth: [10, 20, 30, 60],
    
    drugsNarcotism: [1, 2, 3, 6],
    
    drugsEffectTime: [10000, 20000, 30000, 60000],
    
    drugsEffect: ['DrugsDrivingOut', 'RampageOut', 'DrugsMichaelAliensFightOut', 'DrugsTrevorClownsFightOut'],
    
    drugsInterval: [10 * 6000, 20 * 6000, 30 * 6000, 60 * 6000],
    
    robK: 0.01,
    
    robMaxPrice: 500,
    
    robBandWaitTime: 60 * 60 * 1000,
    
    robVictimWaitTime: 60 * 60 * 1000,
    
    robLogs: {},
    
    robVehFactionIds: [2, 3],

    async init() {
        factions = call('factions');
        inventory = call('inventory');
        notifs = call('notifications');
        terminal = call('terminal');
        timer = call('timer');

        this.createDrugsStashMarker();
        await this.loadBandZonesFromDB();
    },

    async loadBandZonesFromDB() {
        var dbZones = await db.Models.BandZone.findAll();
        this.bandZones = dbZones;
        console.log(`[BANDS] Зоны гетто загружены (${dbZones.length} шт.)`)
    },
    convertToClientBandZones() {
        var zones = this.bandZones.map(x => Object.assign({}, x.dataValues));
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
        var diff = Date.now() - this.lastWarTime;
        if (diff < this.waitWarTime) {
            var minutes = parseInt((this.waitWarTime - diff) / 1000 / 60);
            return out(`Повторный захват будет доступен через ${minutes} мин.`);
        }

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
        timer.add(() => {
            try {
                this.stopCapture(zone);
            } catch (e) {
                console.log(e);
            }
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
        if (war.enemyBand.score >= war.band.score) {
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
        this.lastWarTime = Date.now();
        delete this.wars[zone.id];
    },
    inWar(factionId) {
        var i = Object.values(this.wars).findIndex(x => x.band.id == factionId || x.enemyBand.id == factionId);
        return i != -1;
    },
    checkReveangeKill(player) {
        if (this.reveangeKill) return;
        if (!player.lastWarDeathTime) return;
        var diff = Date.now() - player.lastWarDeathTime;
        if (diff > this.warTime) delete player.lastWarDeathTime;
        else {
            notifs.error(player, `Reveange Kill запрещен`, `Захват территории`);
            terminal.log(`[BANDS] ${player.name} сделал Reveange Kill на капте`);
        }
    },
    giveScore(player, enemy, reason, zone) {
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

            rec.call(`bands.capture.killList.log`, [{
                name: enemy.name,
                factionId: enemy.character.factionId
            }, {
                name: player.name,
                factionId: player.character.factionId
            }, reason.toString()]);
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
            if (player.vehicle) return;
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
    
    haveTime(war) {
        return this.warTime - (Date.now() - war.startTime);
    },
    sendStorageInfo(player) {
        var data = {
            names: factions.getBandFactions().map(x => x.name),
            counts: [0, 0, 0, 0],
            cash: factions.getFaction(player.character.factionId).cash,
        };

        this.bandZones.forEach(zone => {
            data.counts[zone.factionId - 8]++;
        });
        player.call(`bands.storage.info.set`, [data]);
    },
    canRobVehicle(veh) {
        if (!veh.db || veh.db.key != 'faction') return false;
        return this.robVehFactionIds.includes(veh.db.owner);
    },
    giveRobVehItem(player, veh, callback) {
        var params = {
            variation: 12,
            texture: 1
        };
        // params.faction = character.factionId;
        // params.owner = character.id;

        params.health = 100;
        //params.pockets = '[2,3,1,3,1,3,6,3,3,2,4,2,2,2,2,2,4,2,3,2]';
        params.pockets = '[3,3,3,3,3,3,3,3,10,5,3,5,10,3,3,3]';
        params.sex = player.character.gender ? 0 : 1;

        inventory.addItem(player, 3, params, callback);
    },
};
