"use strict";


/*
    Модуль терминала для разработчиков.

    created 14.08.19 by Carter Slade
*/

mp.terminal = {
    enable(enable) {
        mp.callCEFV(`terminal.enable = ${enable}`);
    },
    push(type, text) {
        mp.callCEFV(`terminal.push('${type}', '${text}')`);
    },
};

mp.events.add("terminal.enable", mp.terminal.enable);

mp.events.add("terminal.push", mp.terminal.push);
