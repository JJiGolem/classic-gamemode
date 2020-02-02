"use strict";

mp.anticheat = {
    weapon: false,
    jail: false,
    lastTriggerTime: 0,
    waitTime: 10000,

    checkWeapon() {
        if (!this.weapon) return;
        var player = mp.players.local;
        if (player.weapon == 2725352035 || !player.weapon) return;
        if (mp.weapons.hashes.length && mp.weapons.hashes[0] == player.weapon) return;

        this.trigger(`weapon`, `Начитерил ган ${mp.weapons.getWeaponName(player.weapon) || ''}`);
    },
    checkJail() {
        if (!this.jail) return;
        if (mp.police.arrestType != null) {
            var info = mp.police.jailInfo[mp.police.arrestType];
            var dist = mp.vdist(mp.players.local.position, info.coords);
            if (dist > info.radius) this.trigger(`jail`, `Покинул зону тюрьмы/КПЗ`);
        }
    },
    trigger(name, reason) {
        if (Date.now() - this.lastTriggerTime < this.waitTime) return;
        this.lastTriggerTime = Date.now();

        mp.events.callRemote(`anticheat.trigger`, name, reason);
    },
    enableParam(name, enable) {
        this[name] = enable;
    },
};

mp.events.add({
    "render": () => {
        mp.anticheat.checkWeapon();
    },
    "anticheat.init": (params) => {
        for (var name in params) {
            mp.anticheat.enableParam(name, params[name]);
        }
    },
    "anticheat.param.set": (name, enable) => {
        mp.anticheat.enableParam(name, enable);
    },
    "time.main.tick": () => {
        mp.anticheat.checkJail();
    },
});
