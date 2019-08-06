"use strict";

module.exports = {
    inventoryItems: {},

    async loadInventoryItemsFromDB() {
        var dbItems = await db.Models.InventoryItem.findAll();
        this.inventoryItems = dbItems;
        console.log(`[INVENTORY] Предметы инвентаря загружены (${dbItems.length} шт.)`);
    },
    async initPlayerInventory(player) {
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

                    }]
                }
            ]
        });

        player.inventoryItems = dbItems;
        player.call(`inventory.initItems`, [this.convertServerToClientPlayerItems(dbItems)]);
        console.log(`[INVENTORY] Для игрока ${player.character.name} загружены предметы (${dbItems.length} шт.)`);
    },
    convertServerToClientPlayerItems(items) {
        console.log("convert");
        // console.log(items)
        // return
        var result = {};

        for (var i = 0; i < items.length; i++) {
            if (!items[i].parentId) result[items[i].index] = this.convertServerToClientItem(items[i]);
        }
        console.log(result);
        return result;

        for (var i = 0; i < result.length; i++) {

            if (result[i].parentId == -1 || !result[i].parentId) {
                delete result[i].parentId;
            } else {
                for (var j = 0; j < result.length; j++) {
                    if (result[j].id == result[i].parentId) {
                        result[j].items[result[i].index] = result[i];
                        break;
                    }
                }
            }
        }

        for (var i = 0; i < result.length; i++) {
            if (!result[i].parentId) {
                player.inventory.items[result[i].index] = result[i];
            }
            // delete result[i].index;
            delete result[i].playerId;
        }

        return result;
        // return {
        //     0: {
        //         sqlId: 100,
        //         itemId: 1,
        //         params: {}
        //     },
        //     5: {
        //         sqlId: 200,
        //         itemId: 7,
        //         params: {},
        //         pockets: [{
        //                 cols: 9,
        //                 rows: 20,
        //                 items: {}
        //             },
        //             {
        //                 cols: 5,
        //                 rows: 5,
        //                 items: {
        //                     2: {
        //                         sqlId: 300,
        //                         itemId: 1,
        //                         params: {}
        //                     }
        //                 }
        //             }
        //         ]
        //     }
        // };
    },
    convertServerToClientItem(item) {
        console.log(`convertServerToClientItem`);
        console.log(item);
        return;
        var params = {};
        for (var j = 0; j < item.params.length; j++) {
            params[item.params[j].key] = item.params[j].value;
        }
        var result = {
            sqlId: item.id,
            itemId: item.itemId,
            params: params
        };
        if (params.pockets) {
            params.pockets = JSON.parse(params.pockets);
            result.pockets = [];
            for (var j = 0; j < params.pockets.length; j += 2) {
                result.pockets.push({
                    cols: params.pockets[j],
                    rows: params.pockets[j + 1],
                    items: {}
                });
            }
            delete params.pockets;
        }
        if (item.children.length > 0) {
            for (var j = 0; j < item.children.length; j++) {
                var child = item.children[j];
                result.pockets[child.pocketIndex].items[child.index] = this.convertServerToClientItem(child);
            }
        }
        return result;
    },
};
