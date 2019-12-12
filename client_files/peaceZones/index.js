"use strict";

/*
    Модуль мирных зон.

    created 12.12.19 by Carter Slade
*/

mp.peaceZones = {
    inside: false,
};

mp.events.add({
    "peaceZones.inside": (enable) => {
        mp.peaceZones.inside = enable;
    },
    "render": () => {
        if (mp.peaceZones.inside) {
            mp.game.controls.disableControlAction(0, 24, true); /// удары
            mp.game.controls.disableControlAction(0, 25, true); /// INPUT_AIM
            mp.game.controls.disableControlAction(0, 140, true); /// удары R
        }
    },
});
