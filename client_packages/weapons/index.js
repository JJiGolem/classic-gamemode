"use strict";


/*
    Модуль оружий.

    created 06.09.19 by Carter Slade
*/

mp.weapons = {
    needSync: false,
    lastSync: 0,
    waitSync: 20000,
    lastData: {},
    hashes: [],

    sync() {
        var data = {};
        this.hashes.forEach(hash => {
            var ammo = this.getAmmoWeapon(hash);
            if (this.lastData[hash] == ammo) return;
            this.lastData[hash] = ammo;
            data[hash] = ammo;
        });
        this.lastSync = Date.now();
        this.needSync = false;

        if (!Object.keys(data).length) return;
        // mp.terminal.push(`debug`, `sync weapons ammo:`);
        // mp.terminal.push(`debug`, data);
        mp.events.callRemote(`weapons.ammo.sync`, JSON.stringify(data));
    },
    getAmmoWeapon(weaponhash) {
        weaponhash = this.hashToValid(weaponhash);
        return mp.game.invoke('0x015A522136D7F951', mp.players.local.handle, weaponhash);
    },
    currentWeapon() {
        return mp.game.invoke('0x0A6DB4965674D243', mp.players.local.handle);
    },
    getAmmoType() {
        return mp.game.invoke(`0xa38dcffcea8962fa`, mp.players.local.handle, mp.players.local.weapon);
    },
    getWeaponSlot(weaponhash) {
        return mp.game.invoke('0x4215460B9B8B7FA0', weaponhash);
    },
    hashToValid(hash) {
        var hashes = [2210333304];
        if (hashes.includes(hash)) return -2084633992;
        return hash;
    }
};

mp.events.add({
    "render": () => {
        var player = mp.players.local;
        mp.utils.drawText2d(`curr: ${mp.weapons.currentWeapon()} (${mp.weapons.getAmmoWeapon(mp.weapons.currentWeapon())}) weap: ${player.weapon} (${mp.weapons.getAmmoWeapon(player.weapon)}) |
            type: ${mp.weapons.getAmmoType()} slot: ${mp.weapons.getWeaponSlot(mp.weapons.currentWeapon())}`);
        mp.utils.drawText2d(`hashes: ${JSON.stringify(mp.weapons.hashes)}`, [0.8, 0.6]);
    },
    "time.main.tick": () => {
        if (!mp.weapons.needSync) return;
        if (Date.now() - mp.weapons.lastSync < mp.weapons.waitSync) return;
        mp.weapons.sync();
    },
    "playerWeaponShot": (targetPos, targetEntity) => {
        mp.weapons.needSync = true;
    },
    "weapons.giveWeapon": (hash) => {
        hash = parseInt(hash);
        // mp.terminal.push(`debug`, `give: ${hash} ${typeof hash}`)
        mp.events.call("weapons.removeWeapon", hash);
        mp.weapons.hashes.push(hash);
        mp.weapons.lastData[hash] = mp.weapons.getAmmoWeapon(hash)
    },
    "weapons.removeWeapon": (hash) => {
        hash = parseInt(hash);
        // mp.notify.info(`remove: ${hash}`)
        var i = mp.weapons.hashes.indexOf(hash);
        if (i == -1) return;
        mp.weapons.hashes.splice(i, 1);
    },
});
