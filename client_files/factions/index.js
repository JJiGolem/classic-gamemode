"use strict";


/*
    Модуль организаций.

    created 16.08.19 by Carter Slade
*/

mp.factions = {
    insideFactionWar: false,
    enableTakeBox: false, // можно ли взять ящик на беск. складе
    typeBox: "",
    faction: null,
    ranks: [],
    vehRespawnPrice: 0,
    blips: {
        "holder": null,
        "storage": null,
        "warehouse": null,
    },
    blipSprites: {
        "holder": 73,
        "storage": 567,
        "warehouse": 478,
    },

    insideWarehouse(inside, type = null) {
        if (inside) mp.prompt.showByName(`take_${type}box`);
        else mp.prompt.hide();
        this.enableTakeBox = inside;
        this.typeBox = type;
    },
    insideFactionWarehouse(inside) {
        if (inside) {
            var type = this.getTypeBox();
            if (!type) mp.prompt.showByName(`take_ammobox`);
            else mp.prompt.showByName(`put_${type}box`);
        } else mp.prompt.hide();
        this.insideFactionWar = inside;
    },
    boxHandler() {
        if (!(mp.busy.includes() === 0 || (mp.busy.includes() === 1 && (mp.busy.includes('lostAttach'))))) return;
        if (this.enableTakeBox) {
            if (this.hasBox()) return mp.notify.error(`Нельзя нести больше`, `Склад`);
            mp.events.callRemote("factions.warehouse.takeBox", this.typeBox);
        } else if (this.insideFactionWar) {
            mp.events.callRemote("factions.warehouse.putBox");
        }
    },
    hasBox(player) {
        if (!player) player = mp.players.local;
        var names = ["ammoBox", "medicinesBox"];
        for (var i = 0; i < names.length; i++) {
            if (player.hasAttachment(names[i])) return true;
        }
        return false;
    },
    getTypeBox(player) {
        if (!player) player = mp.players.local;
        if (player.hasAttachment("ammoBox")) return "ammo";
        if (player.hasAttachment("medicinesBox")) return "medicines";
        return null;
    },
    showGiveRankSelectMenu(factionName, rankNames, rank, playerId) {
        if (typeof rankNames == 'object') rankNames = JSON.stringify(rankNames);
        mp.callCEFV(`selectMenu.setItemValues('factionGiveRank', 'Ранг', \`${rankNames}\`)`);
        mp.callCEFV(`selectMenu.menus['factionGiveRank'].header = \`${factionName}\``);
        mp.callCEFV(`selectMenu.menus['factionGiveRank'].items[0].i = ${rank - 1}`);
        mp.callCEFV(`selectMenu.menus['factionGiveRank'].playerId = ${playerId}`);
        mp.callCEFV(`selectMenu.showByName('factionGiveRank')`);
    },
    showStorageSelectMenu(factionId) {
        if (factionId == 1) { // Government
            mp.callCEFV(`selectMenu.showByName('governmentStorage')`);
        } else if (factionId == 2) { // LSPD
            mp.callCEFV(`selectMenu.showByName('lspdStorage')`);
        } else if (factionId == 3) { // LSSD
            mp.callCEFV(`selectMenu.showByName('lssdStorage')`);
        } else if (factionId == 4) { // FIB
            mp.callCEFV(`selectMenu.showByName('fibStorage')`);
        } else if (factionId == 5) { // EMS
            mp.callCEFV(`selectMenu.showByName('hospitalStorage')`);
        } else if (factionId == 6) { // ARMY
            mp.callCEFV(`selectMenu.showByName('armyStorage')`);
        } else if (factionId == 7) { // NEWS
            mp.callCEFV(`selectMenu.showByName('newsStorage')`);
        } else if (this.isBandFaction(factionId)) {
            mp.callCEFV(`selectMenu.showByName('bandStorage')`);
        } else if (this.isMafiaFaction(factionId)) {
            mp.callCEFV(`selectMenu.showByName('mafiaStorage')`);
        }
    },
    showMembersSelectMenu(data) {
        // debug(`showMembersSelectMenu`)
        // debug(data)
        mp.callCEFV(`selectMenu.menus['factionControlMembers'].init(${JSON.stringify(data)})`);
        mp.callCEFV(`selectMenu.showByName('factionControlMembers')`);
    },
    showVehiclesSelectMenu(data) {
        mp.callCEFV(`selectMenu.menus['factionControlVehicles'].init(${JSON.stringify(data)})`);
        mp.callCEFV(`selectMenu.showByName('factionControlVehicles')`);
    },
    showWarehouseSelectMenu(data) {
        mp.callCEFV(`selectMenu.menus['factionControlStorage'].init(${JSON.stringify(data)})`);
        mp.callCEFV(`selectMenu.showByName('factionControlStorage')`);
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
    isMafiaFaction(factionId) {
        return factionId >= 12 && factionId <= 14;
    },
    setFaction(factionId) {
        // mp.notify.info(`setFaction: ${factionId}`)
        this.faction = factionId;
        mp.callCEFV(`interactionMenu.faction = ${factionId}`);
        mp.events.call("mapCase.init", mp.players.local.name, factionId);
    },
    setRanks(ranks) {
        this.ranks = ranks;
        mp.callCEFV(`selectMenu.menus['factionControlRanks'].init(${JSON.stringify(ranks)})`);
    },
    setRankName(rank, name) {
        if (!this.ranks) return;

        this.ranks[rank - 1].name = name;
        mp.callCEFV(`selectMenu.menus['factionControlRanks'].init(${JSON.stringify(this.ranks)})`);
    },
    setBlips(positions) {
        Object.values(this.blips).forEach(blip => {
            if (!blip || !mp.blips.exists(blip)) return;
            blip.destroy();
        });
        if (!positions) return;
        for (var name in positions) {
            if (name == 'blipColor') continue;
            this.blips[name] = mp.blips.new(this.getBlipSprite(name), positions[name], {
                color: positions['blipColor'],
                dimension: positions[name].d,
                shortRange: 10,
                name: name,
            });
        }
    },
    getBlipSprite(name) {
        if (name != 'storage') return this.blipSprites[name];
        return [0, 567, 175, 175, 175, 498, 175, 498, 110, 110, 110, 110, 110, 110, 110][this.faction];
    },
    registerAttachments() {
        // коробка с боеприпасами в руках
        mp.attachmentMngr.register("ammoBox", "prop_box_ammo04a", 11363, new mp.Vector3(0.05, 0, -0.25),
            new mp.Vector3(-15, 100, 95), {
                dict: "anim@heists@box_carry@",
                name: "idle",
                speed: 8,
                flag: 49
            },
            true
        );
        // коробка с медикаментами в руках
        mp.attachmentMngr.register("medicinesBox", "ex_office_swag_pills4", 11363, new mp.Vector3(0.2, 0, -0.2),
            new mp.Vector3(-100, 0, 20), {
                dict: "anim@heists@box_carry@",
                name: "idle",
                speed: 8,
                flag: 49
            },
            true
        );
    },
    setInfo(info) {
        this.vehRespawnPrice = info.vehRespawnPrice;

        mp.callCEFV(`selectMenu.setProp('factionControlVehicles', 'respawnPrice', ${this.vehRespawnPrice})`);
        mp.callCEFV(`selectMenu.setProp('factionControl', 'inviteRank', ${info.inviteRank})`);
        mp.callCEFV(`selectMenu.setProp('factionControl', 'uvalRank', ${info.uvalRank})`);
        mp.callCEFV(`selectMenu.setProp('factionControl', 'giveRankRank', ${info.giveRankRank})`);
    },
};

mp.events.add({
    "characterInit.done": () => {
        mp.keys.bind(69, true, () => {
            if (mp.game.ui.isPauseMenuActive()) return;
            mp.factions.boxHandler();
        }); // E
    },
    "factions.insideWarehouse": (inside, type) => {
        mp.factions.insideWarehouse(inside, type);
    },
    "factions.insideFactionWarehouse": (inside) => {
        mp.factions.insideFactionWarehouse(inside);
    },
    "factions.giverank.showMenu": mp.factions.showGiveRankSelectMenu,
    "factions.storage.showMenu": (factionId) => {
        mp.factions.showStorageSelectMenu(factionId);
    },
    "factions.faction.set": (val, ranks, blipsPos) => {
        mp.factions.setFaction(val);
        mp.factions.setRanks(ranks);
        mp.factions.setBlips(blipsPos);
    },
    "factions.ranks.name.set": (data) => {
        mp.factions.setRankName(data.rank, data.name);
    },
    "factions.control.players.show": (data) => {
        mp.factions.showMembersSelectMenu(data);
    },
    "factions.control.vehicles.show": (data) => {
        mp.factions.showVehiclesSelectMenu(data);
    },
    "factions.control.warehouse.show": (data) => {
        mp.factions.showWarehouseSelectMenu(data);
    },
    "factions.info.set": (info) => {
        mp.factions.setInfo(info);
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
    if (mp.moduleVehicles.nearBootVehicleId == null) return;
    if (mp.moduleVehicles.nearBootVehicleId != vehicle.remoteId) return;
    if (mp.factions.hasBox()) mp.events.callRemote(`factions.vehicle.products.put`, vehicle.remoteId);
    else if (vehicle.getVariable("label")) {
        if (!vehicle.getVariable("unload")) return mp.events.callRemote(`factions.vehicle.unload`, vehicle.remoteId);
        mp.events.callRemote(`factions.vehicle.products.take`, vehicle.remoteId);
    }
});

mp.factions.registerAttachments();
