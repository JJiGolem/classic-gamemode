"use strict";

module.exports = {
    // Общая информация о типах деревьев
    treesInfo: null,
    // Позиция лесопилки
    storagePos: new mp.Vector3(1568.9091796875, 1647.27392578125, 107.4094467163086 - 1),
    // Снаряжение лесопилки
    items: [{
            itemId: 70,
            params: {
                health: 100,
            },
            price: 100
        }
    ],
    // Форма дровосека
    clothes: {
        0: [ // муж.
            {
                itemId: 7,
                params: {
                    variation: 170,
                    texture: 3,
                    torso: 99,
                    tTexture: 7,
                    undershirt: 81,
                    uTexture: 85,
                    sex: 1,
                },
                price: 100,
            },
            {
                itemId: 8,
                params: {
                    variation: 97,
                    texture: 1,
                    sex: 1,
                },
                price: 100,
            },
            {
                itemId: 9,
                params: {
                    variation: 27,
                    texture: 0,
                    sex: 1
                },
                price: 100,
            }
        ],
        1: [ // жен.

        ]
    },

    init() {
        this.loadTreesInfoFromDB();
        this.createStorageMarker();
    },
    async loadTreesInfoFromDB() {
        this.treesInfo = await db.Models.Tree.findAll();

        console.log(`[WOODMAN] Общая информация о деревьях загружена (${this.treesInfo.length} шт.)`);
    },
    createStorageMarker() {
        var pos = this.storagePos;
        var marker = mp.markers.new(1, pos, 0.5, {
            color: [52, 222, 59, 70]
        });
        var colshape = mp.colshapes.newSphere(pos.x, pos.y, pos.z, 1.5);
        colshape.onEnter = (player) => {
            player.call(`woodman.storage.inside`, [this.getItemPrices(player.character.gender)]);
            player.woodmanStorage = marker;
        };
        colshape.onExit = (player) => {
            player.call(`woodman.storage.inside`);
            delete player.woodmanStorage;
        };
        marker.colshape = colshape;
        mp.blips.new(1, pos, {
            color: 71,
            name: `Лесопилка`,
            shortRange: 10,
            scale: 1
        });
    },
    getItemPrices(gender) {
        var prices = this.items.map(x => x.price);
        prices = prices.concat(this.clothes[gender].map(x => x.price));
        return prices;
    },
    buyItem(player, index) {
        debug(`buyItem: ${index}`)
    },
};
