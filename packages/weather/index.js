"use strict";

let weather = {};
weather.isSet = false;

const request = require("request");
const WEATHER_LOADING = true; // Загрузка погоды с сайта
const REQUEST_TIME = 30 * 60 * 1000; // Время повторного запроса в случае ошибки (в мс)
const API_KEY = "dec51824772fb8b5c61f1964fc56370c"; // ключ с darksky.net
const TIME_ZONE = "America/Los_Angeles";
const DEFAULT_SUMMARY = "Ясно";
const DEFAULT_TEMPERATURE = 20;
const DEFAULT_ICON = "clear-day";

let weatherForecast = [];

module.exports = {

    getCurrentWeather() {
        if (!weather.current) {
           let current = {};
           current.summary = DEFAULT_SUMMARY;
           current.temperature = DEFAULT_TEMPERATURE;
           current.icon = DEFAULT_ICON;
           return current;
        }
        return weather.current;
    },

    init() {
        if (WEATHER_LOADING) {
            requestWeather();
        } else {
            setWeather();
        }

        function requestWeather() {
            request(
                `https://api.darksky.net/forecast/${API_KEY}/34,-118?exclude=currently,minutely,daily,alerts,flags&lang=ru&units=si`,
                { json: true },
                (err, res, body) => {
                    if (err) {
                        repeatWeatherRequest();
                        return console.log(err);
                    }
                    for (var key in body) {
                        if (key == "error") {
                            repeatWeatherRequest();
                            return console.log(body.error);
                        }
                    }

                    try {
                        for (let i = 0; i < 48; i++) {
                            var tzTime = new Date(body.hourly.data[i].time * 1000).toLocaleString("en-US", { timeZone: TIME_ZONE });
                            tzTime = new Date(tzTime);
                            weatherForecast.push({
                                time: tzTime.getHours(),
                                summary: body.hourly.data[i].summary,
                                temperature: body.hourly.data[i].temperature,
                                icon: body.hourly.data[i].icon
                            });
                        }
                    } catch (err) {
                        console.log(err);
                        repeatWeatherRequest();
                        return;
                    }

                    console.log("[WEATHER] Данные о погоде загружены с api.darksky.net");
                    if (!weather.isSet) {
                        setWeather();
                    }
                }
            );
        }

        function repeatWeatherRequest() {
            if (!weather.isSet) {
                setWeather();
            }
            console.log(`[WEATHER] Ошибка загрузки данных о погоде. Повторный запрос через ${REQUEST_TIME / (60 * 1000)} минут...`);
            setTimeout(requestWeather, REQUEST_TIME);
        }

        function getForecastDataByHour(hours) {
            let currentWeather = {};
            if (weatherForecast.length == 0) {
                console.log("[WEATHER] Данных о погоде нет, запрашиваем стандартные данные");
                currentWeather.summary = DEFAULT_SUMMARY;
                currentWeather.temperature = DEFAULT_TEMPERATURE;
                currentWeather.icon = DEFAULT_ICON;
                return currentWeather;
            }
            for (let i = 0; i < 48; i++) {
                if (weatherForecast[i].time == hours) {
                    currentWeather.summary = weatherForecast[i].summary;
                    currentWeather.temperature = weatherForecast[i].temperature;
                    currentWeather.icon = weatherForecast[i].icon;
                    return currentWeather;
                }
            }
        }

        function setWeather() {
            weather.isSet = true;
            let now = new Date();
            weather.current = getForecastDataByHour(now.getHours());
            console.log(`[WEATHER] Погода на этот час: ${JSON.stringify(weather.current)}`);

            switch (weather.current.icon) {
                case 'clear-day':
                case 'clear-night':
                    mp.world.setWeatherTransition("CLEAR");
                    break;
                case 'rain':
                    mp.world.setWeatherTransition("RAIN");
                    break;
                case 'snow':
                    mp.world.setWeatherTransition("SNOW");
                    break;
                case 'sleet':
                    mp.world.setWeatherTransition("SNOWLIGHT");
                    break;
                case 'wind':
                    mp.world.setWeatherTransition("OVERCAST");
                    break;
                case 'fog':
                    mp.world.setWeatherTransition("FOGGY");
                    break;
                case 'cloudy':
                    mp.world.setWeatherTransition("SMOG");
                    break;
                case 'partly-cloudy-day':
                case 'partly-cloudy-night':
                    mp.world.setWeatherTransition("CLOUDY");
                    break;
                default:
                    mp.world.setWeatherTransition("SMOG");
                    weather.current.icon = 'cloudy';
                    break;
            }

            mp.players.forEach((currentPlayer) => {
                currentPlayer.call('weather.info.update', [weather.current]);
            });

            setTimeout(() => { setWeather() }, (60 - now.getMinutes()) * 60 * 1000);
            console.log(`[WEATHER] Следующее обновление погоды через ${60 - now.getMinutes()} минут`);
        }

    }
}
