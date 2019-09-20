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
};

mp.events.add({
    "playerMenu.init": (data) => {
        mp.playerMenu.init(data);
    },
});
