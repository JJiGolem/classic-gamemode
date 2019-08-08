"use strict";

module.exports = {
    inventoryItems: [],
    clientInventoryItems: {}, // объект, подготовленный для отправки на клиент игрока

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

        player.inventoryItems = dbItems;
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
};
