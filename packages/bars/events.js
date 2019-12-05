"use strict";

let bar = require('./index.js');

module.exports = {
    "init": async () => {
        await bar.init();
        inited(__dirname);
    },
    "bar.buy": (player, index) => {
        bar.buyDrink(player, index);
    },
    "playerEnterColshape": (player, shape) => {
        if (!shape.isBar) return;
        let info = bar.getInfo();
        if (info == null) return;
        player.call("bar.show", [info]);
    },
    "playerExitColshape": (player, shape) => {
        if (!shape.isBar) return;
        player.call("bar.close", [true]);
    },
};