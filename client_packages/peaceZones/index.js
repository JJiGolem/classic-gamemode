"use strict";

mp.peaceZones = {
    inside: false,
    interiors: [60418],
    ignoreFactions: [2, 3, 4],

    isInside() {
        if (this.inside) return true;

        var interior = mp.utils.getLocalInterior();
        return interior && this.interiors.includes(interior);
    },
};

mp.events.add({
    "peaceZones.inside": (enable) => {
        mp.peaceZones.inside = enable;
    },
    "render": () => {
        var canHitTree = mp.woodman.treePos && mp.woodman.isAxInHands();
        if (mp.peaceZones.isInside() && !canHitTree && !mp.peaceZones.ignoreFactions.includes(mp.factions.faction)) {
            mp.game.controls.disableControlAction(0, 24, true);
            mp.game.controls.disableControlAction(0, 25, true);
            mp.game.controls.disableControlAction(0, 140, true);
            mp.game.controls.disableControlAction(0, 257, true);
        }
    },
});
