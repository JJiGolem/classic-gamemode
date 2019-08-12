"use strict";

module.exports = {
    inventoryItems: [],
    clientInventoryItems: {}, // объект, подготовленный для отправки на клиент игрока
    masksWithHideHairs: [114],

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
            client[item.id] = {
                name: item.name,
                description: item.description,
                height: item.height,
                width: item.width,
                weight: item.weight
            };
        }
        return client;
    },
    // Отправка общей информации о предметах игроку
    initPlayerItemsInfo(player) {
        player.call(`inventory.setItemsInfo`, [this.clientInventoryItems]);
        console.log(`[INVENTORY] Для игрока ${player.character.name} загружена общая информация о предметах`);
    },
    async initPlayerInventory(player) {
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
                },
                {
                    model: db.Models.CharacterInventory,
                    as: "children",
                    include: [{
                            model: db.Models.CharacterInventoryParam,
                            as: "params"
                        },
                        {
                            model: db.Models.InventoryItem,
                            as: "item"
                        },
                        {
                            model: db.Models.CharacterInventory,
                            as: "children",
                            include: [{
                                    model: db.Models.CharacterInventoryParam,
                                    as: "params"
                                },
                                {
                                    model: db.Models.InventoryItem,
                                    as: "item"
                                },
                                {
                                    model: db.Models.CharacterInventory,
                                    as: "children",
                                    include: [{
                                            model: db.Models.CharacterInventoryParam,
                                            as: "params"
                                        },
                                        {
                                            model: db.Models.InventoryItem,
                                            as: "item"
                                        },
                                        {
                                            model: db.Models.CharacterInventory,
                                            as: "children",
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        player.inventory = {
            denyUpdateView: false, // запрещено ли обновлять внешний вид игрока
            items: dbItems, // предметы игрока
        };
        player.call(`inventory.initItems`, [this.convertServerToClientPlayerItems(dbItems)]);
        console.log(`[INVENTORY] Для игрока ${player.character.name} загружены предметы (${dbItems.length} шт.)`);
    },
    convertServerToClientPlayerItems(dbItems) {
        // console.log("convertServerToClientPlayerItems");
        var clientItems = {};
        for (var i = 0; i < dbItems.length; i++) {
            var dbItem = dbItems[i];
            if (!dbItem.parentId) clientItems[dbItem.index] = this.convertServerToClientItem(dbItem);
        }
        return clientItems;
    },
    convertServerToClientItem(dbItem) {
        // console.log(`convertServerToClientItem`);
        var params = {};
        for (var i = 0; i < dbItem.params.length; i++) {
            var param = dbItem.params[i];
            params[param.key] = param.value;
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
        if (dbItem.children.length > 0) {
            for (var i = 0; i < dbItem.children.length; i++) {
                var child = dbItem.children[i];
                clientItem.pockets[child.pocketIndex].items[child.index] = this.convertServerToClientItem(child);
            }
        }
        return clientItem;
    },
    getItem(player, sqlId) {
        for (var i = 0; i < player.inventory.items.length; i++) {
            var item = player.inventory.items[i];
            if (item.id == sqlId) return item;
        }
        return null;
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
                player.armour = parseInt(params.armour);
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
                for (var key in player.inventory.items) {
                    var item = player.inventory.items[key];
                    if (item.itemId == itemId) {
                        item.params.armour = parseInt(player.armour);
                        player.inventory.updateParams(key, item);
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
                player.setClothes(4, 21, 0, 0);
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
        }
        return params;
    },
};
