"use strict";
/// Модуль системы финансов игрока
let money = require("./index.js");

module.exports = {
    "characterInit.done": (player) => {
        money.changing(player);
    }
};