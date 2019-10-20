"use strict";
/// Тестовый модуль, призванный показать строение модулей
let test = require("./index.js");

module.exports = {
    /// Событие инициализации сервера
    "init": () => {
        test.test();
        inited(__dirname);
    },
};