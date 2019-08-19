"use strict";

/*
    Модуль меню взаимодействия в GUI (VUE).
    Используется при взаимодействии с игроками/авто.
    Например: показать документы, вступить в режим торговли, открыть двери авто.

    created 24.07.19 by Carter Slade
*/

// ************** События взаимодействия с меню **************

// Вызов события необходимо прописать в [CEF] interactionMenu.menu.handler(), если в этом есть необходимость.
mp.events.add("interactionMenu.onClick", (menuName, itemName) => {
    if (menuName == 'faction') {
        var entity = mp.getCurrentInteractionEntity();
        if (!entity) return;
        if (entity.type != 'player') return;

        if (itemName == 'Пригласить') {
            mp.events.callRemote(`factions.invite.show`, entity.remoteId);
        } else if (itemName == 'Уволить') {
            mp.events.callRemote(`factions.uval`, entity.remoteId);
        } else if (itemName == 'Ранг') {
            mp.events.callRemote(`factions.giverank.show`, entity.remoteId);
        }
    }
});
