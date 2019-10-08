"use strict";

let bank = require('./index.js');
let bizService;
let houseService;

module.exports = {
    "init": () => {
        bizService = call("bizes");
        houseService = call("houses");
    },
    "playerEnterColshape": (player, shape) => {
        if (!shape.isBank) return;
        let info = bank.getInfo(player);
        if (info == null) return;
        player.call("bank.show", [info]);
    },
    "playerExitColshape": (player, shape) => {
        if (!shape.isBank) return;
        player.call("bank.close", [true]);
    },
    "bank.push": (number) => {

    },
    "bank.pop": (number) => {

    },
    "bank.transfer": (number, accountNumber) => {

    },
    "bank.phone.push": (number) => {

    },
    "bank.biz.push": (id, daysNumber) => {

    },
    "bank.house.push": (id, daysNumber) => {

    },
    "bank.biz.cashbox.push": (id, number) => {

    },
    "bank.biz.cashbox.pop": (id, number) => {

    }
}
