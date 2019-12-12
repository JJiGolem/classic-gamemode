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
    }],

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
