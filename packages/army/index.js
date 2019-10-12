"use strict";

let factions = call('factions');
let notifs = call('notifications');

module.exports = {
    // Мин. ранг, который может начать учения
    captureRank: 8,
    // Текущее учение
    war: null,
    // Время завершения последнего учения (ms)
    lastWarTime: 0,
    // Время отдыха между учениями (ms)
    waitWarTime: 20 * 60 * 1000,
    // Повторное участие в учении после убийства
    reveangeKill: false,
    // Время прохождения учения (ms)
    warTime: 5 * 60 * 1000,
    // Промежуток часов, в который можно начать учение
    captureInterval: [14, 23],
    // Кол-во боеприпасов, списываемое за выдачу формы
    clothesAmmo: 0,
    // Кол-во боеприпасов, списываемое за выдачу бронежилета
    armourAmmo: 100,
    // Кол-во боеприпасов, списываемое за выдачу снаряжения
    itemAmmo: 100,
    // Кол-во боеприпасов, списываемое за выдачу оружия
    gunAmmo: 100,
    // Кол-во боеприпасов, списываемое за выдачу патронов
    ammoAmmo: 1,

    startCapture(player) {
        var header = `Учения`;
        var out = (text) => {
            notifs.error(player, text, header)
        };
        var faction = factions.getFaction(player.character.factionId);
        if (!factions.isArmyFaction(faction)) return out(`Вы не военный`);
        var rank = factions.getRank(faction, this.captureRank);
        if (player.character.factionRank < rank.id) return out(`Доступно с ранга ${rank.name}`);
        if (this.war) return out(`Учение уже проходит`);
        var diff = Date.now() - this.lastWarTime;
        if (diff < this.waitWarTime) {
            var minutes = parseInt((this.waitWarTime - diff) / 1000 / 60);
            return out(`Повторное учение будет доступно через ${minutes} мин.`);
        }
        var hours = new Date().getHours();
        if (hours < this.captureInterval[0] || hours > this.captureInterval[1])
            return out(`Учение доступно с ${this.captureInterval[0]} до ${this.captureInterval[1]} ч.`);

        var teams = this.getTeams(player.position);
        debug(`teamA`);
        debug(teams[0].map(x => x.id));
        debug(`teamB`);
        debug(teams[1].map(x => x.id));

        notifs.warning(player, "in development...")
        return;


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
    getTeams(pos) {
        var members = {};
        mp.players.forEachInRange(pos, 100, (rec) => {
            if (!rec.character) return;
            if (!factions.isArmyFaction(rec.character.factionId)) return;

            var dist = rec.dist(pos);
            members[dist] = rec;
        });
        var players = Object.values(members);

        debug(`players`)
        debug(players.map(x => x.id));

        var teamA = players.slice(0, Math.ceil(players.length / 2));
        var teamB = players.slice(teamA.length);

        return [teamA, teamB];
    },
};
