"use strict";

mp.voiceChat.muted = true;
mp.events.add('characterInit.done', function() {
    mp.keys.bind(0x4E, true, function() {		// N
        if (mp.busy.includes(['chat', 'terminal'])) return;
        if (!mp.busy.add('voicechat')) return;
        mp.voiceChat.muted = false;
        mp.callCEFV("hud.voice = true");
	});

	mp.keys.bind(0x4E, false, function() {		// N
        mp.voiceChat.muted = true;
        mp.callCEFV("hud.voice = false");
		mp.busy.remove('voicechat');
    });
    
    // todo назначить на одну из клавиш F_num
    // mp.keys.bind(0x4E, false, function() {
    //     if (!mp.voiceChat.muted) return;
    //     mp.voiceChat.cleanupAndReload(true, true, true);
    // });
});


mp.speechChanel = {};

const UseAutoVolume = false;

let listeners = new Array();
let channels = {};

/// Добавить канал связи с требуемыми настройками
/// maxRange = 0 - на любой дистанции volume = 1
/// autoConnection будет ли автоматически подключаться/отключаться
mp.speechChanel.addChannel = (name, maxRange = 0, autoConnection = false, use3d = false) => {
    channels[name] = {"maxRange": maxRange, "autoConnection": autoConnection, "use3d": use3d};
}

/// Подключить выбранного игрока к каналу связи
mp.speechChanel.connect = (player, channel) => {
    if (player == null) return;
    let index = listeners.findIndex( x => x.playerId == player.remoteId);
    if (index != -1) {
        if (!listeners[index].channels.includes(channel)) {
            listeners[index].channels.push(channel);
            updateCurrent(player, index, channel);
        }
    }
    else {
        listeners.push({"playerId": player.remoteId, "current": channel, "channels": [channel]});
        mp.events.callRemote("voiceChat.add", player);
        player.voice3d = channels[channel].use3d;
    }


    if(UseAutoVolume) {
        player.voiceAutoVolume = true;
    }
    else {
        player.voiceVolume = 1.0;
    }
    mp.console(JSON.stringify(listeners));
}

/// Отключить выбранного игрока от канала связи
mp.speechChanel.disconnect = (player, channel, death = false) => {
    if (player == null) return;
    let index = listeners.findIndex( x => x.playerId == player.remoteId);
    if (channel == null) {
        index != -1 && listeners.splice(index, 1);
    }
    else {
        let channelIndex = listeners[index].channels.findIndex(x => x == channel);
        channelIndex != -1 && listeners[index].channels.splice(channelIndex, 1);

        if (listeners[index].channels.length == 0) {
            listeners.splice(index, 1);
            mp.events.callRemote("voiceChat.remove", player);
            mp.console(JSON.stringify(listeners));
            return;
        }
        else {
            updateCurrent(player, index);
        }
    }
    if (channel == null && death) {
        mp.events.callRemote("voiceChat.remove", player);
    }
    mp.console(JSON.stringify(listeners));
}

let updateCurrent = function(player, index, newCh) {
    if (channels[listeners[index].current].maxRange == 0) return;
    let maxChannel = listeners[index].current;
    if (newCh) {
        if (channels[newCh].maxRange == 0 || channels[newCh].maxRange > channels[listeners[index].current].maxRange) {
            maxChannel = newCh;
        }
    }
    else {
        for (let i = 0, max = -1; i < listeners[index].channels.length; i++) {
            if (channels[listeners[index].channels[i]].maxRange == 0) {
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
}


mp.speechChanel.addChannel("voice", 20, true, true);
/// Обработчик изменения состояния игроков для изменения состояния голосовой связи
setInterval(() => {
    /// Автоматическое подключение к заданным каналам всех игроков в зоне стрима
	mp.players.forEachInStreamRange(player => {
		if (player != mp.players.local && mp.players.local.dimension == player.dimension) {
            let dist = mp.game.system.vdist(player.position.x, player.position.y, player.position.z,
                mp.players.local.position.x,  mp.players.local.position.y,  mp.players.local.position.z);
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
		if (player.handle !== 0 && player.dimension == mp.players.local.dimension) {
            if (channels[listeners[i].current].maxRange != 0) {
                let dist = mp.game.system.vdist(player.position.x, player.position.y, player.position.z,
                    mp.players.local.position.x,  mp.players.local.position.y,  mp.players.local.position.z);

                if(dist > channels[listeners[i].current].maxRange) {
                    mp.speechChanel.disconnect(player, listeners[i].channel);
                    i--;
                }
                else if(!UseAutoVolume) {
                    player.voiceVolume = 1 - (dist / channels[listeners[i].current].maxRange);
                }
            }
            else {
                player.voiceVolume = 1;
            }
		}
		else {
			mp.speechChanel.disconnect(player, null);
		}
    }
}, 250);


mp.events.add("playerQuit", (player) => {
    if (player.remoteId != mp.players.local.remoteId) {
        mp.speechChanel.disconnect(player, null);
    }
});

mp.events.add("playerDeath", (player) => {
    if (player.remoteId == mp.players.local.remoteId) {
        while (listeners.length != 0) {
            mp.events.callRemote("voiceChat.remove", mp.players.atRemoteId(listeners[0].playerId));
            listeners.splice(0, 1);
        }
    }
    else {
        mp.speechChanel.disconnect(player, null, true);
    }
});