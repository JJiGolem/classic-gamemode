"use strict";


/*
    Модуль AFK (бездействие в игре).

    created 18.10.19 by Carter Slade
*/

mp.afk = {
    // Время последней активности
    lastActiveTime: Date.now(),
    // Мин. время бездействия для перехода в режим AFK (ms)
    minAfkTime: 15 * 60 * 1000,
    // Значение прозрачности у игроков в режиме AFK
    alpha: 200,

    init() {
        mp.keys.bind(87, true, () => { // W
            this.action();
        });
        mp.keys.bind(65, true, () => { // A
            this.action();
        });
        mp.keys.bind(83, true, () => { // S
            this.action();
        });
        mp.keys.bind(68, true, () => { // D
            this.action();
        });
        mp.keys.bind(70, true, () => { // F
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
