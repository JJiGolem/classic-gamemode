"use strict";

let inventory = call('inventory');
let notifs = call('notifications');
let timer = call('timer');
let utils = call('utils');

module.exports = {
    // Изготовители (станок, верстак и т.п.)
    crafters: [{
            name: "Станок",
            description: "Используется для переработки ресурсов и изготовления инструментов.",
            types: [{
                    name: "Инструменты",
                    items: [{
                            itemId: 76,
                            params: {
                                health: 100,
                                weaponHash: mp.joaat("weapon_stone_hatchet"),
                            },
                            materials: [{
                                    itemId: 137,
                                    count: 10
                                },
                                {
                                    itemId: 138,
                                    count: 15
                                }
                            ],
                            time: 5 * 60,
                            skill: 0
                        },
                        {
                            itemId: 136,
                            params: {
                                health: 100,
                            },
                            materials: [{
                                    itemId: 137,
                                    count: 15
                                },
                                {
                                    itemId: 138,
                                    count: 10
                                }
                            ],
                            time: 5 * 60,
                            skill: 0
                        },
                        {
                            itemId: 5,
                            params: {
                                health: 100
                            },
                            materials: [{
                                    itemId: 137,
                                    count: 12
                                },
                                {
                                    itemId: 138,
                                    count: 8
                                },
                                {
                                    itemId: 148,
                                    count: 2
                                },
                            ],
                            time: 7 * 60,
                            skill: 60 * 60,
                        },
                        {
                            itemId: 140,
                            params: {
                                health: 100
                            },
                            materials: [{
                                    itemId: 137,
                                    count: 20
                                },
                                {
                                    itemId: 141,
                                    count: 5
                                }
                            ],
                            time: 7 * 60,
                            skill: 120 * 60,
                        },
                    ]
                },
                {
                    name: "Материалы",
                    items: [{
                        itemId: 137,
                        params: {
                            count: 5,
                        },
                        materials: [{
                            itemId: 131,
                            count: 1
                        }],
                        time: 5 * 60,
                        skill: 0
                    }, ]
                }
            ],
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
            name: "Станок",
            description: "Используется для переработки ресурсов и изготовления инструментов.",
            types: [{
                    name: "Инструменты",
                    items: [{
                            itemId: 76,
                            params: {
                                health: 100,
                                weaponHash: mp.joaat("weapon_stone_hatchet"),
                            },
                            materials: [{
                                    itemId: 137,
                                    count: 10
                                },
                                {
                                    itemId: 138,
                                    count: 15
                                }
                            ],
                            time: 5 * 60,
                            skill: 0
                        },
                        {
                            itemId: 136,
                            params: {
                                health: 100,
                            },
                            materials: [{
                                    itemId: 137,
                                    count: 15
                                },
                                {
                                    itemId: 138,
                                    count: 10
                                }
                            ],
                            time: 5 * 60,
                            skill: 0
                        },
                        {
                            itemId: 5,
                            params: {
                                health: 100
                            },
                            materials: [{
                                    itemId: 137,
                                    count: 12
                                },
                                {
                                    itemId: 138,
                                    count: 8
                                }
                            ],
                            time: 7 * 60,
                            skill: 60 * 60,
                        },
                        {
                            itemId: 140,
                            params: {
                                health: 100
                            },
                            materials: [{
                                    itemId: 137,
                                    count: 20
                                },
                                {
                                    itemId: 141,
                                    count: 5
                                }
                            ],
                            time: 7 * 60,
                            skill: 120 * 60,
                        },
                    ]
                },
                {
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
                        time: 5 * 60,
                        skill: 0,
                    }]
                }
            ],
            queue: {
                columns: [{},
                    {},
                    {},
                    {},
                ]
            },
            pos: new mp.Vector3(2606.1240234375, 2793.6884765625, 33.736148834228516 - 1),
            rot: new mp.Vector3(0, 0, 90),
            model: "prop_tablesaw_01",
            colshape: null,
            object: null,
        },
    ],
    // Время ожидания предмета, после которого предмет из очереди уничтожится
    destroyItemTime: 10 * 60 * 1000,
    // ИД предмета 'Дерево'
    firewoodItemId: 137,

    init() {
        this.initCrafters();
    },
    initCrafters() {
        this.crafters.forEach(crafter => {
            this.initCrafter(crafter);
        });
    },
    initCrafter(crafter) {
        crafter.colshape = mp.colshapes.newSphere(crafter.pos.x, crafter.pos.y, crafter.pos.z, 2.5, 0);
        crafter.colshape.onEnter = (player) => {
            if (player.vehicle) return;
            this.updateQueue(crafter);
            player.call("craft.initCrafter", [this.convertToClientCrafter(crafter)]);
            player.crafter = crafter;
        };
        crafter.colshape.onExit = (player) => {
            player.call("craft.clearCrafter");
            delete player.crafter;
        };

        crafter.object = mp.objects.new(mp.joaat(crafter.model), crafter.pos, {
            rotation: crafter.rot
        });
    },
    convertToClientCrafter(crafter) {
        var clientData = {
            name: crafter.name,
            description: crafter.description,
            types: crafter.types,
            queue: crafter.queue,
        };
        if (crafter.destroyDate) clientData.destroyTime = parseInt((crafter.destroyDate - Date.now()) / 1000);
        return clientData;
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
        mp.players.forEachInRange(player.crafter.pos, 5, rec => {
            if (rec.crafter != player.crafter) return;

            rec.call("craft.addItemToQueue", [i, cols[i]]);
        });
        return true;
    },
    deleteItemFromQueue(crafter, col) {
        var index = crafter.queue.columns.indexOf(col);
        if (index == -1) return;
        crafter.queue.columns[index] = {};
        mp.players.forEachInRange(crafter.pos, 5, rec => {
            if (rec.crafter != crafter) return;

            rec.call("craft.addItemToQueue", [index, {}]);
        });
    },
    updateQueue(crafter) {
        crafter.queue.columns.forEach((col, index) => {
            if (!col.itemId) return;
            if (col.state != 'process') {
                if (Date.now() - col.stopTime > this.destroyItemTime) this.deleteItemFromQueue(crafter, col);
            } else {
                col.time = col.maxTime - parseInt((Date.now() - col.startTime) / 1000);
                if (col.time <= 0) {
                    var rand = utils.randomInteger(0, 9);
                    col.state = (!rand) ? "unsuccessfully" : "completed";
                    col.time = 0;
                    col.stopTime = col.startTime + col.maxTime * 1000;
                    if (Date.now() - col.stopTime > this.destroyItemTime) this.deleteItemFromQueue(crafter, col);
                    else {
                        mp.players.forEachInRange(crafter.pos, 5, rec => {
                            if (rec.crafter != crafter) return;

                            rec.call("craft.addItemToQueue", [index, col]);
                        });
                    }
                }
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
        this.updateQueue(crafter);
        var col = crafter.queue.columns[index];
        if (!col.itemId) return out(`Истек срок готовности предмета`);
        if (col.state == 'process') return out(`Предмет находится в процессе изготовления`);
        if (col.playerName != player.name) return out(`Нельзя забрать чужой предмет`);
        if (col.state == 'unsuccessfully') {
            this.deleteItemFromQueue(crafter, col);
            return out(`Не удалось изготовить предмет`);
        }
        var item = this.getCraftItemByItemId(crafter, col.itemId);

        inventory.addItem(player, item.itemId, item.params, (e) => {
            if (e) return out(e);

            this.addSkill(player, item.time);
            this.deleteItemFromQueue(crafter, col);
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
    },
    addSkill(player, exp) {
        player.character.craft += exp;
        player.character.save();
        player.call(`craft.setSkill`, [player.character.craft]);
    },
    createBonfire(pos, rot) {
        var time = 5 * 20 * 1000;
        var crafter = {
            name: "Костер",
            description: "Используется для приготовления еды.",
            destroyDate: Date.now() + time,
            types: [{
                    name: "Еда",
                    items: [{
                            itemId: 142,
                            params: {
                                satiety: 60
                            },
                            materials: [{
                                itemId: 15,
                                count: 4
                            }],
                            time: 1 * 60,
                            skill: 0
                        },
                        {
                            itemId: 143,
                            params: {
                                satiety: 70
                            },
                            materials: [{
                                itemId: 36,
                                count: 4
                            }],
                            time: 70,
                            skill: 50 * 60
                        },
                        {
                            itemId: 144,
                            params: {
                                satiety: 80
                            },
                            materials: [{
                                itemId: 146,
                                count: 4
                            }],
                            time: 70,
                            skill: 90 * 60
                        },
                    ]
                },
                {
                    name: "Напитки",
                    items: [{
                        itemId: 145,
                        params: {
                            thirst: 80
                        },
                        materials: [{
                            itemId: 147,
                            count: 4
                        }],
                        time: 70,
                        skill: 20 * 60
                    }, ]
                }
            ],
            queue: {
                columns: [{},
                    {},
                    {},
                    {},
                ]
            },
            pos: pos,
            rot: rot,
            model: "prop_beach_fire",
            colshape: null,
            object: null,
        };
        this.crafters.push(crafter);
        this.initCrafter(crafter);
        crafter.destroyTimer = timer.add(() => {
            var i = this.crafters.indexOf(crafter);
            if (i != -1) this.crafters.splice(i, 1);
            crafter.colshape.destroy();
            crafter.object.destroy();
        }, time);
    },
    addFirewood(player, firewoodCount) {
        var header = `Костер`;
        var out = (text) => {
            notifs.error(player, text, header);
        };
        if (firewoodCount > this.getMaterialCount(player, this.firewoodItemId)) return out(`Недостаточно дерева`);
        var crafter = player.crafter;
        this.removeMaterials(player, [{
            itemId: this.firewoodItemId,
            count: firewoodCount
        }]);
        var time = 20 * 1000 * firewoodCount;
        crafter.destroyDate += time;
        timer.remove(crafter.destroyTimer);
        crafter.destroyTimer = timer.add(() => {
            var i = this.crafters.indexOf(crafter);
            if (i != -1) this.crafters.splice(i, 1);
            crafter.colshape.destroy();
            crafter.object.destroy();
        }, crafter.destroyDate - Date.now());
        mp.players.forEachInRange(crafter.pos, 5, rec => {
            if (rec.crafter != crafter) return;

            rec.call("craft.crafter.setDestroyTime", [parseInt((crafter.destroyDate - Date.now()) / 1000)]);
        });
    },
};
