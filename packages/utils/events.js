"use strict";
let utils = require("./index.js");
/// Сервисные события
module.exports = {
    /// Событие инициализации сервера
    "init": () => {
        utils.init();
        inited(__dirname);
    },
    /// Событие вывода в консоль с клиента
    "console": (player, message) => {
        console.log(`[INFO] Player ${player.character ? ("character:" + player.character.name) : (player.account ? "account: " + player.account.id : "id: " + player.id)} send: "${message}"`);
    }
};