"use strict";

let callerId = -1;
let isOpened = false;
let isBinding = false;

mp.events.add('phone.load', function (phoneInfo, phoneDialogs) {
    mp.callCEFR('phone.load', [phoneInfo]);
    mp.callCEFR('phone.message.list', [phoneDialogs]);
    bindButtons(phoneInfo.isHave);
});

/// Добавление приложения
/// house
/// biz
mp.events.add('addApp.client', function (appName, info) {
    mp.callCEFR('addApp', [appName, info]);
});
/// Удаление приложения
mp.events.add('removeApp.client', function (appName, index) {
    /// index - номер дропнутого дома(для возможности иметь несколько домов)
    mp.callCEFR('removeApp', [appName]);
});

mp.events.add('characterInit.done', function () {
    /// Добавление канала в войсчат
    mp.speechChanel.addChannel("phone");
});

/// Начало разговора на нашем конце
mp.events.add('phone.call.start', function (number) {
    mp.events.callRemote('phone.call.ask', number);
});

/// Ответ на наше начало разговора
mp.events.add('phone.call.start.ans', function (ans, targetId) {
    if (ans == 0) {  /// 0 Вызов принят, 1 Нет номера, 2 Занято, 3 Сброс вызова, 4 Не поднял трубку
        callerId = targetId;
        mp.speechChanel.connect(mp.players.atRemoteId(callerId), "phone");
    }
    mp.chat.debug(ans);
    /// Ответ на звонок
    mp.callCEFR('phone.call.ans', [ans]);
});

/// Сброс на нашем конце
mp.events.add('phone.call.end', function () {
    mp.events.callRemote('phone.call.end', callerId);
    mp.speechChanel.disconnect(mp.players.atRemoteId(callerId), "phone");
    callerId = -1;
});

/// Сброс звонка на другом конце
mp.events.add('phone.call.end.in', function () {
    mp.speechChanel.disconnect(mp.players.atRemoteId(callerId), "phone");
    callerId = -1;
    mp.callCEFR('phone.call.end', []);
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
	if (player.remoteId == callerId) {
        mp.callCEFR('phone.call.end', []);
    }
    if (callerId != -1 && player.remoteId == mp.players.local.remoteId) {
        mp.callCEFR('phone.call.end', []);
        if (mp.busy.includes('phone')) {
            mp.callCEFR('phone.show', [false]); 
        }
    }
});

mp.events.add("playerQuit", (player) => {
	if (player.remoteId == callerId) {
        mp.callCEFR('phone.call.end', []);
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
}

let hidePhone = () => {		
    mp.callCEFR('phone.show', [false]); 
    mp.gui.cursor.show(false, false);
    mp.busy.remove('phone');
}