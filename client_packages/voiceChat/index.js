"use strict";

mp.voiceChat.muted = true;
mp.events.add('characterInit.done', function() {
    mp.keys.bind(0x4E, true, function() { // N
        if (mp.game.ui.isPauseMenuActive()) return;
        if (mp.busy.includes(['chat', 'terminal'])) return;
        if (!mp.busy.add('voicechat', false)) return;
        if (mp.chat.clearMuteTime) {
            if (mp.chat.clearMuteTime < Date.now()) {
                mp.chat.clearMuteTime = 0;
                mp.notify.success(`Использование чатов снова доступно. Не нарушайте правила сервера.`, `MUTE`);
                mp.events.callRemote(`chat.mute.clear`);
                mp.events.call("hud.setData", {
                    mute: false
                });
            } else {
                var mins = Math.ceil((mp.chat.clearMuteTime - Date.now()) / 1000 / 60);
                return mp.notify.error(`До разблокировки войс-чата осталось ${mins} мин!`);
            }
        }
        mp.voiceChat.muted = false;
        mp.callCEFV("hud.voice = true");
        playVoiceAnimation(mp.players.local);
    });

    mp.keys.bind(0x4E, false, function() { // N
        if (mp.game.ui.isPauseMenuActive()) return;
        mp.voiceChat.muted = true;
        mp.callCEFV("hud.voice = false");
        mp.busy.remove('voicechat');
    });

    mp.keys.bind(0x73, false, function() { // F4
        if (!mp.voiceChat.muted) return mp.notify.error("Отпустите клавишу N", "Голосовой чат");
        mp.voiceChat.cleanupAndReload(true, true, true);
        mp.notify.success("Голосовой чат был перезагружен", "Голосовой чат");
    });
});


mp.speechChanel = {};

let listeners = [];
let channels = {};

/// Добавить канал связи с требуемыми настройками
/// maxRange = 0 - на любой дистанции volume = 1
/// autoConnection будет ли автоматически подключаться/отключаться
mp.speechChanel.addChannel = (name, maxRange = 0, autoConnection = false, use3d = false) => {
    channels[name] = {
        "maxRange": maxRange,
        "autoConnection": autoConnection,
        "use3d": use3d
    };
};

/// Подключить выбранного игрока к каналу связи
mp.speechChanel.connect = (player, channel) => {
    if (player == null) return;
    let index = listeners.findIndex(x => x.playerId === player.remoteId);
    if (index !== -1) {
        if (!listeners[index].channels.includes(channel)) {
            listeners[index].channels.push(channel);
            updateCurrent(player, index, channel);
        }
    } else {
        listeners.push({
            "playerId": player.remoteId,
            "current": channel,
            "channels": [channel]
        });
        mp.events.callRemote("voiceChat.add", player);
        player.voice3d = channels[channel].use3d;
    }

    player.voiceVolume = 1.0;
};
mp.events.add("voiceChat.connect", (playerId, channel) => {
    mp.speechChanel.connect(mp.players.atRemoteId(playerId), channel);
});

/// Отключить выбранного игрока от канала связи
mp.speechChanel.disconnect = (player, channel, isSend = false) => {
    if (player == null) return;
    let index = listeners.findIndex(x => x.playerId === player.remoteId);
    if (index === -1) return;
    if (channel == null) {
        listeners.splice(index, 1);
    } else {
        let channelIndex = listeners[index].channels.findIndex(x => x == channel);
        if (channelIndex !== -1) {
            listeners[index].channels.splice(channelIndex, 1);
            listeners[index].current = null;
        }
        if (listeners[index].channels.length === 0) {
            listeners.splice(index, 1);
            mp.events.callRemote("voiceChat.remove", player);
        } else {
            updateCurrent(player, index);
        }
    }
    if (channel == null && isSend) {
        mp.events.callRemote("voiceChat.remove", player);
    }
};
mp.events.add("voiceChat.disconnect", (playerId, channel) => {
    mp.speechChanel.disconnect(mp.players.atRemoteId(playerId), channel);
});

let updateCurrent = function(player, index, newCh) {
    if (listeners[index].current != null) {
        if (channels[listeners[index].current].maxRange === 0) return;
    }

    let maxChannel = listeners[index].current;
    if (newCh && listeners[index].current != null) {
        if (channels[newCh].maxRange === 0 || channels[newCh].maxRange > channels[listeners[index].current].maxRange) {
            maxChannel = newCh;
        }
    } else {
        for (let i = 0, max = -1; i < listeners[index].channels.length; i++) {
            if (channels[listeners[index].channels[i]].maxRange === 0) {
                maxChannel = listeners[index].channels[i];
                break;
            }
            if (channels[listeners[index].channels[i]].maxRange > max) {
                max = channels[listeners[index].channels[i]].maxRange;
                maxChannel = listeners[index].channels[i];
            }
        }
    }
    listeners[index].current = maxChannel;
    player.voice3d = channels[maxChannel].use3d;
};


mp.speechChanel.addChannel("voice", 10, true, true);
/// Обработчик изменения состояния игроков для изменения состояния голосовой связи
mp.timer.addInterval(() => {
    /// Автоматическое подключение к заданным каналам всех игроков в зоне стрима
    mp.players.forEachInStreamRange(player => {
        if (player != mp.players.local && mp.players.local.dimension === player.dimension) {
            let dist = mp.game.system.vdist(player.position.x, player.position.y, player.position.z,
                mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z);
            for (let key in channels) {
                if (!channels[key].autoConnection) continue;
                if (dist <= channels[key].maxRange) {
                    mp.speechChanel.connect(player, key);
                }
            }
        }
    });
    /// Автоматическое отключение заданных каналов всех игроков
    for (let i = 0; i < listeners.length; i++) {
        let player = mp.players.atRemoteId(listeners[i].playerId);
        if (player == null) return;
        if (channels[listeners[i].current].maxRange != 0) {
            let dist = mp.game.system.vdist(player.position.x, player.position.y, player.position.z,
                mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z);

            if (dist > channels[listeners[i].current].maxRange || player.dimension !== mp.players.local.dimension) {
                mp.speechChanel.disconnect(player, listeners[i].current);
                i--;
            } else {
                player.voiceVolume = 1 - (dist / channels[listeners[i].current].maxRange);
            }
        } else {
            player.voiceVolume = 1;
        }
    }
}, 250);


mp.events.add("playerQuit", (player) => {
    if (player.remoteId !== mp.players.local.remoteId) {
        mp.speechChanel.disconnect(player, null);
    }
});

mp.events.add("playerDeath", (player) => {
    if (player.remoteId === mp.players.local.remoteId) {
        while (listeners.length !== 0) {
            mp.events.callRemote("voiceChat.remove", mp.players.atRemoteId(listeners[0].playerId));
            listeners.splice(0, 1);
        }
    } else {
        mp.speechChanel.disconnect(player, null, true);
    }
});

mp.timer.addInterval(() => {
    mp.players.forEachInStreamRange((player) => {
        if (player == mp.players.local || mp.vdist(mp.players.local.position, player.position) > 20) return;
        if (player.isVoiceActive) playVoiceAnimation(player);
    });
}, 250);

function playVoiceAnimation(player) {
    player.playFacialAnim("mic_chatter", "mp_facial");
}
