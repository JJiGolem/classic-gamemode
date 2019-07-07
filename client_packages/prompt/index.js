"use strict";

/*
    Модуль игровых подсказок на сервере.

    created 07.07.19 by Carter Slade
*/

mp.events.add("prompt.show", (text) => {
    menu.execute(`prompt.show('${text}')`);
});

mp.events.add("prompt.hide", () => {
    menu.execute(`prompt.hide()`);
});

mp.events.add("prompt.showByName", (name) => {
    menu.execute(`prompt.showByName('${name}')`);
});
