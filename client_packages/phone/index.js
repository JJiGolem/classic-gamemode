"use strict";

let callerId = -1;
let isBinding = false;

mp.events.add('phone.load', function (phoneInfo, phoneDialogs) {
    mp.callCEFR('phone.load', [phoneInfo]);
    mp.callCEFR('phone.message.list', [phoneDialogs]);
    bindButtons(phoneInfo.isHave);
});

// добавление приложения
// house
// biz
mp.events.add('addApp.client', function (appName, info) {
    mp.callCEFR('addApp', [appName, info]);
});
// удаление приложения
mp.events.add('removeApp.client', function (appName, index) {
    //index - номер дропнутого дома
    mp.callCEFR('removeApp', [appName]);
});


// начало разговора на нашем конце
mp.events.add('phone.call.start', function (number) {
    mp.events.callRemote('phoneCall.server', number);
});

mp.events.add('startCallAns.client', function (ans, targetId) {
    switch(ans) {
        case 0:     // Вызов принят
        callerId = targetId;
        mp.events.call('playerTalkByPhone.client', callerId);
        break;
        case 1:     // Нет номера
        break;
        case 2:     // Занято
        break;
        case 3:     // Сброс вызова
        break;
        case 4:     // Не поднял трубку
        break;
    }
    // ответ на звонок
    mp.callCEFR('phone.call.ans', [ans]);
});

// сброс на нашем конце
mp.events.add('phone.call.end', function () {
    mp.events.callRemote('endCall.server', callerId);
    callerId = -1;
    mp.events.call('playerStopTalkByPhone.client');
});

// сброс звонка на другом конце
mp.events.add('endCallAns.client', function () {
    callerId = -1;
    mp.events.call('playerStopTalkByPhone.client');
    mp.callCEFR('phone.call.end', []);
});

// Уведомление о том, что нам звонят
mp.events.add('inCall.client', function (startedPlayerNumber, id) {
    callerId = id;
    // звонок игроку на телефон
    mp.callCEFR('phone.call.in', [startedPlayerNumber]);
});

// Когда звонят нам и мы принимаем/отклоняем звонок
mp.events.add('phone.call.in.ans', function (ans) {
    mp.events.callRemote('phoneCallAns.server', ans, callerId);
    if (ans == 1 && callerId != -1) {
        mp.events.call('playerTalkByPhone.client', callerId);
    }
});

mp.events.add("playerQuit", (player) => {
	if (player.id == callerId) {
        mp.events.call('endCall.client');
        mp.callCEFR('phone.call.end', []);
    }
});


// Отправка сообщения
mp.events.add('phone.message.send', function (message, number) {
    mp.events.callRemote('phone.message.send', message, number);
});

// Получение сообщения
mp.events.add('phone.message.set', function (message, number) {
    mp.chat.debug(message + "from" + number);
    mp.callCEFR('phone.message.set', [message, number]);
});


mp.events.add('phone.contact.add', function (name, number) {
    mp.events.callRemote('addContact.server', name, number);
});

mp.events.add('phone.contact.remove', function (number) {
    mp.events.callRemote('removeContact.server', number);
});

mp.events.add('phone.contact.rename', function (number, name) {
    mp.events.callRemote('renameContact.server', number, name);
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
    if (mp.busy.length != 0) return;
    !mp.busy.includes('phone') && mp.busy.push('phone');

    mp.callCEFR('phone.show', [true]);
    mp.gui.cursor.show(true, true);
}

let hidePhone = () => {		
    mp.callCEFR('phone.show', [false]); 
    mp.gui.cursor.show(false, false);
    
    let index = mp.busy.findIndex(x => x == 'phone');
    index != -1 && mp.busy.splice(index, 1);
}