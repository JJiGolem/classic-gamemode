"use strict";

/*
    Модуль диалога предложения на сервере.
    Используется для подтверждения операции, в основном, финансовой, но не только.
    Например: при продаже дома/бизнеса/авто, при принятии в организацию и пр.

    created 07.07.19 by Carter Slade
*/

mp.offerDialog = {
    show: (name, values) => {
        mp.events.call("offerDialog.show", name, values);
    },
    hide: () => {
        mp.events.call("offerDialog.hide");
    }
};


mp.events.add("offerDialog.show", (name, values) => {
    if (values) {
        var player;
        if (values.owner) {
            player = getPlayerByName(values.owner);
            if (player && !player.isFamiliar) values.owner = "Гражданин";
        }
        else if (values.name) {
            player = getPlayerByName(values.name);
            if (player && !player.isFamiliar) values.name = "Гражданин";
        }
    }

    menu.execute(`offerDialog.show('${name}', '${JSON.stringify(values)}')`);
});

mp.events.add("offerDialog.hide", () => {
    menu.execute(`offerDialog.hide()`);
});
