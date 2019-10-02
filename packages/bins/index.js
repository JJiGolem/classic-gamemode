"use strict";

let utils = call('utils');

module.exports = {
    // Мусорки
    list: [],
    // Колшейпы мусорок
    colshapes: [],
    // Интервал между поисками в одной мусорке
    findInterval: 60 * 60 * 1000,
    // Инфо о мусоре, который можно найти
    trashesInfo: [{
            itemId: 57,
            price: 10,
            rarity: 0,
        },
        {
            itemId: 58,
            price: 10,
            rarity: 0,
        },
        {
            itemId: 59,
            price: 10,
            rarity: 0,
        },
        {
            itemId: 60,
            price: 10,
            rarity: 0,
        },
        {
            itemId: 61,
            price: 10,
            rarity: 0,
        },
        {
            itemId: 62,
            price: 10,
            rarity: 0,
        },
        {
            itemId: 63,
            price: 10,
            rarity: 0,
        },
        {
            itemId: 64,
            price: 10,
            rarity: 0,
        },
    ],

    async init() {
        this.list = await db.Models.Bin.findAll();

        this.list.forEach(bin => {
            var pos = new mp.Vector3(bin.x, bin.y, bin.z);
            var colshape = mp.colshapes.newSphere(pos.x, pos.y, pos.z, 1.5);
            colshape.onEnter = (player) => {
                player.call("bins.inside", [true]);
                player.insideBin = colshape;
            };
            colshape.onExit = (player) => {
                player.call("bins.inside", [false]);
                delete player.insideBin;
            };
        });

        console.log(`[BINS] Мусорки загружены (${this.list.length} шт.)`);
    },
    getRandomTrash() {
        var rand = utils.randomInteger(0, this.trashesInfo.length - 1);
        return this.trashesInfo[rand];
    },
};
