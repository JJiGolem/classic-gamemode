"use strict";


/*
    Модуль армии (организации).

    created 12.10.19 by Carter Slade
*/

mp.army = {
    // Цвета блипов (teamId: blipColor)
    colors: {
        1: 1,
        2: 2,
    },
    // Цвета ников (teamId: nameColor)
    nameColors: {
        1: [255, 59, 59, 255],
        2: [0, 181, 0, 255],
    },
    // Нативки
    natives: {
        _GET_BLIP_INFO_ID_ITERATOR: "0x186E5D252FA50E7D",
        GET_FIRST_BLIP_INFO_ID: "0x1BEDE233E6CD2A1F",
        GET_NEXT_BLIP_INFO_ID: "0x14F96AA50D6FBEA7",
        DOES_BLIP_EXIST: "0xA6DB27D19ECBB7DA",
        SET_BLIP_SPRITE: "0xDF735600A4696DAF",
        SET_BLIP_ALPHA: "0x45FF974EEE1C8734",
        SET_BLIP_ROTATION: "0xF87683CDF73C3F6E",
        SET_BLIP_COLOUR: "0x03D7FB09E75D6B7E",
        SET_BLIP_FLASHES: "0xB14552383D39CE3E",
        GET_BLIP_COLOUR: "0xDF729E8D20CF7327",
        _SET_BLIP_SHOW_HEADING_INDICATOR: "0x5FBCA48327B914DF",
    },
    captureTimer: null,
    captureTeams: [],
    captureZone: null,
    isInFuelStationShape: false,

    startCapture(teamAId, teamBId, time, teamAScore = 0, teamBScore = 0, pos = [], teamAIds = [], teamBIds = []) {
        time = parseInt(time);
        mp.callCEFV(`captureScore.start(${teamAId}, ${teamBId}, ${time}, ${teamAScore}, ${teamBScore})`);
        mp.timer.remove(this.captureTimer);
        this.removePlayerBlips();
        this.captureTeams = [teamAId, teamBId];

        this.createPlayerBlips(teamAIds, teamBIds);
        this.captureTimer = mp.timer.add(() => {
            this.removePlayerBlips();
            this.captureTeams = [];
            this.destroyCaptureZone();
        }, time * 1000);

        this.createCaptureZone(pos);
    },
    stopCapture() {
        this.removePlayerBlips();
        this.captureTeams = [];
        this.destroyCaptureZone();
        mp.callCEFV(`captureScore.show = false`);
    },
    createCaptureZone(pos) {
        this.destroyCaptureZone();
        var blip = mp.game.ui.addBlipForRadius(pos.x, pos.y, 50, 100);
        mp.game.invoke(this.natives.SET_BLIP_SPRITE, blip, 5);
        mp.game.invoke(this.natives.SET_BLIP_ALPHA, blip, 175);
        mp.game.invoke(this.natives.SET_BLIP_COLOUR, blip, 4);
        this.captureZone = blip;
        this.saveBlip(blip);
    },
    destroyCaptureZone() {
        var blip = mp.storage.data.armyCaptureZone;
        if (!blip) return;
        mp.game.ui.removeBlip(blip);
        mp.storage.data.armyCaptureZone = null;
    },
    saveBlip(blip) {
        mp.storage.data.armyCaptureZone = blip;
    },
    setCaptureScore(teamId, score) {
        mp.callCEFV(`captureScore.setScore(${teamId}, ${score})`);
    },
    logKill(target, killer, reason) {
        reason = parseInt(reason);
        // if (killer)
        //     debug(`[KILL-LIST] ${killer.name} killed ${target.name} with reason ${reason}`)
        // else
        //     debug(`[KILL-LIST] ${target.name} сам себя with reason ${reason}`)


        if (typeof target == 'object') target = JSON.stringify(target);
        if (typeof killer == 'object') killer = JSON.stringify(killer);
        // самоубийство
        if (reason == 3452007600) return mp.callCEFV(`killList.add(\`${target}\`)`);
        // на авто
        if (reason == 2741846334) return mp.callCEFV(`killList.add(\`${target}\`, \`${killer}\`, 'car')`);
        // рукопашка
        if (reason == 2725352035) return mp.callCEFV(`killList.add(\`${target}\`, \`${killer}\`, 'hand')`);

        // огнестрел, либо что-то еще? :D
        var name = mp.weapons.getWeaponName(reason);
        mp.callCEFV(`killList.add(\`${target}\`, \`${killer}\`, \`${name}\`)`);
    },
    createPlayerBlip(player) {
        if (!this.captureTeams.length) return;
        if (player.remoteId == mp.players.local.remoteId) return;
        var teamId = player.armyTeamId;
        if (!this.captureTeams.includes(teamId)) return;
        player.createBlip(1);
        mp.game.invoke(this.natives._SET_BLIP_SHOW_HEADING_INDICATOR, player.blip, true);
        mp.game.invoke(this.natives.SET_BLIP_COLOUR, player.blip, this.colors[teamId]);
        player.nameColor = this.nameColors[teamId];
    },
    createPlayerBlips(teamAIds, teamBIds) {
        teamAIds.forEach(id => {
            var rec = mp.players.atRemoteId(id);
            if (!rec) return;
            rec.armyTeamId = 1;
            this.createPlayerBlip(rec);
        });
        teamBIds.forEach(id => {
            var rec = mp.players.atRemoteId(id);
            if (!rec) return;
            rec.armyTeamId = 2;
            this.createPlayerBlip(rec);
        });
    },
    removePlayerBlips() {
        mp.players.forEach(rec => {
            var teamId = rec.armyTeamId;
            if (teamId == null) return;
            rec.destroyBlip();
            delete rec.armyTeamId;
            delete rec.nameColor;
        });
    },
};

mp.events.add({
    "army.capture.start": (teamAId, teamBId, time, teamAScore = 0, teamBScore = 0, pos = null, teamAIds = [], teamBIds = []) => {
        mp.army.startCapture(teamAId, teamBId, time, teamAScore, teamBScore, pos, teamAIds, teamBIds);
    },
    "army.capture.stop": () => {
        mp.army.stopCapture();
    },
    "army.capture.score.set": (teamId, score) => {
        mp.army.setCaptureScore(teamId, score);
    },
    "army.capture.killList.log": (target, killer, reason) => {
        mp.army.logKill(target, killer, reason);
    },
    "render": () => {
        var blip = mp.army.captureZone;
        if (blip) mp.game.invoke(mp.bands.natives.SET_BLIP_ROTATION, blip, 0);
    },
    "army.fuelstation.enter": (enter) => {
        mp.army.isInFuelStationShape = enter;
    },
});

mp.keys.bind(0x45, true, () => { /// E
    if (mp.game.ui.isPauseMenuActive()) return;
    if (mp.busy.includes()) return;
    if (!mp.army.isInFuelStationShape) return;
    let player = mp.players.local;
    let vehicle = player.vehicle;
    if (vehicle && vehicle.getPedInSeat(-1) == player.handle) {
        mp.events.callRemote('army.fuelstation.fill');
    } else {
        mp.prompt.show('Чтобы заправить транспортное средство, вы должны находиться в нем');
    }
});

mp.army.destroyCaptureZone();
