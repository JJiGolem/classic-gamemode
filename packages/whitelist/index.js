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
    "Stanger__W",
    "Spros_mono",
    "Shum219", // brazgin
    "SashaDolgopolov", // dolgopolov
    "Nensi_Pnf", // nensi
    "RussianOfficer34", // мики рейс даниил
    "artik2135456", // фракнки гаспаро саша
    "MarcusBallevardo", // чед черри
    "cyrax63", // захар курупт
    "ImMoRTaL981", // slage
    "_k_a_r_a_b_a_s_", // доне, карабас
    "Ramdam1", // andrey
    "Jack_Tekila", //  эдгар
    "ScarlyS2", // roma
    "QayRey", // юля
    "..Exi..",
    "Demidov_Edgar",
    "LLlBabPa",
    "Edward_Melano"
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
