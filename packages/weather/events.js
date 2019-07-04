let weather = require("./index.js");

module.exports = {
    /// Событие инициализации сервера
    "init": () => {
        weather.init();
    },

    "playerJoin": (player) => {
            player.call('weather.info.update', [weather.getCurrentWeather()]);
    }
};