"use strict";

module.exports = {
    inventoryItems: {},

    async loadInventoryItemsFromDB() {
        var dbItems = await db.Models.InventoryItem.findAll();
        this.inventoryItems = dbItems;
        console.log(`[INVENTORY] Предметы инвентаря загружены (${dbItems.length} шт.)`);
    },
    async initPlayerInventory(player) {
        console.log("initPlayerInventory")
        console.log(player)
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

        player.inventoryItems = dbItems;
        player.call(`inventory.initItems`, [this.convertServerToClientPlayerItems(dbItems)]);
        console.log(`[INVENTORY] Для игрока ${player.character.name} загружены предметы (${dbItems.length} шт.)`);
    },
    convertServerToClientPlayerItems(items) {
        return {
            0: {
                sqlId: 100,
                itemId: 1,
                params: {}
            },
            5: {
                sqlId: 200,
                itemId: 7,
                params: {},
                pockets: [{
                        cols: 9,
                        rows: 20,
                        items: {}
                    },
                    {
                        cols: 5,
                        rows: 5,
                        items: {
                            2: {
                                sqlId: 300,
                                itemId: 1,
                                params: {}
                            }
                        }
                    }
                ]
            }
        };
    }
};
