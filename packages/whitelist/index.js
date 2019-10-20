"use strict";

let enabled = true; /// Включение/отключение вайтлиста
let allowed;
// let allowed = [ /// Список разрешенных social club'ов
//     "kirswift",
//     "Alex_Cortez",
//     "Pigeon_Gangsta",
//     "deusmemes",
//     "strainflorein",
//     "Cinzu-ra",
//     "Eric.Sweep",
//     "Djon_Anderson",
//     "1d1ssarik",
//     "Stanger__W",
//     "Spros_mono",
//     "SashaDolgopolov", // dolgopolov
//     "Nensi_Pnf", // nensi
//     "_Deadly0_", // фракнки гаспаро саша
//     "MarcusBallevardo", // чед черри
//     "cyrax63", // захар курупт
//     "ImMoRTaL981", // slage
//     "_k_a_r_a_b_a_s_", // доне, карабас
//     "Ramdam1", // andrey
//     "Jack_Tekila", //  эдгар
//     "ScarlyS2", // roma
//     "QayRey", // юля
//     "..Exi..",
//     "LLlBabPa",
//     "Edward_Melano",
//     "stefano_adderio", //adderio
//     "lenyas",
//     "Rimskaya",
//     "RussianOfficer34" // mickey 
// ]; 

module.exports = {
    isEnabled() {
        return enabled;
    },
    getAllowed() {
        return allowed;
    },
    async init() {
        await this.loadWhiteList();
    },
    async loadWhiteList() {
        allowed = await db.Models.WhiteList.findAll();
        console.log(`[WHITELIST] Загружено ${allowed.length} записей вайтлиста.`);
        console.log(`[WHITELIST] Вход ${enabled ? 'по вайтлисту': 'свободный'}.`);
    },
    isInWhiteList(socialClub) {
        let nick = allowed.find(x => x.socialClub == socialClub);
        return nick ? true : false;
    },
    pushToAllowed(record) {
        allowed.push(record);
    },
    removeFromAllowed(socialClub) {
        let index = allowed.findIndex(x => x.socialClub == socialClub);
        allowed.splice(index, 1);
    }
}
