"use strict";


/*
    Модуль анти-чита.

    created 24.11.19 by Carter Slade
*/

mp.anticheat = {
    weaponEnable: true,

    // анти-чит на оружие
    checkWeapon() {
        if (!this.weaponEnable) return;
        var player = mp.players.local;
        if (player.weapon == 2725352035) return;
        if (mp.weapons.hashes.length && mp.weapons.hashes[0] == player.weapon) return;

        this.weaponEnable = false;
        this.trigger(`Начитерил ган ${mp.weapons.getWeaponName(player.weapon) || ''}`);
    },
    trigger(reason) {
        mp.notify.warning(reason, `ANTICHEAT`);
        mp.events.callRemote(`anticheat.trigger`, reason);
    },
};

mp.events.add({
    "render": () => {
        mp.anticheat.checkWeapon();
    },
});
