"use strict";

module.exports = {
    // Изготовители (станок, верстак и т.п.)
    crafters: [{
            name: "Станок",
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
                    }],
                    time: 10,
                }]
            }],
            queue: {
                columns: [{
                        itemId: 1,
                        state: 'process',
                        time: 10,
                        maxTime: 180,
                    },
                    {
                        itemId: 3,
                        state: 'completed',
                    },
                    {
                        itemId: 7,
                        state: 'unsuccessfully'
                    },
                    {}
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
                columns: [{
                        itemId: 1,
                        state: 'process',
                        time: 10,
                        maxTime: 180,
                    },
                    {
                        itemId: 3,
                        state: 'completed',
                    },
                    {
                        itemId: 7,
                        state: 'unsuccessfully'
                    },
                    {}
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
                d("enter crafter")
                player.call("craft.initCrafter", [this.convertToClientCrafter(crafter)]);
                player.crafter = crafter;
            };
            crafter.colshape.onExit = (player) => {
                d("exit crafter")
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
            types: crafter.types,
            queue: crafter.queue,
        };
    },
};
