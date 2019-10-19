let weather = require("./index.js");

module.exports = {
    /// Событие инициализации сервера
    "init": () => {
        weather.init();
    },

    "player.joined": (player) => {
        player.call('weather.info.update', [weather.getCurrentWeather()]);
    }
};