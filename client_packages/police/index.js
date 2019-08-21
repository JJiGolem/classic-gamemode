"use strict";

/*
    Модуль полиции.

    created 20.08.19 by Carter Slade
*/

mp.police = {
    haveCuffs: false,
    followPlayer: null,

    setCuffs(enable) {
        this.haveCuffs = enable;
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

mp.events.add("police.cuffs.set", (enable) => {
    mp.police.setCuffs(enable);
});

mp.events.add("render", () => {
    if (mp.police.haveCuffs) mp.game.controls.disableAllControlActions(0);
});

mp.events.add("police.follow.start", (playerId) => {
    mp.police.startFollowToPlayer(playerId);
});

mp.events.add("player.follow.stop", () => {
    mp.police.stopFollowToPlayer();
});

mp.events.add("time.main.tick", () => {
    if (mp.police.followPlayer) {
        var pos = mp.police.followPlayer.position;
        var localPos = mp.players.local.position;
        var dist = mp.game.system.vdist(pos.x, pos.y, pos.z, localPos.x, localPos.y, localPos.z);
        if (dist > 30) {
            followPlayer = null;
            return;
        }
        var speed = 3;
        if (dist < 10) speed = 2;
        if (dist < 5) speed = 1;
        mp.players.local.taskFollowNavMeshToCoord(pos.x, pos.y, pos.z, speed, -1, 1, true, 0);
    }
});
