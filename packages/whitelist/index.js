"use strict";

let enabled = true; /// Включение/отключение вайтлиста
let allowed = [ /// Список разрешенных social club'ов
    "kirswift",
    "Alex_Cortez",
    "Pigeon_Gangsta",
    "deusmemes",
    "strainflorein",
    "Cinzu-ra",
    "Eric.Sweep",
    "Djon_Anderson",
    "1d1ssarik",
    "Stanger__W"
]; 

module.exports = {
    isEnabled() {
        return enabled;
    },
    getAllowed() {
        return allowed;
    },
    init() {
        console.log(`[WHITELIST] Вайтлист загружен. Вход ${enabled ? 'по вайтлисту': 'свободный'}.`);
    }
}
