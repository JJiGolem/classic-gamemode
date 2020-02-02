"use strict";

mp.afk = {
    lastActiveTime: Date.now(),
    minAfkTime: 15 * 60 * 1000,
    alpha: 200,

    init() {
        mp.keys.bind(87, true, () => {
            this.action();
        });
        mp.keys.bind(65, true, () => { 
            this.action();
        });
        mp.keys.bind(83, true, () => {
            this.action();
        });
        mp.keys.bind(68, true, () => {
            this.action();
        });
        mp.keys.bind(70, true, () => { 
            this.action();
        });
    },
    action() {
        this.lastActiveTime = Date.now();
        if (mp.players.local.getVariable("afk")) mp.events.callRemote(`afk.set`, false);
    },
    check() {
        if (mp.players.local.getVariable("afk")) return;
        if (Date.now() - this.lastActiveTime > this.minAfkTime) mp.events.callRemote(`afk.set`, true);
    },
    setAfk(player, enable) {
        let isVanished = player.getVariable('isVanished') || false;
        if (isVanished) return;

        player.setAlpha(enable ? this.alpha : 255);
        mp.utils.setNoCollision(player, !enable);
        if (player.vehicle && player.vehicle.getPedInSeat(-1) == player.handle) {
            player.vehicle.setAlpha(enable ? this.alpha : 255);
            mp.utils.setNoCollision(player.vehicle, !enable);
        }
        if (player.remoteId == mp.players.local.remoteId) {
            if (enable) mp.notify.warning(`Режим AFK активирован`, `ANTI-AFK`);
            else mp.notify.success(`Режим AFK деактивирован`, `ANTI-AFK`);

            player.setProofs(enable, enable, enable, enable, enable, enable, enable, enable);
            if (player.vehicle && player.vehicle.getPedInSeat(-1) == player.handle) player.vehicle.setProofs(enable, enable, enable, enable, enable, enable, enable, enable);
        }
    },

};

mp.events.add({
    "characterInit.done": () => {
        mp.afk.init();
    },
    "time.minute.tick": () => {
        mp.afk.check();
    },
    "entityStreamIn": (player) => {
        if (player.type != "player") return;
        var value = player.getVariable("afk");
        mp.afk.setAfk(player, value);
    },
    "playerStartMeleeCombat": () => {
        var player = mp.players.local;
        if (!player.getVariable("afk")) return;
        mp.afk.setAfk(player, false);
    },
    "playerQuit": (player) => {
        if (player.getVariable("afk") && player.vehicle) mp.afk.setAfk(player, false);
    },
    "playerWeaponShot": () => {
        var player = mp.players.local;
        if (!player.getVariable("afk")) return;
        mp.afk.setAfk(player, false);
    },
});

mp.events.addDataHandler("afk", (player, value) => {
    mp.afk.setAfk(player, value);
});
