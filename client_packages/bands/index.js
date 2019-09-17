"use strict";


/*
    Модуль банд (организации).

    created 15.09.19 by Carter Slade
*/

mp.bands = {
    // Блипы зон гетто
    bandZones: [],
    // Цвета блипов (factionId: blipColor)
    colors: {
        8: 2,
        9: 27,
        10: 46,
        11: 3,
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
    },
    flashTimer: null,
    flashColor: 1,


    initBandZones(zones) {
        this.clearBandZones();
        zones.forEach(zone => {
            var blip = mp.game.ui.addBlipForRadius(zone.x, zone.y, 50, 100);
            mp.game.invoke(this.natives.SET_BLIP_SPRITE, blip, 5);
            mp.game.invoke(this.natives.SET_BLIP_ALPHA, blip, 175);
            mp.game.invoke(this.natives.SET_BLIP_COLOUR, blip, this.colors[zone.factionId]);
            this.bandZones.push(blip);
            this.saveBlip(blip);
            if (zone.flash) this.flashBlip(zone.id, true);
        });
    },
    clearBandZones() {
        var blips = mp.storage.data.bandZones;
        if (!blips) return;
        blips.forEach(blip => {
            mp.game.ui.removeBlip(blip);
        });
        blips = [];
    },
    saveBlip(blip) {
        if (!mp.storage.data.bandZones) mp.storage.data.bandZones = [];
        mp.storage.data.bandZones.push(blip);
    },
    flashBlip(id, toggle) {
        var blip = this.bandZones[id - 1];
        // mp.game.invoke(this.natives.SET_BLIP_FLASHES, blip, toggle);
        clearInterval(this.flashTimer);
        if (!toggle) return;
        var oldColor = mp.game.invoke(this.natives.GET_BLIP_COLOUR, blip);
        this.flashTimer = setInterval(() => {
            var color = mp.game.invoke(this.natives.GET_BLIP_COLOUR, blip);
            if (color == oldColor) mp.game.invoke(this.natives.SET_BLIP_COLOUR, blip, this.flashColor);
            else mp.game.invoke(this.natives.SET_BLIP_COLOUR, blip, oldColor);
        }, 500);
    },
    setOwner(id, factionId) {
        var blip = this.bandZones[id - 1];
        this.flashBlip(id, false);
        mp.game.invoke(this.natives.SET_BLIP_COLOUR, blip, this.colors[factionId]);
    },
    startCapture(bandId, enemyBandId, time, bandScore = 0, enemyBandScore = 0) {
        time = parseInt(time);
        mp.callCEFV(`captureScore.start(${bandId}, ${enemyBandId}, ${time}, ${bandScore}, ${enemyBandScore})`);
    },
    setCaptureScore(bandId, score) {
        mp.callCEFV(`captureScore.setScore(${bandId}, ${score})`);
    },
    logKill(target, killer, reason) {
        if (killer)
            debug(`[KILL-LIST] ${killer.name} killed ${target.name} with reason ${reason}`)
        else
            debug(`[KILL-LIST] ${target.name} сам себя with reason ${reason}`)

            
        if (typeof target == 'object') target = JSON.stringify(target);
        if (typeof killer == 'object') killer = JSON.stringify(killer);
        // самоубийство
        if (reason == 3452007600) return mp.callCEFV(`killList.add('${target}')`);
        // на авто
        if (reason == 2741846334) return mp.callCEFV(`killList.add('${target}', '${killer}', 'car')`);
        // рукопашка
        if (reason == 2725352035) return mp.callCEFV(`killList.add('${target}', '${killer}', 'hand')`);

        // огнестрел, либо что-то еще? :D
        var name = mp.weapons.getWeaponName(reason);
        mp.callCEFV(`killList.add('${target}', '${killer}', '${name}')`);
    },
};

mp.events.add({
    "characterInit.done": () => {},
    "bands.bandZones.init": (zones) => {
        mp.bands.initBandZones(zones);
    },
    "bands.bandZones.flash": (id, toggle) => {
        mp.bands.flashBlip(id, toggle);
    },
    "bands.bandZones.set": (id, factionId) => {
        mp.bands.setOwner(id, factionId);
    },
    "bands.capture.start": (bandId, enemyBandId, time, bandScore = 0, enemyBandScore = 0) => {
        mp.bands.startCapture(bandId, enemyBandId, time, bandScore, enemyBandScore);
    },
    "bands.capture.score.set": (bandId, score) => {
        mp.bands.setCaptureScore(bandId, score);
    },
    "bands.capture.killList.log": (target, killer, reason) => {
        mp.bands.logKill(target, killer, reason);
    },
    "render": () => {
        mp.bands.bandZones.forEach(blip => {
            mp.game.invoke(mp.bands.natives.SET_BLIP_ROTATION, blip, 0);
        });
    },
});
