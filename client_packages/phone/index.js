"use strict";

let callerId = -1;
let isBinding = false;

mp.attachmentMngr.register("takePhone", "prop_npc_phone", 58867, new mp.Vector3(0.06, 0.04, 0.01), new mp.Vector3(-15, 0, -145)); /// Телефон в руке
mp.attachmentMngr.register("callPhone", "prop_npc_phone", 58867, new mp.Vector3(0.01, 0.05, -0.02), new mp.Vector3(-5, -65, 165)); /// Телефон у уха

mp.events.add('phone.load', function (phoneInfo, phoneDialogs, apps) {
    phoneInfo.houses.forEach(house => {
        house.area = mp.game.ui.getLabelText(mp.game.zone.getNameOfZone(house.pos[0], house.pos[1], house.pos[2]));
    });
    phoneInfo.biz.forEach(currentBiz => {
        currentBiz.area = mp.game.ui.getLabelText(mp.game.zone.getNameOfZone(currentBiz.pos[0], currentBiz.pos[1], currentBiz.pos[2]));
    });
    
    mp.callCEFR('phone.load', [phoneInfo]);
    mp.callCEFR('phone.message.list', [phoneDialogs]);
    apps.forEach(app => {
        mp.callCEFR('phone.app.add', [app, null]);
    });
    bindButtons(phoneInfo.isHave);
});

/// Добавление приложения
/// house
/// biz
/// taxi
mp.events.add('phone.app.add', function (appName, info) {
    if (info != null) {
        info.area = mp.game.ui.getLabelText(mp.game.zone.getNameOfZone(info.pos[0], info.pos[1], info.pos[2]));
    }
    mp.callCEFR('phone.app.add', [appName, info]);
});
/// Удаление приложения
mp.events.add('phone.app.remove', function (appName, index) {
    /// index - номер дропнутого дома(для возможности иметь несколько домов)
    mp.callCEFR('phone.app.remove', [appName]);
});

mp.events.add('characterInit.done', function () {
    /// Добавление канала в войсчат
    mp.speechChanel.addChannel("phone");
});

/// Начало разговора на нашем конце
mp.events.add('phone.call.start', function (number) {
    mp.events.callRemote('phone.call.ask', number);
    //playHoldAnimation(false);
    playCallAnimation(true);
});

/// Ответ на наше начало разговора
mp.events.add('phone.call.start.ans', function (ans, targetId) {
    if (ans == 0) {  /// 0 Вызов принят, 1 Нет номера, 2 Занято, 3 Сброс вызова, 4 Не поднял трубку
        callerId = targetId;
        mp.speechChanel.connect(mp.players.atRemoteId(callerId), "phone");
    }
    //playCallAnimation(false);
    playHoldAnimation(true, 1000);
    mp.chat.debug(ans);
    /// Ответ на звонок
    mp.callCEFR('phone.call.ans', [ans]);
});

/// Сброс на нашем конце
mp.events.add('phone.call.end', function () {
    mp.events.callRemote('phone.call.end', callerId);
    mp.speechChanel.disconnect(mp.players.atRemoteId(callerId), "phone");
    callerId = -1;
    //playCallAnimation(false);
    playHoldAnimation(true);
});

/// Сброс звонка на другом конце
mp.events.add('phone.call.end.in', function () {
    mp.speechChanel.disconnect(mp.players.atRemoteId(callerId), "phone");
    callerId = -1;
    mp.callCEFR('phone.call.end', []);
    //playCallAnimation(false);
    playHoldAnimation(true);
});

/// Уведомление о том, что нам звонят
mp.events.add('phone.call.in', function (startedPlayerNumber, targetId) {
    callerId = targetId;
    /// Звонок игроку на телефон
    mp.callCEFR('phone.call.in', [startedPlayerNumber]);
});

/// Когда звонят нам и мы принимаем/отклоняем звонок
mp.events.add('phone.call.in.ans', function (ans) {
    mp.events.callRemote('phone.call.ans', ans, callerId);
    if (ans == 1) {
        if (callerId != -1) {
            mp.speechChanel.connect(mp.players.atRemoteId(callerId), "phone");
            playHoldAnimation(false);
            playCallAnimation(true);
        }
        else {
            mp.callCEFR('phone.call.end', []);
        }
    }
    else {
        callerId = -1;
    }
    mp.chat.debug(ans);
});

mp.events.add("playerDeath", (player) => {
    if (callerId != -1 && player.remoteId == mp.players.local.remoteId) {
        mp.events.call('phone.call.end');
        mp.callCEFR('phone.call.end', []);
        if (mp.busy.includes('phone')) {
            hidePhone();
        }
    }
});

mp.events.add("playerQuit", (player) => {
	if (player.remoteId == callerId) {
        mp.callCEFR('phone.call.end', []);
        callerId = -1;
        mp.events.call('phone.call.end');
    }
});


/// Отправка сообщения
mp.events.add('phone.message.send', function (message, number) {
    mp.events.callRemote('phone.message.send', message, number);
});

/// Получение сообщения
mp.events.add('phone.message.set', function (message, number) {
    mp.callCEFR('phone.message.set', [message, number]);
});

/// Прочтение диалога
mp.events.add('phone.dialog.read', function (dialogNumber) {
    mp.events.callRemote('phone.dialog.read', dialogNumber);
});

/// Добавить контакт
mp.events.add('phone.contact.add', function (name, number) {
    mp.events.callRemote('phone.contact.add', name, number);
});

/// Изменить контакт
mp.events.add('phone.contact.rename', function (number, name) {
    mp.events.callRemote('phone.contact.rename', number, name);
});

/// Удалить контакт
mp.events.add('phone.contact.remove', function (number) {
    mp.events.callRemote('phone.contact.remove', number);
});

/// Передать сообщение об ошибке на телефон
/// 1) Номера не существует
/// 2) Абонент вне зоны действия сети
/// 3) Запись с таким имененем уже существует
/// 4) Запись не найдена
mp.events.add('phone.error', function (number) {
    mp.callCEFR('phone.error', [number]);
});



let bindButtons = (state) => {
    if (state) {
        if (isBinding) return;
        isBinding = true;
        mp.keys.bind(0x26, true, showPhone);        // UP ARROW key
        mp.keys.bind(0x28, true, hidePhone);        // DOWN ARROW key
    }
    else {
        if (!isBinding) return;
        isBinding = false;
        mp.keys.unbind(0x26, true, showPhone);        // UP ARROW key
        mp.keys.unbind(0x28, true, hidePhone);        // DOWN ARROW key
    }
}

let showPhone = () => {		
    if (mp.busy.includes()) return;
    if (!mp.busy.add('phone')) return;
    mp.callCEFR('phone.show', [true]);
    mp.gui.cursor.show(true, true);
    playCallAnimation(false);
    playHoldAnimation(true);
}

let hidePhone = () => {
    if (!mp.busy.includes('phone')) return;		
    
    mp.callCEFR('phone.show', [false]); 
    mp.gui.cursor.show(false, false);
    mp.busy.remove('phone');
    playHoldAnimation(false);
    playCallAnimation(false);
    if (!mp.players.local.vehicle) {
        mp.events.callRemote('animations.stop');
    }
}

function playHoldAnimation(state, timeout) { /// Анимация держания телефона
    if (mp.players.local.vehicle) return;
    if (state) {
        if (!timeout) timeout = 0;
        setTimeout(()=> {
            mp.attachmentMngr.removeLocal("callPhone");
            mp.events.callRemote('animations.play', 'amb@code_human_wander_texting@male@base', 'static', 1, 49);
            mp.attachmentMngr.addLocal("takePhone");
        }, timeout);
    } else {
        mp.attachmentMngr.removeLocal("takePhone");
    }
}

function playCallAnimation(state) { /// Анимация разговора
    if (mp.players.local.vehicle) return;
    if (state) {
        mp.attachmentMngr.removeLocal("takePhone");
        mp.events.callRemote('animations.play', 'amb@code_human_wander_mobile@male@base', 'static', 1, 49);
        mp.attachmentMngr.addLocal("callPhone");
    } else {
        mp.attachmentMngr.removeLocal("callPhone");
    }
}