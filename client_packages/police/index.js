"use strict";

/*
    Модуль полиции.

    created 20.08.19 by Carter Slade
*/

mp.police = {
    haveCuffs: false,

    setCuffs(enable) {
        this.haveCuffs = enable;
    }
};

mp.events.add("police.cuffs.set", (enable) => {
    mp.police.setCuffs(enable);
});

mp.events.add("render", () => {
    if (mp.police.haveCuffs) mp.game.controls.disableAllControlActions(0);
});
