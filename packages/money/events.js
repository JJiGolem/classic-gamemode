"use strict";

let money = require("./index.js");

module.exports = {
    "init": () => {
        money.init();
        inited(__dirname);
    },
    "characterInit.done": (player) => {
        money.changing(player);
    }
};