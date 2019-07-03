let weather = require("./index.js");

module.exports = {
    /// Событие инициализации сервера
    "init": () => {
        weather.init();
    },
};