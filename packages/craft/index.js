"use strict";

let inventory = call('inventory');
let notifs = call('notifications');

module.exports = {
    // Изготовители (станок, верстак и т.п.)
    crafters: [{
            name: "Станок",
            description: "Используется для работы с деревом.",
            types: [{
                name: "Материалы",
                items: [{
                    itemId: 137,
                    params: {
                        count: 5,
                    },
                    materials: [{
                            itemId: 131,
                            count: 1
                        },
                        {
                            itemId: 137,
                            count: 3
                        }
                    ],
                    time: 10,
                }]
            }],
            queue: {
                columns: [{},
                    {},
                    {},
                    {},
                ]
            },
            pos: new mp.Vector3(-585.5527954101562, 5288.91845703125, 70.28678894042969 - 1),
            rot: new mp.Vector3(0, 0, 0),
            model: "prop_tablesaw_01",
            colshape: null,
            object: null,
        },
        {
            name: "Каменоломня",
            description: "Используется для работы с камнем.",
            types: [{
                name: "Материалы",
                items: [{
                    itemId: 138,
                    params: {
                        count: 5,
                    },
                    materials: [{
                        itemId: 135,
                        count: 1
                    }],
                    time: 10,
                }]
            }],
            queue: {
                columns: [{},
                    {},
                    {},
                    {},
                ]
            },
            pos: new mp.Vector3(2606.1240234375, 2793.6884765625, 33.736148834228516 - 1),
            rot: new mp.Vector3(0, 0, 90),
            model: "gr_prop_gr_bench_02a",
            colshape: null,
            object: null,
        },
    ],

    init() {
        this.initCrafters();
    },
    initCrafters() {
        this.crafters.forEach(crafter => {
            crafter.colshape = mp.colshapes.newSphere(crafter.pos.x, crafter.pos.y, crafter.pos.z, 1.5, 0);
            crafter.colshape.onEnter = (player) => {
                if (player.vehicle) return;
                this.updateQueue(crafter.queue);
                player.call("craft.initCrafter", [this.convertToClientCrafter(crafter)]);
                player.crafter = crafter;
            };
            crafter.colshape.onExit = (player) => {
                player.call("craft.clearCrafter");
                delete player.crafter;
            };
            crafter.colshape = crafter;

            crafter.object = mp.objects.new(mp.joaat(crafter.model), crafter.pos, {
                rotation: crafter.rot
            });
        });
    },
    convertToClientCrafter(crafter) {
        return {
            name: crafter.name,
            description: crafter.description,
            types: crafter.types,
            queue: crafter.queue,
        };
    },
    craftItem(player, typeI, itemI) {
        if (!player.crafter) return notifs.error(player, `Подойдите ближе`);
        var header = player.crafter.name;
        var out = (text) => {
            return notifs.error(player, text, header);
        };
        var item = player.crafter.types[typeI].items[itemI];
        if (!this.canCraft(player, item)) return out(`Недостаточно ресурсов`);
        if (!this.getQueueFreeSlots(player.crafter.queue)) return out(`Очередь занята`);

        if (this.addItemToQueue(player, item)) {
            this.removeMaterials(player, item.materials);
            notifs.success(player, `Предмет добавлен в очередь`, header);
        } else out(`Ошибка добавления предмета в очередь`);
    },
    getMaterialCount(player, itemId) {
        var items = inventory.getArrayByItemId(player, itemId);
        var count = items.length;
        items.forEach(item => {
            var params = inventory.getParamsValues(item);
            if (params.count) count += params.count - 1;
        });
        return count;
    },
    removeMaterials(player, materials) {
        materials.forEach(mat => {
            var count = mat.count;
            var items = inventory.getArrayByItemId(player, mat.itemId);
            for (var i = 0; i < items.length; i++) {
                if (!count) break;
                var item = items[i];
                var params = inventory.getParamsValues(item);
                var del = Math.clamp(params.count || 1, 0, count);
                count -= del;
                if (!params.count || params.count - del <= 0) {
                    inventory.deleteItem(player, item);
                    i--;
                } else {
                    inventory.updateParam(player, item, 'count', params.count - del);
                }
            }
        });
    },
    isDeficit(player, material) {
        return this.getMaterialCount(player, material.itemId) < material.count;
    },
    canCraft(player, item) {
        for (var i = 0; i < item.materials.length; i++) {
            var material = item.materials[i];
            if (this.isDeficit(player, material)) return false;
        }

        return true;
    },
    getQueueFreeSlots(queue) {
        return queue.columns.length - queue.columns.filter(x => x.itemId).length;
    },
    addItemToQueue(player, item) {
        var cols = player.crafter.queue.columns;
        var i = cols.findIndex(x => !x.itemId);
        if (i == -1) return false;

        cols[i] = {
            itemId: item.itemId,
            state: 'process',
            time: item.time,
            maxTime: item.time,
            startTime: Date.now(),
            playerName: player.name,
        };
        mp.players.forEachInRange(player.position, 5, rec => {
            if (rec.crafter != player.crafter) return;

            player.call("craft.addItemToQueue", [i, cols[i]]);
        });
        return true;
    },
    updateQueue(queue) {
        queue.columns.forEach(col => {
            if (!col.itemId || col.state != 'process') return;

            col.time = col.maxTime - parseInt((Date.now() - col.startTime) / 1000);
            if (col.time <= 0) {
                col.state = "completed";
                col.time = 0;
            }
        });
    },
    takeItem(player, index) {
        if (!player.crafter) return notifs.error(player, `Подойдите ближе`);
        var crafter = player.crafter;
        var header = crafter.name;
        var out = (text) => {
            return notifs.error(player, text, header);
        };
        var col = crafter.queue.columns[index];
        if (!col.itemId) return out(`Предмет не найден`);
        this.updateQueue(crafter.queue);
        if (col.state == 'process') return out(`Предмет находится в процессе изготовления`);
        var item = this.getCraftItemByItemId(crafter, col.itemId);

        inventory.addItem(player, item.itemId, item.params, (e) => {
            if (e) return out(e);

            crafter.queue.columns[index] = {};
            mp.players.forEachInRange(player.position, 5, rec => {
                if (rec.crafter != crafter) return;

                player.call("craft.addItemToQueue", [index, {}]);
            });
            notifs.success(player, `Предмет получен`);
        });
    },
    getCraftItemByItemId(crafter, itemId) {
        for (var i = 0; i < crafter.types.length; i++) {
            var type = crafter.types[i];
            for (var j = 0; j < type.items.length; j++) {
                var item = type.items[j];
                if (item.itemId == itemId) return item;
            }
        }
        return null;
    }
};
