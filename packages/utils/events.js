"use strict";
let utils = require("./index.js");
/// Сервисные события
module.exports = {
    /// Событие инициализации сервера
    "init": () => {
        utils.init();
    },
    /// Событие вывода в консоль с клиента
    "console": (player, message) => {
        //todo player nick or id
        console.log(`[INFO] Player ... send: "${message}"`);
    },
};