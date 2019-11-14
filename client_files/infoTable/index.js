"use strict";

/*
    Модуль инфо-окон в GUI (VUE).
    Используется для отображения информации в виде прогресс-бара и не только.
    Например: навыки персонажа, хар-ки авто, статистика бизнеса и пр.

    created 07.07.19 by Carter Slade
*/

mp.infoTable = {
    setValues: (name, values) => {
        mp.events.call("infoTable.setValues", name, values);
    },
    showByName: (name, values) => {
        mp.events.call("infoTable.showByName", name, values);
    },
    hide: () => {
        mp.events.call("infoTable.hide");
    }
};


mp.events.add("infoTable.setValues", (name, values) => {
    menu.execute(`infoTable.setValues(\`${name}\`, ${JSON.stringify(values)})`);
});

mp.events.add("infoTable.showByName", (name, values) => {
    menu.execute(`infoTable.showByName(\`${name}\`, ${JSON.stringify(values)})`);
});

mp.events.add("infoTable.hide", () => {
    menu.execute(`infoTable.show = false`);
});
