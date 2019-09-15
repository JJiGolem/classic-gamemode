"use strict";


/*
    Модуль организаций.

    created 16.08.19 by Carter Slade
*/

mp.factions = {
    enableTakeBox: false,
    enablePutBox: false,
    typeBox: "",
    faction: null,

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
        if (mp.busy.includes()) return;
        if (this.enableTakeBox) {
            if (this.hasBox()) return mp.notify.error(`Нельзя нести больше`, `Склад`);
            mp.events.callRemote("factions.warehouse.takeBox", this.typeBox);
        } else if (this.enablePutBox) {
            if (!this.hasBox()) return mp.notify.error(`Вы не несете ящик`, `Склад`);
            mp.events.callRemote("factions.warehouse.putBox");
        }
    },
    hasBox() {
        var player = mp.players.local;
        var names = ["ammoBox", "medicinesBox"];
        for (var i = 0; i < names.length; i++) {
            if (player.hasAttachment(names[i])) return true;
        }
        return false;
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
        } else if (factionId == 3) { // LSSD
            mp.callCEFV(`selectMenu.showByName('lssdStorage')`);
        } else if (factionId == 4) { // FIB
            mp.callCEFV(`selectMenu.showByName('fibStorage')`);
        } else if (factionId == 5) { // EMS
            mp.callCEFV(`selectMenu.showByName('hospitalStorage')`);
        } else if (factionId == 6) { // ARMY
            mp.callCEFV(`selectMenu.showByName('armyStorage')`);
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
    isBandFaction(factionId) {
        return factionId >= 8 && factionId <= 11;
    },
    setFaction(factionId) {
        // mp.notify.info(`setFaction: ${factionId}`)
        this.faction = factionId;
        mp.callCEFV(`interactionMenu.faction = ${factionId}`);
    },
};

mp.events.add({
    "characterInit.done": () => {
        mp.keys.bind(69, true, () => {
            mp.factions.boxHandler();
        }); // E
        // коробка с боеприпасами в руках
        mp.attachmentMngr.register("ammoBox", "prop_box_ammo04a", 58867, new mp.Vector3(0.2, -0.3, 0.1),
            new mp.Vector3(-45, 20, 120), {
                dict: "anim@heists@box_carry@",
                name: "idle",
                speed: 8,
                flag: 49
            },
            true
        );
        // коробка с медикаментами в руках
        mp.attachmentMngr.register("medicinesBox", "ex_office_swag_pills4", 58867, new mp.Vector3(0.2, -0.3, 0.1),
            new mp.Vector3(-45, 20, 120), {
                dict: "anim@heists@box_carry@",
                name: "idle",
                speed: 8,
                flag: 49
            },
            true
        );
    },
    "factions.insideWarehouse": (inside, type) => {
        mp.factions.insideWarehouse(inside, type);
    },
    "factions.insideFactionWarehouse": (inside, type) => {
        mp.factions.insideFactionWarehouse(inside, type);
    },
    "factions.giverank.showMenu": mp.factions.showGiveRankSelectMenu,
    "factions.storage.showMenu": mp.factions.showStorageSelectMenu,
    "factions.faction.set": (val) => {
        mp.factions.setFaction(val);
    },
    "playerEnterVehicleBoot": (player, vehicle) => {
        if (mp.factions.hasBox()) {
            if (!vehicle.getVariable("trunk")) return mp.notify.warning(`Для погрузки ящика откройте багажник`);
            mp.events.callRemote(`factions.vehicle.products.put`, vehicle.remoteId);
        } else if (vehicle.getVariable("label")) {
            if (!vehicle.getVariable("unload")) return;
            mp.events.callRemote(`factions.vehicle.products.take`, vehicle.remoteId);
        }
    },
});

mp.events.addDataHandler("trunk", (vehicle, value) => {
    if (!value) return;
    if (nearBootVehicleId == null) return;
    if (nearBootVehicleId != vehicle.remoteId) return;
    if (mp.factions.hasBox()) mp.events.callRemote(`factions.vehicle.products.put`, vehicle.remoteId);
    else if (vehicle.getVariable("label")) {
        if (!vehicle.getVariable("unload")) return mp.events.callRemote(`factions.vehicle.unload`, vehicle.remoteId);
        mp.events.callRemote(`factions.vehicle.products.take`, vehicle.remoteId);
    }
});
