"use strict";

let inventory = call('inventory');

module.exports = {
    ammo: {
        37: [20, 44, 46, 47, 48, 80, 87, 88, 89, 90],
        38: [21, 49, 91, 93, 96],
        39: [50, 52, 107],
        40: [22, 99, 100],
    },

    init() {
        inventory.mergeList = Object.assign(inventory.mergeList, this.ammo);
    },
    getAmmoItemId(itemId) {
        for (var ammoId in this.ammo) {
            var list = this.ammo[ammoId];
            if (list.includes(itemId)) return parseInt(ammoId);
        }
        return null;
    },
    getWeaponByAmmoId(player, ammoId) {
        var weapons = inventory.getArrayWeapons(player);
        for (var i = 0; i < weapons.length; i++) {
            var weapon = weapons[i];
            if (this.ammo[ammoId].includes(weapon.itemId)) return weapon;
        }
        return null;
    },
}
