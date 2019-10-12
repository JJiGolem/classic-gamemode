"use strict";


/*
    Модуль армии (организации).

    created 12.10.19 by Carter Slade
*/

mp.army = {
    // Цвета блипов (teamId: blipColor)
    colors: {
        1: 2,
        2: 27,
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


    startCapture(teamAId, teamBId, time, teamAScore = 0, teamBScore = 0, pos = [], teamAIds = [], teamBIds = []) {
        time = parseInt(time);
        mp.callCEFV(`captureScore.start(${teamAId}, ${teamBId}, ${time}, ${teamAScore}, ${teamBScore})`);
        clearTimeout(this.captureTimer);
        this.removePlayerBlips();
        this.captureTeams = [teamAId, teamBId];

        this.createPlayerBlips(teamAIds, teamBIds);
        this.captureTimer = setTimeout(() => {
            this.removePlayerBlips();
            this.captureTeams = [];
            this.destroyCaptureZone();
        }, time * 1000);

        this.createCaptureZone(pos);
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
    stopCapture() {
        mp.callCEFV(`captureScore.show = false`);
    },
    createPlayerBlip(player) {
        if (!this.captureTeams.length) return;
        if (player.remoteId == mp.players.local.remoteId) return;
        var teamId = player.armyTeamId;
        if (!this.captureTeams.includes(teamId)) return;
        player.createBlip(1);
        mp.game.invoke(this.natives._SET_BLIP_SHOW_HEADING_INDICATOR, player.blip, true);
        mp.game.invoke(this.natives.SET_BLIP_COLOUR, player.blip, this.colors[teamId]);
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
        });
    },
};

mp.events.add({
    "army.capture.start": (teamAId, teamBId, time, teamAScore = 0, teamBScore = 0, pos = null, teamAIds = [], teamBIds = []) => {
        mp.army.startCapture(teamAId, teamBId, time, teamAScore, teamBScore, pos, teamAIds, teamBIds);
    },
    "render": () => {
        var blip = mp.army.captureZone;
        if (blip) mp.game.invoke(mp.bands.natives.SET_BLIP_ROTATION, blip, 0);
    },
});

mp.army.destroyCaptureZone();
