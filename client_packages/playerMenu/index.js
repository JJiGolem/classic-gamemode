"use strict";


/*
    Модуль меню игрока.

    created 20.09.19 by Carter Slade
*/

mp.playerMenu = {
    init(data) {
        debug(data);

        mp.callCEFV(`playerMenu.init('${JSON.stringify(data)}')`);
    },
    setFaction(data) {
        mp.callCEFV(`playerMenu.setFaction('${JSON.stringify(data)}')`);
    },
    setFactionRank(data) {
        mp.callCEFV(`playerMenu.setFactionRank('${JSON.stringify(data)}')`);
    },
};

mp.events.add({
    "playerMenu.init": (data) => {
        mp.playerMenu.init(data);
    },
    "playerMenu.setFaction": (data) => {
        mp.playerMenu.setFaction(data);
    },
    "playerMenu.setFactionRank": (data) => {
        mp.playerMenu.setFactionRank(data);

    },
});
