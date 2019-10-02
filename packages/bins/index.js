"use strict";

module.exports = {
    // Мусорки
    list: [],
    // Колшейпы мусорок
    colshapes: [],

    async init() {
        this.list = await db.Models.Bin.findAll();

        this.list.forEach(bin => {
            var pos = new mp.Vector3(bin.x, bin.y, bin.z);
            var colshape = mp.colshapes.newSphere(pos.x, pos.y, pos.z, 1.5);
            colshape.onEnter = (player) => {
                debug(`bin enter`)
                player.call("bins.inside", [true]);
                player.insideBin = true;
            };
            colshape.onExit = (player) => {
                debug(`bin exit`)
                player.call("bins.inside", [false]);
                delete player.insideBin;
            };
        });

        console.log(`[BINS] Мусорки загружены (${this.list.length} шт.)`);
    },
};
