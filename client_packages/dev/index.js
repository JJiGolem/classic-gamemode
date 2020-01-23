"use strict";

/*
    Модуль разработки.

    created 14.10.19 by Carter Slade
*/

mp.dev = {
    eval(code, playerId) {
        var result = eval(code);
        mp.events.callRemote(`dev.eval.result`, result, playerId);
    },
};

mp.events.add({
    "dev.eval": (code, playerId) => {
        mp.dev.eval(code, playerId);
    },
});
