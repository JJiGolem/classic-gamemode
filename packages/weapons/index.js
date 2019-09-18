"use strict";

let inventory = call('inventory');

module.exports = {
    // связь тип_патронов-оружие
    ammo: {
        // 9mm (пистолеты)
        37: [20, 22, 44, 47, 48, 80, 89, 99],
        // 12mm (крупные пулеметы, дробовики)
        38: [21, 52],
        // 7.62mm (винтовки)
        39: [107],
        // 5.56mm ()
        40: [],
    },

    init() {
        inventory.mergeList = Object.assign(inventory.mergeList, this.ammo);
    },
    // получить ID предмета патронов по ID предмета оружия
    getAmmoItemId(itemId) {
        for (var ammoId in this.ammo) {
            var list = this.ammo[ammoId];
            if (list.includes(itemId)) return parseInt(ammoId);
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
