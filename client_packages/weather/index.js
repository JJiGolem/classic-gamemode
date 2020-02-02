"use strict";
var weatherInfoLoaded;
var currentWeather = {};

mp.events.add('weather.info.update', (weather) => {
    currentWeather = weather;
    weatherInfoLoaded = true;
    mp.events.call("hud.setData", {
        temperature: parseInt(weather.temperature),
        weather: weather.icon
    });
});
