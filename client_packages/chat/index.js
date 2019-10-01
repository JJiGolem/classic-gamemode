"use strict";

mp.gui.chat.activate(false);
mp.gui.chat.show(false);
mp.chat = {
    debug: (message) => { /// выводит в чат строку белым цветом (для дебага)
        mp.events.call('chat.message.push', `!{#ffffff} ${message}`);
    }
};


var chatOpacity = 1.0;
var timestamp = true;
var isOpen = false;
// TODO: цвета тэгов

const TAGS_LIST = [{
        id: 0,
        name: "Сказать",
        color: "#ffffff"
    },
    {
        id: 1,
        name: "Крикнуть",
        color: "#ffdfa8"
    },
    {
        id: 2,
        name: "Рация",
        color: "#33cc66"
    },
    {
        id: 3,
        name: "НонРП",
        color: "#c6c695"
    },
    {
        id: 4,
        name: "Действие",
        color: "#dd90ff"
    },
    {
        id: 5,
        name: "Пояснение",
        color: "#82dbff"
    },
    {
        id: 6,
        name: "Попытка",
        color: "#ddff82"
    }
];

var availableTags = [];

function setDefaultTags() {
    TAGS_LIST.forEach((tag) => {
        if (tag.id != 2) {
            availableTags.push(tag);
        }
    })
}

mp.events.add('chat.load', () => {
    setDefaultTags();
    mp.callCEFR('setTagsChat', [availableTags]);
    mp.callCEFR('showChat', [true]);
    mp.callCEFR('setOpacityChat', [1.0]);
    mp.callCEFR('setTimeChat', [true]);

    mp.keys.bind(0x54, true, function() {

        if (mp.busy.includes()) return;
        mp.busy.add('chat');
        isOpen = true;
        mp.gui.cursor.show(true, true);
        mp.callCEFR('setFocusChat', [true]);
    });

    mp.keys.bind(0x76, true, function() {

        if (mp.busy.includes()) return;

        if (isOpen) return;

        switch (chatOpacity) {
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

mp.events.add('chat.close', () => {
    mp.callCEFR('setFocusChat', [false]);
    mp.gui.cursor.show(false, false);
    isOpen = false;
    mp.busy.remove('chat');
});

mp.events.add('chat.opacity.set', (enable) => {
    mp.callCEFR('setOpacityChat', [enable]);
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

mp.events.add('chat.tags.delete', (tagIDs) => {
    tagIDs.forEach((tagID) => {
        let i = availableTags.findIndex(x => x.id == tagID)
        if (i != -1) {
            availableTags.splice(i, 1);
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

function correctName(name) {
    if (name == mp.players.local.name) return name;
    var player = mp.utils.getPlayerByName(name);
    if (player && !player.isFamiliar) return `Незнакомец`;
    return name;
}

mp.events.add('chat.message.get', (type, message) => {
    if (message == "/timestamp") {
        if (timestamp) {
            mp.callCEFR('setTimeChat', [false]);
            timestamp = false;
        } else {
            mp.callCEFR('setTimeChat', [true]);
            timestamp = true;
        }
        return;
    }
    mp.events.callRemote('chat.message.get', type, message);
});

mp.events.add('chat.action.say', (nickname, id, message) => {
    nickname = correctName(nickname);

    message = `!{#ffffff}${nickname}[${id}]: ${message}`;
    mp.events.call('chat.message.push', message);

    var player = mp.players.atRemoteId(id);
    if (!player) return;
    mp.animations.playAnimation(player, {
        dict: "special_ped@baygor@monologue_3@monologue_3e",
        name: "trees_can_talk_4",
        speed: 1,
        flag: 49
    }, 3000);
});

mp.events.add('chat.action.shout', (nickname, id, message) => {
    nickname = correctName(nickname);

    if (typeof(message) != "string") message = message.join(' ');
    message = `!{#ffdfa8}${nickname}[${id}] кричит: ${message}`;
    mp.events.call('chat.message.push', message);
});

mp.events.add('chat.action.walkietalkie', (nickname, id, rank, message) => { //add rank
    if (typeof(message) != "string") message = message.join(' ');
    message = `!{#33cc66}[R] ${rank} ${nickname}[${id}]: ${message}`;
    mp.events.call('chat.message.push', message);
});

mp.events.add('chat.action.nonrp', (nickname, id, message) => {
    nickname = correctName(nickname);

    if (typeof(message) != "string") message = message.join(' ');
    message = `!{#c6c695}(( ${nickname}[${id}]: ${message} ))`;
    mp.events.call('chat.message.push', message);
});

mp.events.add('chat.action.me', (nickname, id, message) => {
    nickname = correctName(nickname);

    if (typeof(message) != "string") message = message.join(' ');
    message = `!{#dd90ff}${nickname}[${id}] ${message}`;
    mp.events.call('chat.message.push', message);
});

mp.events.add('chat.action.do', (nickname, id, message) => {
    nickname = correctName(nickname);

    if (typeof(message) != "string") message = message.join(' ');
    message = `!{#dd90ff}${message} (${nickname}[${id}])`;
    mp.events.call('chat.message.push', message);
});

mp.events.add('chat.action.try', (nickname, id, message, result) => {
    nickname = correctName(nickname);

    if (typeof(message) != "string") message = message.join(' ');
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
    if (message.length > 100) {
        message = message.slice(0, 95);
    };
    mp.callCEFR('pushChatMessage', [message]);
});
