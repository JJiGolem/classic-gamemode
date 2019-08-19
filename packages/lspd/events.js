"use strict";

module.exports = {
    "init": () => {

    },
    "lspd.storage.clothes.take": (player, index) => {
        console.log(`takeClothes: ${index}`)
    },
    "lspd.storage.items.take": (player, index) => {
        console.log(`takeItem: ${index}`)
    },
    "lspd.storage.guns.take": (player, index) => {
        console.log(`takeGun: ${index}`)
    },
    "lspd.storage.ammo.take": (player, index) => {
        console.log(`takeAmmo: ${index}`)
    },
}
