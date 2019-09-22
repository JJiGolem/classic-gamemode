"use strict";


/*
    Модуль меню игрока.

    created 20.09.19 by Carter Slade
*/

mp.playerMenu = {
    init(data) {
        debug(data);

        mp.callCEFV(`playerMenu.init('${JSON.stringify(data)}')`);
    },
    setFaction(data) {
        mp.callCEFV(`playerMenu.setFaction('${JSON.stringify(data)}')`);
    },
    setFactionRank(data) {
        mp.callCEFV(`playerMenu.setFactionRank('${JSON.stringify(data)}')`);
    },
    setJob(data) {
        mp.callCEFV(`playerMenu.setJob('${JSON.stringify(data)}')`);
    },
    setBiz(biz) {
        mp.callCEFV(`playerMenu.setBiz('${JSON.stringify(biz)}')`);
    },
    setHouse(house) {
        mp.callCEFV(`playerMenu.setHouse('${JSON.stringify(house)}')`);
    },
    setSkills(skills) {
        mp.callCEFV(`playerMenu.setSkills('${JSON.stringify(skills)}')`);
    },
    setSkill(skill) {
        mp.callCEFV(`playerMenu.setSkill('${JSON.stringify(skill)}')`);
    },
    setCash(cash) {
        mp.callCEFV(`playerMenu.setCash(${cash})`);
    },
    setDonate(donate) {
        mp.callCEFV(`playerMenu.setDonate(${donate})`);
    },
    setWarns(warns) {
        mp.callCEFV(`playerMenu.setWarns(${warns})`);
    },
    setSlots(slots) {
        mp.callCEFV(`playerMenu.setSlots(${slots})`);
    },
};

mp.events.add({
    "playerMenu.init": (data) => {
        mp.playerMenu.init(data);
    },
    "playerMenu.setFaction": (data) => {
        mp.playerMenu.setFaction(data);
    },
    "playerMenu.setFactionRank": (data) => {
        mp.playerMenu.setFactionRank(data);
    },
    "playerMenu.setJob": (data) => {
        mp.playerMenu.setJob(data);
    },
    "playerMenu.setBiz": (data) => {
        mp.playerMenu.setBiz(data.biz);
    },
    "playerMenu.setHouse": (data) => {
        mp.playerMenu.setHouse(data.house);
    },
    "playerMenu.setSkills": (data) => {
        mp.playerMenu.setSkills(data.skills);
    },
    "playerMenu.setSkill": (data) => {
        mp.playerMenu.setSkill(data.skill);
    },
    "playerMenu.setDonate": (data) => {
        mp.playerMenu.setDonate(data.donate);
    },
    "playerMenu.setWarns": (data) => {
        mp.playerMenu.setWarns(data.warns);
    },
    "playerMenu.setSlots": (data) => {
        mp.playerMenu.setSlots(data.slots);
    },
    "money.change": (cash, bank) => {
        mp.playerMenu.setCash(cash);
    },
});
