"use strict";

let factions;
let notifs;
let timer;

module.exports = {
    // Мин. ранг, который может начать учения
    captureRank: 8,
    // Текущее учение
    war: null,
    // Время завершения последнего учения (ms)
    lastWarTime: 0,
    // Время отдыха между учениями (ms)
    waitWarTime: 20 * 60 * 1000,
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
    // Состояние заправки
    fuel: 500,
    // Макс. кол-вл топлива на заправке
    maxFuel: 5000,
    // Пополнение топлива за интервал
    fuelPerInterval: 200,
    // Интервал пополнения
    fuelAddInterval: 60 * 60 * 1000,
    // Позиция заправки
    fuelStationPos: { x: -1742.7371826171875, y: 3123.53466796875, z: 32.82908248901367 },
    init() {
        factions = call('factions');
        notifs = call('notifications');
        timer = call('timer');
    },
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
        var teamAIds = teams[0].map(x => x.id);
        var teamBIds = teams[1].map(x => x.id);
        debug(`teamA`);
        debug(teamAIds);
        debug(`teamB`);
        debug(teamBIds);

        this.war = {
            teamA: {
                id: 1,
                score: 0,
            },
            teamB: {
                id: 2,
                score: 0,
            },
            startTime: Date.now(),
            pos: player.position
        };
        timer.add(() => {
            try {
                this.stopCapture();
            } catch (e) {
                console.log(e);
            }
        }, this.warTime);

        teams[0].forEach(rec => {
            rec.armyTeamId = this.war.teamA.id;
            rec.call(`army.capture.start`, [this.war.teamA.id, this.war.teamB.id, this.warTime / 1000, 0, 0, this.war.pos, teamAIds, teamBIds]);
            notifs.success(rec, `Ваша команда начала нападение`, header);
        });
        teams[1].forEach(rec => {
            rec.armyTeamId = this.war.teamB.id;
            rec.call(`army.capture.start`, [this.war.teamB.id, this.war.teamA.id, this.warTime / 1000, 0, 0, this.war.pos, teamAIds, teamBIds]);
            notifs.success(rec, `Ваша команда обороняется`, header);
        });
    },
    stopCapture() {
        if (!this.war) return;

        var winTeamId = this.war.teamA.id;
        var loseTeamId = this.war.teamB.id;
        if (this.war.teamB.score >= this.war.teamA.score) {
            winTeamId = this.war.teamB.id;
            loseTeamId = this.war.teamA.id;
        }

        var header = `Учения`;
        mp.players.forEach(rec => {
            if (!rec.character) return;
            if (!factions.isArmyFaction(rec.character.factionId)) return;
            if (!this.inWar(rec)) return;

            if (rec.armyTeamId == winTeamId) {
                var str = (this.war.teamA.id == winTeamId) ? 'attack' : 'defender';
                rec.call(`prompt.showByName`, [`army_capture_${str}_win`]);
                notifs.success(rec, `Ваша команда победила`, header);
            } else if (rec.armyTeamId == loseTeamId) {
                var str = (this.war.teamA.id == loseTeamId) ? 'attack' : 'defender';
                rec.call(`prompt.showByName`, [`army_capture_${str}_lose`]);
                notifs.error(rec, `Ваша команда проиграла`, header);
            }
            delete rec.armyTeamId;
        });

        this.lastWarTime = Date.now();
        this.war = null;
    },
    getTeams(pos) {
        var players = [];
        mp.players.forEachInRange(pos, 100, (rec) => {
            if (!rec.character) return;
            if (!factions.isArmyFaction(rec.character.factionId)) return;

            players.push(rec);
        });

        debug(`players`)
        debug(players.map(x => x.id));

        players.sort((recA, recB) => {
            var distA = recA.dist(pos);
            var distB = recB.dist(pos);

            return distA - distB;
        });

        debug(`sorted players`)
        debug(players.map(x => x.id));


        var teamA = players.slice(0, Math.ceil(players.length / 2));
        var teamB = players.slice(teamA.length);

        return [teamA, teamB];
    },
    inWar(player) {
        return [1, 2].includes(player.armyTeamId);
    },
    giveScore(player, enemy, reason) {
        var teamId, score;
        var war = this.war;

        if (player.armyTeamId == war.teamA.id) {
            war.teamA.score++;
            teamId = war.teamA.id;
            score = war.teamA.score;
        } else if (player.armyTeamId == war.teamB.id) {
            war.teamB.score++;
            teamId = war.teamB.id;
            score = war.teamB.score;
        }

        mp.players.forEach(rec => {
            if (!rec.character) return;
            var factionId = rec.character.factionId;
            if (!factions.isArmyFaction(factionId)) return;
            if (!this.inWar(rec)) return;

            rec.call(`army.capture.killList.log`, [{
                name: enemy.name,
                factionId: enemy.armyTeamId
            }, {
                name: player.name,
                factionId: player.armyTeamId
            }, reason.toString()]);
            rec.call(`army.capture.score.set`, [teamId, score]);
        });
    },
    createFuelStation() {
        let shape = mp.colshapes.newSphere(this.fuelStationPos.x, this.fuelStationPos.y, this.fuelStationPos.z, 4);
        shape.isArmyFuelStation = true;
        mp.markers.new(1, new mp.Vector3(this.fuelStationPos.x, this.fuelStationPos.y, this.fuelStationPos.z - 4), 4, {
            direction: new mp.Vector3(this.fuelStationPos.x, this.fuelStationPos.y, this.fuelStationPos.z),
            rotation: 0,
            color: [255, 114, 79, 128],
            visible: true,
            dimension: 0
        });

        let color = this.getFuelLabelColor();
        let label = mp.labels.new(`${color}${this.fuel} ~w~из ~g~${this.maxFuel} л\n~w~Нажмите ~b~E~w~`, new mp.Vector3(this.fuelStationPos.x, this.fuelStationPos.y, this.fuelStationPos.z),
            {
                los: false,
                font: 0,
                drawDistance: 18,
            });
        label.isArmyFuelStation = true;

        timer.addInterval(() => {
            this.addFuel(this.fuelPerInterval);
        }, this.fuelAddInterval);
    },
    async removeFuel(litres) {
        let value = (this.fuel - litres) > 0 ? this.fuel - litres : 0;
        let param = await db.Models.EconomicIndicator.findOne({
            where: {
                type: 'army.fuel'
            }
        });
        if (param) {
            param.value = value;
            param.save();
        }
        this.fuel = value;
        this.updateFuelLabel();
    },
    async addFuel(litres) {
        let value = (this.fuel + litres) >= this.maxFuel ? this.maxFuel : this.fuel + litres;
        let param = await db.Models.EconomicIndicator.findOne({
            where: {
                type: 'army.fuel'
            }
        });
        if (param) {
            param.value = value;
            param.save();
        }
        this.fuel = value;
        this.updateFuelLabel();
    },
    updateFuelLabel() {
        let color = this.getFuelLabelColor();
        mp.labels.forEach((current) => {
            if (current.isArmyFuelStation) {
                current.text = `${color}${this.fuel} ~w~из ~g~${this.maxFuel} л\n~w~Нажмите ~b~E~w~`;
            }
        });
    },
    getFuelLabelColor() {
        let value = this.fuel / this.maxFuel;
        if (value < 0.05)
            return '~r~';
        else if (value < 0.7)
            return `~y~`;
        else
            return `~g~`;
    }
};
