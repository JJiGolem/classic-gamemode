"use strict";


/*
    Модуль анти-чита.

    created 24.11.19 by Carter Slade
*/

mp.anticheat = {
    // Параметры анти-чита
    weapon: false,

    // анти-чит на оружие
    checkWeapon() {
        if (!this.weapon) return;
        var player = mp.players.local;
        if (player.weapon == 2725352035) return;
        if (mp.weapons.hashes.length && mp.weapons.hashes[0] == player.weapon) return;

        this.weapon = false;
        this.trigger(`Начитерил ган ${mp.weapons.getWeaponName(player.weapon) || ''}`);
    },
    trigger(reason) {
        mp.notify.warning(reason, `ANTICHEAT`);
        mp.events.callRemote(`anticheat.trigger`, reason);
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
});
