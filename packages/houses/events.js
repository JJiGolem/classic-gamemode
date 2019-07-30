"use strict";
/// Модуль системы домов
let housesService = require("./index.js");

module.exports = {
    /// Событие инициализации сервера
    "init": () => {
        housesService.init();
    },
};