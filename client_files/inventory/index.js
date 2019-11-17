mp.inventory = {
    groundMaxDist: 1.8,
    lastArmour: 0,
    itemsInfo: null,
    animData: require('animations/data.js'),
    handsBlock: false,
    groundItemMarker: {},
    // Настройка аттачей на спине
    backAttachInfo: {
        41: { // Бейсбольная бита
            bone: 24818,
            pos: new mp.Vector3(0.25, -0.155, -0.1),
            rot: new mp.Vector3(13, -90, 7)
        },
        52: { // Compact Rifle
            bone: 24818,
            pos: new mp.Vector3(0.2, -0.165, -0.1),
            rot: new mp.Vector3(13, 180, 10)
        },
        53: { // MG
            bone: 24818,
            pos: new mp.Vector3(0.2, -0.165, -0.1),
            rot: new mp.Vector3(13, 180, 10)
        },
        68: { // Клюшка
            bone: 24818,
            pos: new mp.Vector3(0.2, -0.145, -0.1),
            rot: new mp.Vector3(13, -90, 10)
        },
        70: { // топор
            bone: 24818,
            pos: new mp.Vector3(0.2, -0.15, -0.1),
            rot: new mp.Vector3(13, -90, 10)
        },
        104: { // Combat MG
            bone: 24818,
            pos: new mp.Vector3(0.2, -0.165, -0.1),
            rot: new mp.Vector3(13, 180, 10)
        },
        105: { // Combat MK II
            bone: 24818,
            pos: new mp.Vector3(0.2, -0.165, -0.1),
            rot: new mp.Vector3(13, 180, 10)
        },
    },
    lastUseHandsItem: 0,
    waitUseHandsItem: 1000,

    enable(enable) {
        mp.callCEFV(`inventory.enable = ${enable}`);
    },
    debug(enable) {
        mp.callCEFV(`inventory.debug = ${enable}`);
    },
    setHandsBlock(enable) {
        if (this.handsBlock != enable) mp.callCEFV(`inventory.handsBlock = ${enable}`);
        this.handsBlock = enable;
    },
    spin(enable) {
        mp.callCEFV(`inventory.spin = ${enable}`);
    },
    initItems(items) {
        if (typeof items == 'object') items = JSON.stringify(items);
        mp.callCEFV(`inventory.initItems(${items})`);
    },
    setItemsInfo(itemsInfo) {
        this.itemsInfo = itemsInfo;

        if (typeof itemsInfo == 'object') itemsInfo = JSON.stringify(itemsInfo);
        mp.callCEFV(`inventory.setItemsInfo(${itemsInfo})`);
    },
    setItemInfo(id, itemInfo) {
        this.itemsInfo[id] = itemInfo;
        if (typeof itemInfo == 'object') itemInfo = JSON.stringify(itemInfo);
        mp.callCEFV(`inventory.setItemInfo(${id}, ${itemInfo})`);
    },
    setMergeList(list) {
        if (typeof list == 'object') list = JSON.stringify(list);
        mp.callCEFV(`inventory.setMergeList(${list})`);
    },
    setBlackList(list) {
        if (typeof list == 'object') list = JSON.stringify(list);
        mp.callCEFV(`inventory.setBlackList(${list})`);
    },
    addItem(item, pocket, index, parent) {
        if (typeof item == 'object') item = JSON.stringify(item);
        mp.callCEFV(`inventory.addItem(${item}, ${pocket}, ${index}, ${parent})`);
    },
    deleteItem(sqlId) {
        mp.callCEFV(`inventory.deleteItem(${sqlId})`);
    },
    setItemSqlId(id, sqlId) {
        mp.callCEFV(`inventory.setItemSqlId(${id}, ${sqlId})`);
    },
    setItemParam(sqlId, key, value) {
        mp.callCEFV(`inventory.setItemParam(${sqlId}, \`${key}\`, \`${value}\`)`);
    },
    addEnvironmentPlace(place) {
        if (typeof place == 'object') place = JSON.stringify(place);
        mp.callCEFV(`inventory.addEnvironmentPlace(${place})`);
    },
    deleteEnvironmentPlace(sqlId) {
        mp.callCEFV(`inventory.deleteEnvironmentPlace(${sqlId})`);
    },
    setEnvironmentItemSqlId(id, sqlId) {
        mp.callCEFV(`inventory.setEnvironmentItemSqlId(${id}, ${sqlId})`);
    },
    deleteEnvironmentItem(id) {
        mp.callCEFV(`inventory.deleteEnvironmentItem(${id})`);
    },
    setMaxPlayerWeight(val) {
        mp.callCEFV(`inventory.maxPlayerWeight = ${val}`)
    },
    setSatiety(val) {
        mp.callCEFV(`inventory.satiety = ${val}`)
    },
    setThirst(val) {
        mp.callCEFV(`inventory.thirst = ${val}`)
    },
    setArmour(val) {
        if (this.lastArmour == val) return;
        this.lastArmour = val;
        mp.callCEFV(`inventory.setArmour(${val})`);
    },
    getNearGroundItemObject(pos) {
        var itemObj, minDist = 9999;
        mp.objects.forEach((obj) => {
            var objPos = obj.position;
            let dist = mp.game.system.vdist(pos.x, pos.y, pos.z, objPos.x, objPos.y, objPos.z);
            if (dist > mp.inventory.groundMaxDist) return;
            if (!obj.getVariable("groundItem")) return;
            if (dist > minDist) return;

            minDist = dist;
            itemObj = obj;
        });
        return itemObj;
    },
    takeItemHandler() {
        // поднятие предмета с земли
        if (mp.busy.includes()) return;
        if (mp.players.local.vehicle) return;
        var pos = mp.players.local.getOffsetFromInWorldCoords(0, 0, 0);
        var itemObj = this.getNearGroundItemObject(pos);
        if (!itemObj) return;
        // TODO: проверка на аттачи
        mp.events.callRemote("item.ground.take", itemObj.remoteId);
    },
    loadHotkeys() {
        if (!mp.storage.data.hotkeys) mp.storage.data.hotkeys = {};
        var hotkeys = mp.storage.data.hotkeys;
        // mp.terminal.debug(`[inventory] loadHotkeys:`)
        // mp.terminal.debug(hotkeys);
        for (var key in hotkeys) {
            var sqlId = hotkeys[key];
            key = parseInt(key);
            mp.callCEFV(`inventory.bindHotkey(${sqlId}, ${key})`);
        }
    },
    saveHotkey(sqlId, key) {
        // mp.terminal.debug(`[inventory] saveHotkey: ${sqlId} ${key}`)
        mp.inventory.clearHotkeys(sqlId);
        var hotkeys = mp.storage.data.hotkeys;
        hotkeys[key] = sqlId;
    },
    removeHotkey(key) {
        // mp.terminal.debug(`[inventory] removeHotkey: ${key}`)
        var hotkeys = mp.storage.data.hotkeys;
        delete hotkeys[key];
    },
    clearHotkeys(sqlId) {
        var hotkeys = mp.storage.data.hotkeys;
        for (var key in hotkeys) {
            var itemSqlId = hotkeys[key];
            if (sqlId == itemSqlId) this.removeHotkey(key);
        }
    },
    registerWeaponAttachments(list, models) {
        for (var i = 0; i < list.length; i++) {
            var itemId = list[i];
            var model = models[i];

            var bone = 24818;
            var pos = new mp.Vector3(0.2, -0.155, -0.1);
            var rot = new mp.Vector3(13, 180, 10);

            if (this.backAttachInfo[itemId]) {
                bone = this.backAttachInfo[itemId].bone;
                pos = this.backAttachInfo[itemId].pos;
                rot = this.backAttachInfo[itemId].rot;
            }

            mp.attachmentMngr.register(`weapon_${itemId}`, model, bone, pos, rot);
        }
        mp.callCEFV(`inventory.setBodyList(9, ${JSON.stringify(list)})`)
    },
    disableControlActions() {
        mp.game.controls.disableControlAction(1, 157, true);
        mp.game.controls.disableControlAction(1, 158, true);
        mp.game.controls.disableControlAction(1, 159, true);
        mp.game.controls.disableControlAction(1, 160, true);
        mp.game.controls.disableControlAction(1, 161, true);
        mp.game.controls.disableControlAction(1, 162, true);
        mp.game.controls.disableControlAction(1, 163, true);
        mp.game.controls.disableControlAction(1, 164, true);
        mp.game.controls.disableControlAction(1, 165, true);
    },
    hands(player, itemId) {
        if (!this.itemsInfo) return;
        if (itemId) {
            if (player.vehicle) return;
            var info = this.itemsInfo[itemId];
            var object = mp.objects.new(mp.game.joaat(info.model), player.position);
            var pos = info.attachInfo.pos;
            var rot = info.attachInfo.rot;
            object.attachTo(player.handle,
                player.getBoneIndex(info.attachInfo.bone),
                pos[0], pos[1], pos[2],
                rot[0], rot[1], rot[2],
                false, false, false, false, 2, true);

            if (info.attachInfo.anim) {
                var a = this.animData[info.attachInfo.anim].split(" ");
                player.clearTasksImmediately();
                mp.utils.requestAnimDict(a[0], () => {
                    player.taskPlayAnim(a[0], a[1], 8, 0, -1, 49, 0, false, false, false);
                });
            }
            player.hands = {
                object: object,
                itemId: itemId
            };
        } else {
            if (!player.hands) return;
            if (this.itemsInfo[player.hands.itemId].attachInfo.anim) player.clearTasksImmediately();
            if (mp.objects.exists(player.hands.object)) {
                player.hands.object.destroy();
                delete player.hands;
            }
        }
    },
    syncAmmo(weapon) {
        if (!weapon) return;
        var ammo = mp.weapons.getAmmoWeapon(weapon);
        mp.callCEFV(`inventory.setAmmo('${weapon.toString()}', ${ammo})`);
    },
    initGroundItemMarker() {
        this.groundItemMarker = mp.markers.new(2, new mp.Vector3(0, 0, 0), 0.1, {
            rotation: new mp.Vector3(0, 180, 0),
            visible: false,
            color: [255, 223, 41, 255],
            dimension: -1
        });
        this.groundItemMarker.ignoreCheckVisible = true;
    },
    getGroundItemPos(player) {
        var pos;
        if (!player.vehicle) {
            pos = player.getOffsetFromInWorldCoords(0, 1, 0);
            pos.z = mp.game.gameplay.getGroundZFor3dCoord(pos.x, pos.y, pos.z, false, false);
        } else {
            var seat = mp.moduleVehicles.getSeat(player);
            var offsetX = 0;
            if (seat == -1 || seat == 1) offsetX = -1;
            else if (seat === 0 || seat == 2) offsetX = 1;
            pos = player.getOffsetFromInWorldCoords(offsetX, 0, 0);
            pos.z = mp.game.gameplay.getGroundZFor3dCoord(pos.x, pos.y, pos.z, false, false);
        }
        if (mp.vdist(player.position, pos) > 10) pos = player.getOffsetFromInWorldCoords(0, 0, -1);
        return pos;
    },
};

mp.events.add("characterInit.done", () => {
    mp.inventory.enable(true);
    mp.keys.bind(69, true, () => { // E
        mp.inventory.takeItemHandler();
    });
    mp.inventory.initGroundItemMarker();
});

mp.events.add("click", (x, y, upOrDown, leftOrRight, relativeX, relativeY, worldPosition, hitEntity) => {
    if (upOrDown != 'down') return;
    if (mp.game.ui.isPauseMenuActive()) return;
    if (mp.busy.includes()) return;
    if (!mp.players.local.getVariable("hands")) return;
    if (Date.now() - mp.inventory.lastUseHandsItem < mp.inventory.waitUseHandsItem) {
        mp.callCEFV(`inventory.clearHands()`);
        mp.inventory.lastUseHandsItem = Date.now();
        return;
    }
    mp.inventory.lastUseHandsItem = Date.now();
    mp.callCEFV(`inventory.onUseHandsItem()`);
});

mp.events.add("inventory.enable", mp.inventory.enable);

mp.events.add("inventory.debug", mp.inventory.debug);

mp.events.add("inventory.spin", mp.inventory.spin);

mp.events.add("inventory.initItems", (items) => {
    mp.inventory.initItems(items);
    mp.inventory.loadHotkeys();
});

mp.events.add("inventory.setItemsInfo", (itemsInfo) => {
    mp.inventory.setItemsInfo(itemsInfo);
});

mp.events.add("inventory.setItemInfo", (id, info) => {
    mp.inventory.setItemInfo(id, info);
});

mp.events.add("inventory.setMergeList", mp.inventory.setMergeList);

mp.events.add("inventory.setBlackList", mp.inventory.setBlackList);

mp.events.add("inventory.deleteItem", mp.inventory.deleteItem);

mp.events.add("inventory.setItemSqlId", mp.inventory.setItemSqlId);

mp.events.add("inventory.addItem", mp.inventory.addItem);

mp.events.add("inventory.setItemParam", mp.inventory.setItemParam);

mp.events.add("inventory.addEnvironmentPlace", mp.inventory.addEnvironmentPlace);

mp.events.add("inventory.deleteEnvironmentPlace", mp.inventory.deleteEnvironmentPlace);

mp.events.add("inventory.setEnvironmentItemSqlId", mp.inventory.setEnvironmentItemSqlId);

mp.events.add("inventory.deleteEnvironmentItem", mp.inventory.deleteEnvironmentItem);

mp.events.add("inventory.setMaxPlayerWeight", mp.inventory.setMaxPlayerWeight);

mp.events.add("inventory.registerWeaponAttachments", (list, models) => {
    mp.inventory.registerWeaponAttachments(list, models);
});

mp.events.add("inventory.setSatiety", mp.inventory.setSatiety);

mp.events.add("inventory.setThirst", mp.inventory.setThirst);

mp.events.add("inventory.saveHotkey", mp.inventory.saveHotkey);

mp.events.add("inventory.removeHotkey", mp.inventory.removeHotkey);

mp.events.add("inventory.ground.put", (sqlId) => {
    var pos = mp.inventory.getGroundItemPos(mp.players.local);
    mp.events.callRemote(`item.ground.put`, sqlId, JSON.stringify(pos));
});

mp.events.add("playerEnterVehicleBoot", (player, vehicle) => {
    // mp.notify.info(`enterBoot: #${vehicle.remoteId}`);
    if (!vehicle.getVariable("trunk")) return;
    if (vehicle.getVariable("static")) return;
    if (player.vehicle) return;
    mp.prompt.showByName("vehicle_items_boot");
    mp.events.callRemote(`vehicle.boot.items.request`, vehicle.remoteId);
});

mp.events.add("playerExitVehicleBoot", (player, vehicle) => {
    // mp.notify.info(`exitBoot: #${vehicle.remoteId}`);
    if (vehicle.getVariable("static")) return;
    mp.events.callRemote(`vehicle.boot.items.clear`, vehicle.remoteId);
});

mp.events.add("playerWeaponShot", (targetPos, targetEntity) => {
    mp.inventory.syncAmmo(mp.players.local.weapon);
});

mp.events.add("playerWeaponChanged", (weapon, oldWeapon) => {
    mp.inventory.syncAmmo(oldWeapon);
});

mp.events.add("entityStreamIn", (entity) => {
    if (entity.type != "player") return;
    var itemId = entity.getVariable("hands");
    mp.inventory.hands(entity, itemId);
});

mp.events.add("entityStreamOut", (entity) => {
    if (entity.type != "player") return;
    if (!entity.handsObject) return;
    mp.inventory.hands(entity, null);
});

mp.events.add("time.main.tick", () => {
    var player = mp.players.local;
    var value = player.getArmour();
    mp.inventory.setArmour(value);
    mp.inventory.setHandsBlock(player.vehicle != null);

    mp.objects.forEach(obj => {
        if (obj.getVariable("groundItem")) mp.utils.setNoCollision(obj, true);
    });
});

mp.events.add("render", () => {
    mp.inventory.disableControlActions();

    var player = mp.players.local;
    var itemObj = mp.inventory.getNearGroundItemObject(player.position);
    if (itemObj && !player.vehicle) {
        var pos = itemObj.position;
        pos.z += 0.5;
        mp.inventory.groundItemMarker.position = pos;
        mp.inventory.groundItemMarker.visible = true;
    } else mp.inventory.groundItemMarker.visible = false;
    if (player.getVariable("hands")) {
        mp.game.controls.disableControlAction(0, 24, true); /// удары
        mp.game.controls.disableControlAction(0, 25, true); /// INPUT_AIM
        mp.game.controls.disableControlAction(0, 140, true); /// удары R
    }
});

mp.events.addDataHandler("trunk", (vehicle, value) => {
    if (mp.moduleVehicles.nearBootVehicleId == null) return;
    if (mp.moduleVehicles.nearBootVehicleId != vehicle.remoteId) return;
    if (value) {
        mp.events.callRemote(`vehicle.boot.items.request`, vehicle.remoteId);
        mp.prompt.showByName("vehicle_items_boot");
    } else {
        mp.events.callRemote(`vehicle.boot.items.clear`, vehicle.remoteId);
        mp.prompt.showByName("vehicle_open_boot");
    }
});

mp.events.addDataHandler("hands", (player, itemId) => {
    // debug(`${player.name} hands ${itemId}`)
    mp.inventory.hands(player, itemId);
});
