"use strict";

let utils = call('utils');

module.exports = {
    // Колшейпы мусорок
    colshapes: [],
    // Интервал между поисками в одной мусорке
    findInterval: 60 * 60 * 1000,
    // Инфо о мусоре, который можно найти
    // Встречаемость мусора
    // Редкие - 5% (в 1 из 20 мусорок)
    // Средние - 10% (в 2 из 20 мусорок)
    // Остальные - 70% (в 14 из 20 мусорок)
    trashesInfo: [{
            itemId: 57,
            price: 10,
            chance: 5,
        },
        {
            itemId: 58,
            price: 10,
            chance: 5,
        },
        {
            itemId: 59,
            price: 10,
            chance: 70,
        },
        {
            itemId: 60,
            price: 10,
            chance: 70,
        },
        {
            itemId: 61,
            price: 10,
            chance: 70,
        },
        {
            itemId: 62,
            price: 10,
            chance: 10,
        },
        {
            itemId: 63,
            price: 10,
            chance: 10,
        },
        {
            itemId: 64,
            price: 10,
            chance: 70,
        },
    ],
    // Не найдено - 15% (в 3 из 20 мусорок)
    emptyChance: 15,

    async init() {
        var list = await db.Models.Bin.findAll();

        list.forEach(bin => {
            var colshape = this.createColshape(bin);
            this.colshapes.push(colshape);
        });

        console.log(`[BINS] Мусорки загружены (${list.length} шт.)`);
    },
    createColshape(bin) {
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
        colshape.bin = bin;
        return colshape;
    },
    getRandomTrash() {
        var interval = this.trashesInfo.map(x => x.chance);
        interval.push(this.emptyChance);

        for (var i = 1; i < interval.length; i++) {
            var prev = interval[i - 1];
            interval[i] += prev;
        }

        var rand = utils.randomInteger(1, interval[i - 1]);
        for (var i = 0; i < interval.length - 1; i++) {
            if (rand <= interval[i]) return this.trashesInfo[i];
        }

        return null;
    },
    add(pos) {
        var bin = db.Models.Bin.build({
            x: pos.x,
            y: pos.y,
            z: pos.z
        });
        this.colshapes.push(this.createColshape(bin));
        bin.save();
    },
    remove(id) {
        var i = this.colshapes.findIndex(x => x.bin.id == id);
        if (i == -1) return;

        this.colshapes[i].bin.destroy();
        this.colshapes[i].destroy();
        this.colshapes.splice(i, 1);
    },
    getNear(player, range = 2) {
        var nearBin;
        var minDist = 99999;
        this.colshapes.forEach((el) => {
            var pos = new mp.Vector3(el.bin.x, el.bin.y, el.bin.z);
            var distance = player.dist(pos);
            if (distance < minDist && distance < range) {
                nearBin = el;
                minDist = distance;
            }
        });
        return nearBin;
    },
};
