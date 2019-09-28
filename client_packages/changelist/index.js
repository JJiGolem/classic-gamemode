"use strict";


/*
    Модуль обновлений.

    created 29.09.19 by Carter Slade
*/

mp.changelist = {

    enable(enable) {
        mp.callCEFV(`changelist.enable = ${enable}`);
    },
    initLikes(data) {
        mp.callCEFV(`changelist.initLikes('${JSON.stringify(data)}')`);
    },
};

mp.events.add({
    "characterInit.done": () => {
        mp.changelist.enable(true);
    },
    "changelist.initLikes": (data) => {
        mp.changelist.initLikes(data);
    },
});
