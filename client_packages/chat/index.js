"use strict";

mp.gui.chat.activate(false);
mp.gui.chat.show(false);
mp.chat = {

};

var chatOpacity = 1.0;
mp.chat.isOpen = false;
// TODO: цвета тэгов

const TAGS_LIST = [
    {
        id: 0,
        name: "Сказать",
        color: "#ffffff"
    },
    {
        id: 1,
        name: "Крикнуть",
        color: "#ffffff"
    },
    {
        id: 2,
        name: "Рация",
        color: "#ffffff"
    },
    {
        id: 3,
        name: "НонРП",
        color: "#ffffff"
    },
    {
        id: 4,
        name: "Действие",
        color: "#ffffff"
    },
    {
        id: 5,
        name: "Пояснение",
        color: "#ffffff"
    },
    {
        id: 6,
        name: "Попытка",
        color: "#ffffff"
    }
];

var availableTags = [];

function setDefaultTags() {
    TAGS_LIST.forEach((tag) => {
        if (tag.id != 2) {
            availableTags.push(tag);
        }
    }
    )
}

mp.events.add('chat.load', () => {
    setDefaultTags();
    mp.callCEFR('setTagsChat', [availableTags]);
    mp.callCEFR('showChat', [true]);
    mp.callCEFR('setOpacityChat', [1.0]);
    mp.callCEFR('setTimeChat', [true]);

    mp.keys.bind(0x54, true, function () {
            mp.chat.isOpen = true;
            mp.gui.cursor.show(true, true);
            mp.callCEFR('setFocusChat', [true]);
    });

    mp.keys.bind(0x76, true, function () {
        
        if (mp.chat.isOpen) return;

        switch(chatOpacity) {
            case 1.0:
                chatOpacity = 0.5;
                break;
            case 0.5:
                chatOpacity = 0.0;
                break;
            case 0.0:
                chatOpacity = 1.0
                break;
        }
        mp.callCEFR('setOpacityChat', [chatOpacity]);
});

});

mp.events.add('closeChat', () => {
    mp.gui.cursor.show(false, false);
    mp.chat.isOpen = false;
});

mp.events.add('chat.tags.add', (tagIDs) => {
    tagIDs.forEach((tagID) => {
        if (!isTagExisting(TAGS_LIST[tagID])) {
            availableTags.push(TAGS_LIST[tagID]);
        }
    });
    sortTagsById();
    mp.callCEFR('setTagsChat', [availableTags]);
});

function isTagExisting(tag) {
    for (let i = 0; i < availableTags.length; i++) {
        if (tag.id == availableTags[i].id) return true;
    }
    return false;
}

function sortTagsById() {
    availableTags.sort((a, b) => {
        return a.id - b.id;
    });
}

mp.events.add('getChatMessage', (type, message) => {
    mp.events.callRemote('chat.message.get', type, message);
});

mp.events.add('chat.action.say', (nickname, id, message) => {
    message = `!{#ffffff}${nickname}[${id}] сказал: ${message}`;
    mp.events.call('chat.message.push', message);
});

mp.events.add('chat.action.shout', (nickname, id, message) => {
    if (typeof (message) != "string") message = message.join(' ');
    message = `!{#ffdfa8}${nickname}[${id}] крикнул: ${message}`;
    mp.events.call('chat.message.push', message);
});

mp.events.add('chat.action.walkietalkie', (nickname, id, message) => { //add rank
    if (typeof (message) != "string") message = message.join(' ');
    message = `!{#33cc66}[R] Генерал ${nickname}[${id}]: ${message}`;
    mp.events.call('chat.message.push', message);
});

mp.events.add('chat.action.nonrp', (nickname, id, message) => {
    if (typeof (message) != "string") message = message.join(' ');
    message = `!{#c6c695}(( ${nickname}[${id}]: ${message} ))`;
    mp.events.call('chat.message.push', message);
});

mp.events.add('chat.action.me', (nickname, id, message) => {
    if (typeof (message) != "string") message = message.join(' ');
    message = `!{#dd90ff}${nickname}[${id}] ${message}`;
    mp.events.call('chat.message.push', message);
});

mp.events.add('chat.action.do', (nickname, id, message) => {
    if (typeof (message) != "string") message = message.join(' ');
    message = `!{#dd90ff}${message} (${nickname}[${id}])`;
    mp.events.call('chat.message.push', message);
});

mp.events.add('chat.action.try', (nickname, id, message, result) => {
    if (typeof (message) != "string") message = message.join(' ');
    message = `!{#dd90ff}${nickname}[${id}] ${message} ${(result ? '!{#66cc00}[Удачно]' : '!{#ff6600}[Неудачно]')}`;
    mp.events.call('chat.message.push', message);
});

// mp.events.add('getAnswerMessage', (adminName, adminId, message) => {
//     message = message.join(' ');
//     message = `!{#f29f53}Администратор ${adminName}[${adminId}] ответил вам: ${message}`;
//     mp.events.call('pushChatMessage', message);
// });

// mp.events.add('playerBroadcast', (nickname, id, message) => {
//     message = `!{#81dbcf}[Радио] Ведущий ${nickname}[${id}]: ${message}`;
//     mp.events.call('pushChatMessage', message);
// });

// mp.events.add('playerGnews', (nickname, id, message) => {
//     message = message.join(' ');
//     message = `!{#498fff}[Гос. новости] ${nickname}[${id}]: ${message}`;
//     mp.events.call('pushChatMessage', message);
// });
/*
Если будет сообщение о payday в чате: 

mp.events.add('payDayMessage.client', (hours) => {
    mp.events.call('pushChatMessage.client', `!{#ffffff}Текущее время: !{#4fbeff}${formatTime(hours)}:00`);
    mp.events.call('pushChatMessage.client', '!{#ffdb66}БАНКОВСКИЙ ЧЕК');
    mp.events.call('pushChatMessage.client', '___________________');
    mp.events.call('pushChatMessage.client', '!{#ffffff}Зарплата: !{#66cc00}$1200');
    mp.events.call('pushChatMessage.client', '!{#ffffff}Баланс счета: !{#66cc00}$5600');
    mp.events.call('pushChatMessage.client', '___________________');
});
*/
mp.events.add('chat.message.push', (message) => {
    mp.callCEFR('pushChatMessage', [message]);
});