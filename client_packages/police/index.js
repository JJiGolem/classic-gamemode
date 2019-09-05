"use strict";

/*
    Модуль полиции.

    created 20.08.19 by Carter Slade
*/

mp.police = {
    haveCuffs: false,
    followPlayer: null,
    wanted: 0,

    setCuffs(enable) {
        this.haveCuffs = enable;
        mp.inventory.enable(!enable);
        mp.mapCase.enable(!enable);
        mp.callCEFR('phone.show', [false]);
    },
    setWanted(val) {
        this.wanted = val;
    },
    startFollowToPlayer(playerId) {
        var player = mp.players.atRemoteId(playerId);
        if (!player) return;
        this.followPlayer = player;
    },
    stopFollowToPlayer() {
        this.followPlayer = null;
    },
};

mp.events.add({
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
    "player.follow.stop": () => {
        mp.police.stopFollowToPlayer();
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
