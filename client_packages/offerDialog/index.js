"use strict";

/*
    Модуль диалога предложения в GUI (VUE).
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
    // if (values) {
    //     var player;
    //     if (values.owner) {
    //         player = getPlayerByName(values.owner);
    //         if (player && !player.isFamiliar) values.owner = "Гражданин";
    //     }
    //     else if (values.name) {
    //         player = getPlayerByName(values.name);
    //         if (player && !player.isFamiliar) values.name = "Гражданин";
    //     }
    // }
    // TODO: Прикрутить сис-му знакомств, чтобы не было видно ника незнакомца. ^^^
    // mp.gui.cursor.show(true, true);
    mp.callCEFV(`offerDialog.show(\`${name}\`, ${JSON.stringify(values)})`);
});

mp.events.add("offerDialog.hide", () => {
    mp.callCEFV(`offerDialog.hide()`);
    mp.gui.cursor.show(false, false);
});

mp.events.add("offerDialog.close", () => {
    mp.gui.cursor.show(false, false);
});
