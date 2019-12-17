"use strict";

/*
    Модуль мирных зон.

    created 12.12.19 by Carter Slade
*/

mp.peaceZones = {
    inside: false,
    interiors: [60418], // интерьеры в ЗЗ
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
            mp.game.controls.disableControlAction(0, 24, true); /// удары
            mp.game.controls.disableControlAction(0, 25, true); /// INPUT_AIM
            mp.game.controls.disableControlAction(0, 140, true); /// удары R
            mp.game.controls.disableControlAction(0, 257, true); // INPUT_ATTACK2
        }
    },
});
