"use strict";


/*
    Модуль организаций.

    created 16.08.19 by Carter Slade
*/

mp.factions = {
    enableTakeBox: false,
    enablePutBox: false,
    typeBox: "",

    insideWarehouse(inside, type = null) {
        if (inside) mp.prompt.showByName(`take_${type}box`);
        else mp.prompt.hide();
        this.enableTakeBox = inside;
        this.typeBox = type;
    },
    insideFactionWarehouse(inside, type = null) {
        if (inside) mp.prompt.showByName(`put_${type}box`);
        else mp.prompt.hide();
        this.enablePutBox = inside;
    },
    boxHandler() {
        if (this.enableTakeBox) {
            // TODO: проверка на аттач
            mp.events.callRemote("factions.warehouse.takeBox", this.typeBox);
        } else if (this.enablePutBox) {
            // TODO: проверка на аттач
            mp.events.callRemote("factions.warehouse.putBox");
        }
    },
    showGiveRankSelectMenu(factionName, rankNames, rank, playerId) {
        if (typeof rankNames == 'object') rankNames = JSON.stringify(rankNames);
        mp.callCEFV(`selectMenu.setItemValues('factionGiveRank', 'Ранг', '${rankNames}')`);
        mp.callCEFV(`selectMenu.menus['factionGiveRank'].header = '${factionName}'`);
        mp.callCEFV(`selectMenu.menus['factionGiveRank'].items[0].i = ${rank - 1}`);
        mp.callCEFV(`selectMenu.menus['factionGiveRank'].playerId = ${playerId}`);
        mp.callCEFV(`selectMenu.showByName('factionGiveRank')`);
    },
    showStorageSelectMenu(factionId) {
        if (factionId == 2) { // LSPD
            mp.callCEFV(`selectMenu.showByName('lspdStorage')`);
        }
    },
    isGovernmentFaction(factionId) {
        return factionId == 1;
    },
    isPoliceFaction(factionId) {
        return factionId == 2 || factionId == 3;
    },
    isFibFaction(factionId) {
        return factionId == 4;
    },
    isHospitalFaction(factionId) {
        return factionId == 5;
    },
    isArmyFaction(factionId) {
        return factionId == 6;
    },
    isNewsFaction(factionId) {
        return factionId == 7;
    },
    isStateFaction(factionId) {
        return factionId >= 1 && factionId <= 7;
    },
};

mp.events.add("characterInit.done", () => {
    mp.keys.bind(69, true, mp.factions.boxHandler); // E
    // коробка с боеприпасами в руках
    mp.attachmentMngr.register("ammoBox", "prop_box_ammo04a", 58867, new mp.Vector3(0.2, -0.3, 0.1),
        new mp.Vector3(-45, 20, 120), {
            dict: "anim@heists@box_carry@",
            name: "idle",
            speed: 8,
            flag: 49
        }
    );
    // коробка с медикаментами в руках
    mp.attachmentMngr.register("medicinesBox", "ex_office_swag_pills4", 58867, new mp.Vector3(0.2, -0.3, 0.1),
        new mp.Vector3(-45, 20, 120), {
            dict: "anim@heists@box_carry@",
            name: "idle",
            speed: 8,
            flag: 49
        }
    );
});

mp.events.add("factions.insideWarehouse", mp.factions.insideWarehouse);

mp.events.add("factions.insideFactionWarehouse", mp.factions.insideFactionWarehouse);

mp.events.add("factions.giverank.showMenu", mp.factions.showGiveRankSelectMenu);

mp.events.add("factions.storage.showMenu", mp.factions.showStorageSelectMenu);
