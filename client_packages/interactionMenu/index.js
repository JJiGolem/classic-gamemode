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
    var entity = mp.getCurrentInteractionEntity();
    if (menuName == 'player_interaction') {
        if (!entity) return;
        if (entity.type != 'player') return;
        if (itemName == 'Познакомиться') {
            if (mp.familiar.list.includes(entity.name)) return mp.notify.error(`Вы уже знаете ${entity.name}`, `Знакомство`);
            mp.events.callRemote(`familiar.add`, entity.remoteId);
        }
    } else if (menuName == 'faction') {
        if (!entity) return;
        if (entity.type != 'player') return;

        if (itemName == 'Пригласить') {
            mp.events.callRemote(`factions.invite.show`, entity.remoteId);
        } else if (itemName == 'Уволить') {
            mp.events.callRemote(`factions.uval`, entity.remoteId);
        } else if (itemName == 'Ранг') {
            mp.events.callRemote(`factions.giverank.show`, entity.remoteId);
        }
    } else if (menuName == "police") {
        if (!entity) return;
        if (entity.type != 'player') return;

        if (itemName == 'Наручники') {
            var data = {
                recId: entity.remoteId
            };
            mp.events.callRemote(`police.cuffs`, JSON.stringify(data));
        } else if (itemName == 'Розыск') {
            mp.events.callRemote(`police.wanted`, entity.remoteId);
        } else if (itemName == 'Арест') {
            mp.events.callRemote(`police.cells.arrest`, entity.remoteId);
        } else if (itemName == 'Следование') {
            mp.events.callRemote(`police.follow`, entity.remoteId);
        } else if (itemName == 'В авто') {
            mp.events.callRemote(`police.vehicle.put`, entity.remoteId);
        }
    } else if (menuName == "police_gunlicense") {
        if (!entity) return;
        if (entity.type != 'player') return;

        if (itemName == 'Выдать') {
            mp.events.callRemote(`police.licenses.gun.give`, entity.remoteId);
        } else if (itemName == 'Изъять') {
            mp.events.callRemote(`police.licenses.gun.take`, entity.remoteId);
        }
    } else if (menuName == "hospital") {
        if (!entity) return;
        if (entity.type != 'player') return;

        if (itemName == 'Лечить') {
            mp.events.callRemote(`hospital.healing.show`, entity.remoteId);
        } else if (itemName == 'Реанимировать') {
            var data = {
                recId: entity.remoteId
            };
            mp.events.callRemote(`inventory.item.adrenalin.use`, JSON.stringify(data));
        }
    } else if (menuName == "mafia") {
        if (!entity) return;
        if (entity.type != 'player') return;

        if (itemName == 'Продать крышу') {
            mp.callCEFV(`inputWindow.playerId = ${entity.remoteId}`);
            mp.callCEFV(`inputWindow.showByName('mafia_power_sell')`);
        } else if (itemName == 'Связать') {

        } else if (itemName == 'Вести') {

        } else if (itemName == 'Мешок на голову') {

        }
    }
});
