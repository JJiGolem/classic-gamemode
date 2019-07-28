"use strict";

mp.voiceChat.muted = true;
mp.events.add('characterInit.done', function() {
    mp.keys.bind(0x4E, true, function() {		// N
        if (mp.busy.includes('chat')) return;
		if (!mp.busy.add('voicechat')) return;
        mp.voiceChat.muted = false;
        mp.callCEFV("hud.voice = true");
	});

	mp.keys.bind(0x4E, false, function() {		// N
        mp.voiceChat.muted = true;
        mp.callCEFV("hud.voice = false");
		mp.busy.remove('voicechat');
	});
});


mp.speechChanel = {};

const Use3d = true;
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
    let index = listeners.findIndex( x => x.playerId == player.remoteId);
    if (index != -1) {
        if (!listeners[index].channels.includes(channel)) {
            listeners[index].channels.push(channel);
            updateCurrent(index);
        }
    }
    else {
        listeners.push({"playerId": player.remoteId, "current": 0, "channels": [channel]});
        mp.events.callRemote("voiceChat.add", player);
        player.voice3d = channels[channel].use3d;
    }
    
    
    if(UseAutoVolume) {
        player.voiceAutoVolume = true;
    }
    else {
        player.voiceVolume = 1.0;
    }
}

/// Отключить выбранного игрока от канала связи
mp.speechChanel.disconnect = (player, channel, death = false) => {
    let index = listeners.findIndex( x => x.playerId == player.remoteId);
    if (channel == null) {
        index != -1 && listeners.splice(index, 1);
    }
    else {
        let channelIndex = listeners[index].channels.findIndex(x => x == channel);	
        channelIndex != -1 && listeners[index].channels.splice(channelIndex, 1);

        if(listeners[index].channels.length == 0) {
            listeners.splice(index, 1);
            mp.events.callRemote("voiceChat.remove", player);
            return;
        }
        updateCurrent(index);
    }
    if (channel == null && death) {
        mp.events.callRemote("voiceChat.remove", player);
    }
}

let updateCurrent = function(index) {
    let maxI = -1;
    for (let i = 0, max = -1; i < listeners[index].channels.length; i++) {
        if (channels[listeners[index].channels[i]].maxRange == 0) {
            maxI = i;
            break;
        }
        if (channels[listeners[index].channels[i]].maxRange > max) {
            max = channels[listeners[index].channels[i]].maxRange;
            maxI = i;
        }
    }
    listeners[index].current = maxI;
    player.voice3d = channels[listeners[index].channels[maxI]].use3d;
}


mp.speechChanel.addChannel("voice", 50.0, true, true);
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
	listeners.forEach(listener => {
        let player = mp.players.atRemoteId(listener.playerId);
		if(player.handle !== 0) {
            if (channels[listener.channels[listener.current]].maxRange != 0) {		
                let dist = mp.game.system.vdist(player.position.x, player.position.y, player.position.z,  
                    mp.players.local.position.x,  mp.players.local.position.y,  mp.players.local.position.z);
                    
                if(dist > channels[listener.channels[listener.current]].maxRange) {
                    mp.speechChanel.disconnect(player, listener.channel);
                }
                else if(!UseAutoVolume) {
                    player.voiceVolume = 1 - (dist / channels[listener.channels[listener.current]].maxRange);
                }
            }
            else {
                player.voiceVolume = 1;
            }
		}
		else {
			mp.speechChanel.disconnect(player, null);
		}
	});
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