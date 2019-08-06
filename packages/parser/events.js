"use strict";
/// Модуль системы парсинга JSON в БД
let parser = require("./index.js");

module.exports = {
    /// Событие инициализации сервера
    "init": () => {
        parser.init();
    },
};

