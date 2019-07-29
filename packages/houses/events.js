"use strict";
/// Модуль системы домов
let houseService = require("./index.js");

module.exports = {
    /// Событие инициализации сервера
    "init": () => {
        houseService.init();
    },
};