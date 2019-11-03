"use strict";

mp.gui.chat.activate(false);
mp.gui.chat.show(false);
mp.chat = {
    debug: (message) => { /// выводит в чат строку белым цветом (для дебага)
        mp.events.call('chat.message.push', `!{#ffffff} ${message}`);
    }
};


var chatOpacity = 1.0;
var isOpen = false;
const defaultSplitLimit = 95;

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
        if (mp.game.ui.isPauseMenuActive()) return;
        if (mp.busy.includes()) return;
        mp.busy.add('chat', true);
        isOpen = true;
        mp.callCEFR('setFocusChat', [true]);
    });

    mp.keys.bind(0x76, true, function() {
        if (mp.game.ui.isPauseMenuActive()) return;
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

function playChatAnimation(id) {
    var player = mp.players.atRemoteId(id);
    if (!player || player.vehicle || player.getVariable("knocked")) return;
    if (!player.getHealth()) return;
    if (mp.farms.hasProduct(player)) return;
    if (mp.farms.isCropping(player)) return;
    if (mp.factions.hasBox(player)) return;
    if (player.getVariable("cuffs")) return;

    mp.animations.playAnimation(player, {
        dict: "special_ped@baygor@monologue_3@monologue_3e",
        name: "trees_can_talk_4",
        speed: 1,
        flag: 49
    }, 3000);
}

mp.events.add('chat.message.get', (type, message) => {
    mp.afk.action();
    mp.events.callRemote('chat.message.get', type, message);
});

mp.events.add('chat.action.say', (nickname, id, message) => {
    nickname = correctName(nickname);

    splitChatMessage(message, `!{#ffffff}${nickname}[${id}]: `)
    playChatAnimation(id);
    mp.utils.addOverheadText(id, message);
});

mp.events.add('chat.action.shout', (nickname, id, message) => {
    nickname = correctName(nickname);

    if (typeof(message) != "string") message = message.join(' ');
    splitChatMessage(message, `!{#ffdfa8}${nickname}[${id}] кричит: `)
});

mp.events.add('chat.action.walkietalkie', (nickname, id, rank, message) => {
    if (typeof(message) != "string") message = message.join(' ');
    splitChatMessage(message, `!{#33cc66}[R] ${rank} ${nickname}[${id}]: `)
});

mp.events.add('chat.action.nonrp', (nickname, id, message) => {
    nickname = correctName(nickname);

    if (typeof(message) != "string") message = message.join(' ');
    splitChatMessage(message, `!{#c6c695}[OOC] ${nickname}[${id}]: `);
});

mp.events.add('chat.action.me', (nickname, id, message) => {
    nickname = correctName(nickname);

    if (typeof(message) != "string") message = message.join(' ');
    message = `!{#dd90ff}${nickname}[${id}] ${message}`;
    splitChatMessage(message, null, '!{#dd90ff}');
});

mp.events.add('chat.action.do', (nickname, id, message) => {
    nickname = correctName(nickname);

    if (typeof(message) != "string") message = message.join(' ');
    message = `!{#dd90ff}${message} (${nickname}[${id}])`;
    splitChatMessage(message, null, '!{#dd90ff}');
});

mp.events.add('chat.action.try', (nickname, id, message, result) => {
    nickname = correctName(nickname);

    if (typeof(message) != "string") message = message.join(' ');
    message = `!{#dd90ff}${nickname}[${id}] ${message} ${result ? '!{#66cc00} [Удачно]' : '!{#ff6600} [Неудачно]'}`;
    splitChatMessage(message, null, '!{#dd90ff}');
});

mp.events.add('chat.message.push', (message) => {
    if (message.length > 100) {
        message = message.slice(0, 100);
    };
    mp.callCEFR('pushChatMessage', [message]);
});

mp.events.add('chat.message.split', (message, fixed, color) => {
    splitChatMessage(message, fixed, color);
});

function splitChatMessage(message, fixed, color) {
    if (!fixed) fixed = '';
    if (!color) color = '';
    let splitLimit = defaultSplitLimit - fixed.length;
    if (message.length <= splitLimit) {
        mp.events.call('chat.message.push', `${fixed}${message}`);
        return;
    }

    let output = message.substr(0, splitLimit);
    message = message.substr(splitLimit, message.length);
    mp.events.call('chat.message.push', `${fixed}${output}...`);

    while (message.length > splitLimit) {
        output = message.substr(0, splitLimit);
        message = message.substr(splitLimit, message.length);
        mp.events.call('chat.message.push', `${color}${fixed}...${output}...`);
    }

    if (message.length > 0) mp.events.call('chat.message.push', `${color}${fixed}...${message}`);
}
