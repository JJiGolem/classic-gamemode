"use strict";

/*
    Модуль меню выбора в GUI (VUE).

    created 23.07.19 by Carter Slade
*/

// ************** События взаимодействия с меню **************

// Вызов события необходимо прописать в [CEF] selectMenu.menu.handler(), если в этом есть необходимость.
mp.events.add("selectMenu.handler", (menuName, eventName, e) => {
    e = JSON.parse(e);
    // TODO: Обработка событий...
});

mp.events.add("selectMenu.hide", () => {
    mp.callCEFV(`selectMenu.show = false`);
});
