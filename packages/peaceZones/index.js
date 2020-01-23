"use strict";

module.exports = {
    // Мирные зоны, где нельзя грабить/драться/стреляться
    zones: [{
            name: "Ферма 1",
            pos: {
                x: 2003.693603515625,
                y: 4951.9638671875,
            },
            radius: 135,
            dimension: 0
        },
        {
            name: "Лесопилка",
            pos: {
                x: -573.1365356445312,
                y: 5254.02197265625,
            },
            radius: 135,
            dimension: 0
        },
        {
            name: "Каменоломня",
            pos: {
                x: 2615.76416015625,
                y: 2776.184814453125,
            },
            radius: 135,
            dimension: 0
        },
        {
            name: "Возле больницы",
            pos: {
                x: -473,
                y: -339,
            },
            radius: 30,
            dimension: 0
        },
        {
            name: "Грузоперевозки",
            pos: {
                x: 913,
                y: -1562,
            },
            radius: 30,
            dimension: 0
        },
        {
            name: "Таксопарк",
            pos: {
                x: 911,
                y: -175,
            },
            radius: 20,
            dimension: 0
        },
        {
            name: "Уборщики",
            pos: {
                x: -630,
                y: -1653,
            },
            radius: 20,
            dimension: 0
        },
        {
            name: "Автобусы",
            pos: {
                x: 421,
                y: -621,
            },
            radius: 30,
            dimension: 0
        },
    ],

    init() {
        this.zones.forEach(zone => {
            var colshape = mp.colshapes.newCircle(zone.pos.x, zone.pos.y, zone.radius, zone.dimension || 0);
            colshape.onEnter = (player) => {
                player.call("peaceZones.inside", [true]);
            };
            colshape.onExit = (player) => {
                player.call("peaceZones.inside", [false]);
            };
        });
    },
};
