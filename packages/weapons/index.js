"use strict";

let inventory = call('inventory');

module.exports = {
    // связь тип_патронов-оружие
    ammo: {
        // 9mm
        37: [20],
        // 12mm
        38: [48],
        // 7.62mm
        39: [21, 107],
        // 5.56mm
        40: [22, 99],
    },

    init() {
        inventory.mergeList = Object.assign(inventory.mergeList, this.ammo);
    },
    // получить ID предмета патронов по ID предмета оружия
    getAmmoItemId(itemId) {
        for (var ammoId in this.ammo) {
            var list = this.ammo[ammoId];
            if (list.includes(itemId)) return ammoId;
        }
        return null;
    },
    // получить оружие по типу патронов
    getWeaponByAmmoId(player, ammoId) {
        var weapons = inventory.getArrayWeapons(player);
        for (var i = 0; i < weapons.length; i++) {
            var weapon = weapons[i];
            if (this.ammo[ammoId].includes(weapon.itemId)) return weapon;
        }
        return null;
    },
}
