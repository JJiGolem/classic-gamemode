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
        8: 27,
        9: 2,
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
    },


    initBandZones(zones) {
        this.clearBandZones();
        zones.forEach(zone => {
            var blip = mp.game.ui.addBlipForRadius(zone.x, zone.y, 50, 100);
            mp.game.invoke(this.natives.SET_BLIP_SPRITE, blip, 5);
            mp.game.invoke(this.natives.SET_BLIP_ALPHA, blip, 175);
            mp.game.invoke(this.natives.SET_BLIP_COLOUR, blip, this.colors[zone.factionId]);
            this.bandZones.push(blip);
            this.saveBlip(blip);
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
        mp.game.invoke(this.natives.SET_BLIP_FLASHES, blip, toggle);
    },
    setOwner(id, factionId) {
        var blip = this.bandZones[id - 1];
        this.flashBlip(id, false);
        mp.game.invoke(this.natives.SET_BLIP_COLOUR, blip, this.colors[factionId]);
    },
    startCapture(bandId, enemyBandId, time) {
        time = parseInt(time);
        mp.callCEFV(`captureScore.start(${bandId}, ${enemyBandId}, ${time})`);
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
    "bands.capture.start": (bandId, enemyBandId, time) => {
        mp.bands.startCapture(bandId, enemyBandId, time);
    },
    "render": () => {
        mp.bands.bandZones.forEach(blip => {
            mp.game.invoke(mp.bands.natives.SET_BLIP_ROTATION, blip, 0);
        });
    },
});
