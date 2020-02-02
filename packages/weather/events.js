let weather = require("./index.js");

module.exports = {
    "init": () => {
        weather.init();
        inited(__dirname);
    },

    "player.joined": (player) => {
        player.call('weather.info.update', [weather.getCurrentWeather()]);
    }
};