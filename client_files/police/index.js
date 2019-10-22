"use strict";

/*
    Модуль полиции.

    created 20.08.19 by Carter Slade
*/

mp.police = {
    haveCuffs: false,
    followPlayer: null,
    wanted: 0,
    wantedTimer: null,
    clearWantedTime: 60 * 60 * 1000, // время очищения 1 ур. розыска (ms)
    searchRadius: 100,
    searchTime: 2 * 60 * 1000, // время жизни блипа поиска преступника
    searchTimer: null,
    natives: {
        SET_BLIP_SPRITE: "0xDF735600A4696DAF",
        SET_BLIP_ALPHA: "0x45FF974EEE1C8734",
        SET_BLIP_COLOUR: "0x03D7FB09E75D6B7E",
    },

    setCuffs(enable) {
        this.haveCuffs = enable;
        mp.inventory.enable(!enable);
        mp.mapCase.enable(!enable);
        mp.callCEFR('phone.show', [false]);
    },
    setWanted(val) {
        this.wanted = val;
        mp.playerMenu.setWanted(val);
        clearTimeout(this.wantedTimer);
        mp.callCEFV(`hud.wanted = ${val}`);
        if (!val) return;
        this.wantedTimer = mp.timer.add(() => {
            mp.events.callRemote(`police.wanted.lower`);
        }, this.clearWantedTime);
    },
    startFollowToPlayer(playerId) {
        var player = mp.players.atRemoteId(playerId);
        if (!player) return;
        this.followPlayer = player;
    },
    stopFollowToPlayer() {
        this.followPlayer = null;
    },
    searchBlipCreate(name, pos) {
        this.removeSearchBlip();
        pos = mp.utils.randomSpherePoint(pos, this.searchRadius);
        var blip = mp.game.ui.addBlipForRadius(pos.x, pos.y, 50, this.searchRadius);
        mp.game.invoke(this.natives.SET_BLIP_ALPHA, blip, 175);
        mp.game.invoke(this.natives.SET_BLIP_COLOUR, blip, 1);

        this.saveSearchBlip(blip);

        clearTimeout(this.searchTimer);
        this.searchTimer = mp.timer.add(() => {
            this.removeSearchBlip();
        }, this.searchTime);
    },
    saveSearchBlip(blip) {
        mp.storage.data.searchBlip = blip;
    },
    removeSearchBlip() {
        if (!mp.storage.data.searchBlip) return;

        mp.game.ui.removeBlip(mp.storage.data.searchBlip);
        delete mp.storage.data.searchBlip;
    },
};

mp.events.add({
    "characterInit.done": () => {
        mp.police.removeSearchBlip();
    },
    "police.cuffs.set": (enable) => {
        mp.police.setCuffs(enable);
    },
    "police.wanted.set": (val) => {
        mp.police.setWanted(val);
        mp.game.gameplay.setFakeWantedLevel(val);
    },
    "render": () => {
        if (mp.police.haveCuffs) mp.game.controls.disableAllControlActions(0);
    },
    "police.follow.start": (playerId) => {
        mp.police.startFollowToPlayer(playerId);
    },
    "police.follow.stop": () => {
        mp.police.stopFollowToPlayer();
    },
    "police.search.blip.create": (name, pos) => {
        mp.police.searchBlipCreate(name, pos);
    },
    "time.main.tick": () => {
        if (mp.police.followPlayer) {
            var pos = mp.police.followPlayer.position;
            var localPos = mp.players.local.position;
            var dist = mp.game.system.vdist(pos.x, pos.y, pos.z, localPos.x, localPos.y, localPos.z);
            if (dist > 30) {
                mp.police.followPlayer = null;
                return;
            }
            var speed = 3;
            if (dist < 10) speed = 2;
            if (dist < 5) speed = 1;
            mp.players.local.taskFollowNavMeshToCoord(pos.x, pos.y, pos.z, speed, -1, 1, true, 0);
        }
    },
    "entityStreamOut": (entity) => {
        if (entity.type != "player") return;
        if (!mp.police.followPlayer) return;
        if (entity.remoteId != mp.police.followPlayer.remoteId) return;
        mp.police.followPlayer = null;
    },
    "playerQuit": (player) => {
        if (!mp.police.followPlayer) return;
        if (player.remoteId != mp.police.followPlayer.remoteId) return;
        mp.police.followPlayer = null;
    },
});
