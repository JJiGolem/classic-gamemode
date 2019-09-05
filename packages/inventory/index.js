"use strict";

module.exports = {
    // Общая информация о предметах
    inventoryItems: [],
    // Объект, подготовленный для отправки на клиент игрока
    clientInventoryItems: {},
    // Маски, при надевании которых, нужно скрывать волосы
    masksWithHideHairs: [114],
    // Вайт-лист предметов, которые можно надеть
    bodyList: {
        // columnIndex: [itemId, ...]
        0: [1],
        1: [6],
        2: [14],
        3: [2], 
        4: [3],
        5: [7],
        6: [11],
        7: [10],
        8: [12],
        9: [], // автоматы
        10: [13],
        11: [8],
        12: [9],
    },
    // Блек-лист предметов, которые не могут храниться в других предметах
    blackList: {
        // parentItemId: [cildItemId, ...]
        3: [13],
        7: [13],
        8: [13],
    },
    // Кол-во предметов на земле от одного игрока
    groundMaxItems: 30,
    // Время жизни предмета на земле (ms)
    groundItemTime: 2 * 60 * 1000,
    // Макс. дистанция до предмета, чтобы поднять его
    groundMaxDist: 2,

    init() {
        this.loadInventoryItemsFromDB();
    },

    // Загрузка общей информации о предметах из БД в данный модуль
    async loadInventoryItemsFromDB() {
        var dbItems = await db.Models.InventoryItem.findAll();
        this.inventoryItems = dbItems;
        this.clientInventoryItems = this.convertServerInventoryItemsToClient(dbItems);
        console.log(`[INVENTORY] Предметы инвентаря загружены (${dbItems.length} шт.)`);
    },
    convertServerInventoryItemsToClient(dbItems) {
        var client = {};
        for (var i = 0; i < dbItems.length; i++) {
            var item = dbItems[i];
            client[item.id] = this.convertServerInventoryItemToClient(item);
        }
        return client;
    },
    convertServerInventoryItemToClient(item) {
        return {
            name: item.name,
            description: item.description,
            height: item.height,
            width: item.width,
            weight: item.weight
        };
    },
    // Отправка общей информации о предметах игроку
    initPlayerItemsInfo(player) {
        player.call(`inventory.setItemsInfo`, [this.clientInventoryItems]);
        console.log(`[INVENTORY] Для игрока ${player.character.name} загружена общая информация о предметах`);
    },
    // Отправка общей информации о предмете
    updateItemInfo(item) {
        this.clientInventoryItems[item.id] = this.convertServerInventoryItemToClient(item);
        mp.players.forEach((rec) => {
            if (rec.character) rec.call(`inventory.setItemInfo`, [item.id, this.clientInventoryItems[item.id]]);
        });
    },
    async initPlayerInventory(player) {
        this.clearAllView(player);
        // TODO: include in include in include... WTF??? (08.08.19 Carter Slade)
        var dbItems = await db.Models.CharacterInventory.findAll({
            where: {
                playerId: player.character.id
            },
            order: [
                ['parentId', 'ASC']
            ],
            include: [{
                    model: db.Models.CharacterInventoryParam,
                    as: "params"
                },
                {
                    model: db.Models.InventoryItem,
                    as: "item"
                }
            ]
        });

        player.inventory = {
            denyUpdateView: false, // запрещено ли обновлять внешний вид игрока
            items: dbItems, // предметы игрока
            ground: [], // объекты на земле, которые выкинул игрок
            place: { // багажник/шкаф/холодильник и пр. при взаимодействии
                type: "",
                sqlId: 0,
                items: [],
            },
        };
        this.updateAllView(player);
        this.loadWeapons(player);
        player.call(`inventory.initItems`, [this.convertServerToClientItems(dbItems)]);
        console.log(`[INVENTORY] Для игрока ${player.character.name} загружены предметы (${dbItems.length} шт.)`);
    },
    async initVehicleInventory(vehicle) {
        // TODO: include in include in include... WTF??? (08.08.19 Carter Slade)
        var dbItems = await db.Models.VehicleInventory.findAll({
            where: {
                vehicleId: vehicle.db.id
            },
            order: [
                ['parentId', 'ASC']
            ],
            include: [{
                    model: db.Models.VehicleInventoryParam,
                    as: "params"
                },
                {
                    model: db.Models.InventoryItem,
                    as: "item"
                }
            ]
        });

        vehicle.inventory = {
            items: dbItems, // предметы в багажнике
        };
        console.log(`[INVENTORY] Для авто ${vehicle.db.modelName} загружены предметы (${dbItems.length} шт.)`);
    },
    convertServerToClientItems(dbItems) {
        // console.log("convertServerToClientItems");
        var clientItems = {};
        for (var i = 0; i < dbItems.length; i++) {
            var dbItem = dbItems[i];
            if (!dbItem.parentId) clientItems[dbItem.index] = this.convertServerToClientItem(dbItems, dbItem);
        }
        return clientItems;
    },
    convertServerToClientItem(items, dbItem) {
        // console.log(`convertServerToClientItem`);
        var params = {};
        if (dbItem.params) {
            for (var i = 0; i < dbItem.params.length; i++) {
                var param = dbItem.params[i];
                params[param.key] = param.value;
            }
        }
        var clientItem = {
            sqlId: dbItem.id,
            itemId: dbItem.itemId,
            params: params
        };
        if (params.pockets) {
            params.pockets = JSON.parse(params.pockets);
            clientItem.pockets = [];
            for (var j = 0; j < params.pockets.length; j += 2) {
                clientItem.pockets.push({
                    cols: params.pockets[j],
                    rows: params.pockets[j + 1],
                    items: {}
                });
            }
            delete params.pockets;
        }
        var children = this.getChildren(items, dbItem);
        if (children.length > 0) {
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                clientItem.pockets[child.pocketIndex].items[child.index] = this.convertServerToClientItem(items, child);
            }
        }
        return clientItem;
    },
    async addItem(player, itemId, params, callback = () => {}) {
        var slot = this.findFreeSlot(player, itemId);
        if (!slot) return callback(`Свободный слот для ${this.getInventoryItem(itemId).name} не найден`);
        if (params.sex && params.sex != !player.character.gender) return callback(`Предмет противоположного пола`);
        if (params.weaponHash) {
            var weapon = this.getItemByItemId(player, itemId);
            if (weapon) return callback(`Оружие ${this.getName(itemId)} уже имеется`);
            this.giveWeapon(player, params.weaponHash, params.ammo);
        }
        var struct = [];
        for (var key in params) {
            struct.push({
                key: key,
                value: params[key]
            });
        }
        var item = db.Models.CharacterInventory.build({
            playerId: player.character.id,
            itemId: itemId,
            pocketIndex: slot.pocketIndex,
            index: slot.index,
            parentId: slot.parentId,
            params: struct,
        }, {
            include: [{
                model: db.Models.CharacterInventoryParam,
                as: "params",
            }]
        });

        player.inventory.items.push(item);
        if (!item.parentId) this.updateView(player, item);
        await item.save();
        player.call("inventory.addItem", [this.convertServerToClientItem(player.inventory.items, item), item.pocketIndex, item.index, item.parentId]);
        callback();
    },
    async addOldItem(player, item, callback = () => {}) {
        var slot = this.findFreeSlot(player, item.itemId);
        if (!slot) return callback(`Свободный слот для ${this.getInventoryItem(item.itemId).name} не найден`);
        var params = this.getParamsValues(item);
        if (params.sex && params.sex != !player.character.gender) return callback(`Предмет противоположного пола`);
        if (params.weaponHash) {
            var weapon = this.getItemByItemId(player, item.itemId);
            if (weapon) return callback(`Оружие ${this.getName(item.itemId)} уже имеется`);
            this.giveWeapon(player, params.weaponHash, params.ammo);
        }

        item.playerId = player.character.id;
        item.pocketIndex = slot.pocketIndex;
        item.index = slot.index;
        item.parentId = slot.parentId;

        player.inventory.items.push(item);
        if (!item.parentId) this.updateView(player, item);
        item.restore();
        player.call("inventory.addItem", [this.convertServerToClientItem(player.inventory.items, item), item.pocketIndex, item.index, item.parentId]);
        callback();
    },
    // при перемещении предмета из игрока в окруж. среду
    async addEnvironmentItem(player, item, pocketIndex, index) {
        // console.log(`addEnvironmentItem`)
        var place = player.inventory.place;
        var params = this.getParamsValues(item);
        var struct = [];
        for (var key in params) {
            if (key == 'pockets') params[key] = JSON.stringify(params[key]);
            struct.push({
                key: key,
                value: params[key]
            });
        }
        var conf = {
            itemId: item.itemId,
            pocketIndex: pocketIndex,
            index: index,
            parentId: null,
            params: struct,
        };
        conf[place.type.toLowerCase() + "Id"] = -place.sqlId;
        var table = `${place.type}Inventory`;
        var newItem = db.Models[table].build(conf, {
            include: [{
                model: db.Models[`${table}Param`],
                as: "params",
            }]
        });
        place.items.push(newItem);
        await newItem.save();
        player.call(`inventory.setEnvironmentItemSqlId`, [item.id, newItem.id]);
    },
    // при перемещении предмета из окруж. среды в игрока
    async addPlayerItem(player, item, parentId, pocketIndex, index) {
        // console.log(`addPlayerItem`)
        var place = player.inventory.place;
        var params = this.getParamsValues(item);
        if (params.weaponHash) {
            var weapon = this.getItemByItemId(player, item.itemId);
            if (weapon) return callback(`Оружие ${this.getName(item.itemId)} уже имеется`);
            this.giveWeapon(player, params.weaponHash, params.ammo);
        }
        var struct = [];
        for (var key in params) {
            if (key == 'pockets') params[key] = JSON.stringify(params[key]);
            struct.push({
                key: key,
                value: params[key]
            });
        }
        var conf = {
            playerId: player.character.id,
            itemId: item.itemId,
            pocketIndex: pocketIndex,
            index: index,
            parentId: parentId,
            params: struct,
        };
        var newItem = db.Models.CharacterInventory.build(conf, {
            include: [{
                model: db.Models.CharacterInventoryParam,
                as: "params",
            }]
        });

        player.inventory.items.push(newItem);
        if (!newItem.parentId) this.updateView(player, newItem);
        await newItem.save();
        player.call(`inventory.setItemSqlId`, [item.id, newItem.id]);
    },
    deleteItem(player, item) {
        if (typeof item == 'number') item = this.getItem(player, item);
        if (!item) return console.log(`[inventory.deleteItem] Предмет #${item} у ${player.name} не найден`);
        var params = this.getParamsValues(item);
        if (params.weaponHash) player.removeWeapon(params.weaponHash);
        if (!item.parentId) this.clearView(player, item.itemId);
        item.destroy();
        player.call("inventory.deleteItem", [item.id]);

        this.clearArrayItems(player, item);
    },
    clearItems(player) {
        var items = player.inventory.items;
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (!item.parentId) {
                this.deleteItem(player, item);
                i--;
            }
        }
    },
    clearArrayItems(player, item) {
        var items = player.inventory.items;
        var children = this.getChildren(items, item);
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            child.destroy(); // из-за paranoid: true
            var params = this.getParamsValues(child);
            if (params.weaponHash) player.removeWeapon(params.weaponHash);
            this.clearArrayItems(player, child);
        }
        var index = items.indexOf(item);
        items.splice(index, 1);
    },
    getArrayItems(player, item, result = []) {
        var items = player.inventory.items;
        var children = this.getChildren(items, item);
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            result.push(child);
            result = this.getArrayItems(player, child, result);
        }
        return result;
    },
    getArrayWeapons(player) {
        return this.findArrayWeapons(player.inventory.items);
    },
    findArrayWeapons(items) {
        var result = [];
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var params = this.getParamsValues(item);
            if (!params.weaponHash) continue;
            result.push(item);
            var children = this.getChildren(items, item);
            if (!children.length) continue;

            result = result.concat(this.findArrayWeapons(children));
        }
        return result;
    },
    getInventoryItem(itemId) {
        return this.inventoryItems[itemId - 1];
    },
    getName(itemId) {
        return this.inventoryItems[itemId - 1].name;
    },
    getItem(player, sqlId) {
        for (var i = 0; i < player.inventory.items.length; i++) {
            var item = player.inventory.items[i];
            if (item.id == sqlId) return item;
        }
        return null;
    },
    getChildren(items, item) {
        var children = [];
        for (var i = 0; i < items.length; i++) {
            var child = items[i];
            if (child.parentId == item.id) children.push(child);
        }
        return children;
    },
    getChildrenInPocket(items, item, pocketIndex) {
        var children = [];
        for (var i = 0; i < items.length; i++) {
            var child = items[i];
            if (child.parentId == item.id && child.pocketIndex == pocketIndex) children.push(child);
        }
        return children;
    },
    updateView(player, item) {
        if (player.inventory.denyUpdateView) return;
        if (player.character.id != item.playerId) return;

        var params = this.getParamsValues(item);

        var clothesIndexes = {
            "2": 7,
            "8": 4,
            "9": 6,
            "13": 5
        };
        var propsIndexes = {
            "6": 0,
            "1": 1,
            "10": 2,
            "11": 6,
            "12": 7
        };
        var otherItems = {
            "3": () => {
                player.armour = parseInt(params.health);
                player.setClothes(9, params.variation, params.texture, 0);
            },
            "7": () => {
                var texture = params.tTexture || 0;
                player.setClothes(3, params.torso || 0, texture, 0);
                player.setClothes(11, params.variation, params.texture, 0);
                var texture = params.uTexture || 0;
                if (params.undershirt != null) player.setClothes(8, params.undershirt, texture, 0);
            },
            "14": (params) => {
                if (this.masksWithHideHairs.includes(params.variation)) player.setClothes(2, 0, 0, 0);
                player.setClothes(1, params.variation, params.texture, 0);
            }
        };

        if (clothesIndexes[item.itemId] != null) {
            player.setClothes(clothesIndexes[item.itemId], params.variation, params.texture, 0);
        } else if (propsIndexes[item.itemId] != null) {
            player.setProp(propsIndexes[item.itemId], params.variation, params.texture);
        } else if (otherItems[item.itemId] != null) {
            otherItems[item.itemId](params);
        } else if (params.weaponHash) {
            player.removeWeapon(params.weaponHash);
        } else return console.log("Неподходящий тип предмета для тела!");

    },
    clearView(player, itemId) {
        var clothesIndexes = {
            "2": 7,
            "13": 5
        };
        var propsIndexes = {
            "6": 0,
            "1": 1,
            "10": 2,
            "11": 6,
            "12": 7
        };
        var otherItems = {
            "3": () => {
                if (player.inventory) {
                    for (var i = 0; i < player.inventory.items.length; i++) {
                        var item = player.inventory.items[i];
                        if (!item.parentId && item.itemId == itemId) {
                            this.updateParam(player, item, "health", parseInt(player.armour));
                        }
                    }
                }
                player.armour = 0;
                player.setClothes(9, 0, 0, 0);
            },
            "7": () => {
                // 0 - муж, 1 - жен
                var index = (player.character.gender == 0) ? 15 : 82;
                var undershirtDefault = (player.character.gender == 0) ? 15 : 14;
                player.setClothes(3, 15, 0, 0);
                player.setClothes(11, index, 0, 0);
                player.setClothes(8, undershirtDefault, 0, 0);
            },
            "8": () => {
                player.setClothes(4, 18, 2, 0);
            },
            "9": () => {
                var index = (player.character.gender == 0) ? 34 : 35;
                player.setClothes(6, index, 0, 0);
            },
            "14": () => {
                player.setClothes(2, player.character.hair, 0, 0);
                player.setClothes(1, 0, 0, 0);
            }
        };

        if (clothesIndexes[itemId] != null) {
            player.setClothes(clothesIndexes[itemId], 0, 0, 0);
        } else if (propsIndexes[itemId] != null) {
            player.setProp(propsIndexes[itemId], -1, 0);
        } else if (otherItems[itemId] != null) {
            otherItems[itemId]();
        } else return console.log("Неподходящий тип предмета для тела!");
    },
    updateAllView(player) {
        for (var i = 0; i < player.inventory.items.length; i++) {
            var item = player.inventory.items[i];
            if (item.parentId) continue;
            this.updateView(player, item);
        }
    },
    clearAllView(player) {
        for (var index in this.bodyList) {
            var itemIds = this.bodyList[index];
            itemIds.forEach((itemId) => {
                this.clearView(player, itemId);
            });
        }
    },
    getParam(item, key) {
        for (var i = 0; i < item.params.length; i++) {
            var param = item.params[i];
            if (param.key == key) return param;
        }
        return null;
    },
    getParamsValues(item) {
        var params = {};
        for (var i = 0; i < item.params.length; i++) {
            var param = item.params[i];
            params[param.key] = param.value;
            if (param.key == 'pockets') params[param.key] = JSON.parse(params[param.key]);
        }
        return params;
    },
    updateParam(player, item, key, value) {
        var param = this.getParam(item, key);
        if (!param) return;
        param.value = value;
        param.save();
        player.call(`inventory.setItemParam`, [item.id, key, value]);
    },
    findFreeSlot(player, itemId) {
        var items = player.inventory.items;
        for (var bodyIndex in this.bodyList) {
            var list = this.bodyList[bodyIndex];
            if (list.includes(itemId)) { // предмет, можно надеть
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    if (!item.parentId && item.index == bodyIndex) break; // другой предмет на тело уже надет
                }
                var isFind = !items.length || (i && i == items.length);
                if (isFind) return {
                    pocketIndex: null,
                    index: bodyIndex,
                    parentId: null
                };
            }
        }

        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var params = this.getParamsValues(item);
            if (item.parentId || !params.pockets) continue; // предмет в предмете или не имеет карманы
            if (item.itemId == itemId) continue; // тип предмета совпадает (рубашку в рубашку нельзя и т.д.)
            if (this.blackList[item.itemId].includes(itemId)) continue; // предмет в черном списке (сумку в рубашку нельзя и т.д.)
            for (var j = 0; j < params.pockets.length / 2; j++) {
                var matrix = this.genMatrix(player, item, j);
                // console.log(`itemId: ${item.itemId}`);
                // console.log(`pocketIndex: ${j}`);
                // console.log(`matrix:`);
                // console.log(matrix);
                if (!matrix) continue;

                var freeIndex = this.findFreeIndexMatrix(matrix, itemId);
                // console.log(`freeIndex: ${freeIndex}`)
                if (freeIndex == -1) continue;

                return {
                    pocketIndex: j,
                    index: freeIndex,
                    parentId: item.id
                };
            }
        }
        return null;
    },
    genMatrix(player, item, pocketIndex) {
        var params = this.getParamsValues(item);
        if (!params.pockets) return null;

        var matrix = [];
        var cols = params.pockets[pocketIndex * 2];
        var rows = params.pockets[pocketIndex * 2 + 1];
        // Создаем пустую матрицу
        for (var i = 0; i < rows; i++) {
            matrix[i] = [];
            for (var j = 0; j < cols; j++) {
                matrix[i][j] = 0;
            }
        }

        var children = this.getChildrenInPocket(player.inventory.items, item, pocketIndex);
        // console.log(`------------ children:`);
        // console.log(children);
        // Наполняем матрицу занятами ячейками
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            var coord = this.indexToXY(rows, cols, child.index);
            if (!coord) continue;

            var info = this.getInventoryItem(child.itemId);
            for (var x = 0; x < info.width; x++) {
                for (var y = 0; y < info.height; y++) {
                    matrix[coord.y + y][coord.x + x] = 1;
                }
            }
        }

        return matrix;
    },
    indexToXY(rows, cols, index) {
        if (!rows || !cols) return null;
        var x = index % cols;
        var y = (index - x) / cols;
        if (x >= cols || y >= rows) return null;
        return {
            x: x,
            y: y
        };
    },
    xyToIndex(rows, cols, coord) {
        if (!rows || !cols) return -1;
        return coord.y * cols + coord.x;
    },
    findFreeIndexMatrix(matrix, itemId) {
        var info = this.getInventoryItem(itemId);
        if (!info || !matrix) return -1;
        var w = info.width;
        var h = info.height;

        for (var i = 0; i < matrix.length - h + 1; i++) {
            for (var j = 0; j < matrix[i].length - w + 1; j++) {
                var doBreak = false;
                for (var y = 0; y < h; y++) {
                    for (var x = 0; x < w; x++) {
                        if (matrix[i + y][j + x] == 1) {
                            doBreak = true;
                            break;
                        }
                    }
                    if (doBreak) break;
                }
                if (!doBreak) return this.xyToIndex(matrix.length, matrix[0].length, {
                    x: j,
                    y: i
                });
            }
        }

        return -1;
    },
    getItemByItemId(player, itemIds) {
        if (!Array.isArray(itemIds)) itemIds = [itemIds];
        var items = player.inventory.items;
        return items.find(item => itemIds.includes(item.itemId));
    },
    getArrayByItemId(player, itemIds) {
        if (!Array.isArray(itemIds)) itemIds = [itemIds];
        var items = player.inventory.items;
        var result = [];
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (itemIds.includes(item.itemId)) result.push(item);
        }
        return result;
    },
    // Полное удаление предметов инвентаря с сервера
    fullDeleteItemsByParams(itemIds, keys, values) {
        // console.log(`fullDeleteItemsByParams`)
        if (itemIds && !Array.isArray(itemIds)) itemIds = [itemIds];
        if (!Array.isArray(keys)) keys = [keys];
        if (!Array.isArray(values)) values = [values];

        // у всех игроков онлайн
        mp.players.forEach((rec) => {
            if (!rec.character) return;

            this.deleteByParams(rec, itemIds, keys, values);
        });
        // у всех багажников авто онлайн
        mp.vehicles.forEach((veh) => {
            if (!veh.inventory) return;

            // this.deleteByParams(veh, itemIds, keys, values);
        });
        // предметы на земле
        mp.objects.forEach((obj) => {
            if (!obj.getVariable("groundItem")) return;
            var item = obj.item;
            for (var j = 0; j < obj.children.length; j++) {
                var child = obj.children[j];
                if (itemIds && !itemIds.includes(child.itemId)) continue;
                var doDelete = true;
                var params = this.getParamsValues(child);
                for (var i = 0; i < keys.length; i++) {
                    var param = params[keys[i]];
                    if (!param) {
                        doDelete = false;
                        break;
                    }
                    if (param && param != values[i]) {
                        doDelete = false;
                        break;
                    }
                }
                if (doDelete) {
                    obj.children.splice(j, 1);
                    j--;
                }
            }
            if (itemIds && !itemIds.includes(item.itemId)) return;
            var doDelete = true;
            var params = this.getParamsValues(item);
            for (var i = 0; i < keys.length; i++) {
                var param = params[keys[i]];
                if (!param) {
                    doDelete = false;
                    break;
                }
                if (param && param != values[i]) {
                    doDelete = false;
                    break;
                }
            }
            if (doDelete) {
                clearTimeout(obj.destroyTimer);
                obj.destroy();
                var rec = mp.players.at(obj.playerId);
                if (!rec) return;
                var i = rec.inventory.ground.indexOf(obj);
                rec.inventory.ground.splice(i, 1);
            }
        });
        /* Для всех игроков из БД. */
    },
    deleteByParams(player, itemIds, keys, values) {
        // console.log(`deleteByParams: ${player.name}`)
        if (itemIds && !Array.isArray(itemIds)) itemIds = [itemIds];
        if (!Array.isArray(keys)) keys = [keys];
        if (!Array.isArray(values)) values = [values];

        if (keys.length != values.length) return;

        var items = (itemIds) ? this.getArrayByItemId(player, itemIds) : player.inventory.items;
        if (!items.length) return;

        for (var j = 0; j < items.length; j++) {
            var item = items[j];
            var params = this.getParamsValues(item);
            var doDelete = true;
            for (var i = 0; i < keys.length; i++) {
                var param = params[keys[i]];
                if (!param) {
                    doDelete = false;
                    break;
                }
                if (param && param != values[i]) {
                    doDelete = false;
                    break;
                }
            }
            if (doDelete) {
                this.deleteItem(player, item);
                j--;
            }
        }
    },
    getVehicleClientPockets(dbItems) {
        var pockets = [{
                cols: 18,
                rows: 10,
                items: {}
            },
            {
                cols: 9,
                rows: 8,
                items: {}
            },
            {
                cols: 9,
                rows: 8,
                items: {}
            },
        ];
        for (var i = 0; i < dbItems.length; i++) {
            var dbItem = dbItems[i];
            if (dbItem.parentId) continue;
            var clientItem = this.convertServerToClientItem(dbItems, dbItem);
            pockets[dbItem.pocketIndex].items[dbItem.index] = clientItem
        }
        return pockets;
    },
    // Загрузка оружия у игрока на основе предметов-оружия в инвентаре
    loadWeapons(player) {
        var weapons = this.getArrayWeapons(player);
        weapons.forEach(weapon => {
            var params = this.getParamsValues(weapon);
            this.giveWeapon(player, params.weaponHash, params.ammo);
        });
    },
    giveWeapon(player, hash, ammo) {
        if (!hash) return;
        player.giveWeapon(hash, 0);
        player.setWeaponAmmo(hash, parseInt(ammo));
    },
};
