"use strict";

mp.voice = {};

const Use3d = true;
const UseAutoVolume = false;

let listeners = new Array();
let channels = {};

/// Добавить канал связи с требуемыми настройками
/// maxRange = 0 - на любой дистанции volume = 1
/// autoConnection будет ли автоматически подключаться/отключаться
mp.speechChanel.addChannel = (name, maxRange = 50.0, autoConnection = false) => {
    channels[name] = {"maxRange": maxRange, "autoConnection": autoConnection};
}

/// Подключить выбранного игрока к каналу связи
mp.speechChanel.connect = (player, channel) => {
    listeners.push({"playerId": player.remoteId, "channel": channel});
    mp.events.callRemote("voiceChat.add", player);
    
    if(UseAutoVolume) {
        player.voiceAutoVolume = true;
    }
    else {
        player.voiceVolume = 1.0;
    }
    if(Use3d) {
        player.voice3d = true;
    }
}

/// Отключить выбранного игрока от канала связи
mp.speechChanel.disconnect = (player, channel) => {
    if (channel == null) {
        for (let idx = listeners.findIndex(x => x.playerId === player.remoteId); idx !== -1; 
        idx = listeners.findIndex(x => x.playerId === player.remoteId)) {
            listeners.splice(idx, 1);
        }
    }
    else {
        let idx = listeners.findIndex(x => x.playerId === player.remoteId && x.channel === channel);	
        if (idx !== -1) listeners.splice(idx, 1);

        if(listeners.findIndex(x => x.playerId === player.remoteId) === -1) {
            mp.events.callRemote("voiceChat.remove", player);
        }
    }
}


mp.speechChanel.addChannel("voice", 50.0, true);
/// Обработчик изменения состояния игроков для изменения состояния голосовой связи
setInterval(() => {
    /// Автоматическое подключение к заданным каналам всех игроков в зоне стрима
	mp.players.forEachInStreamRange(player => {
		if (player != mp.players.local && mp.players.local.dimension == player.dimension) {
            for (let key in channels) {
                if (!channels[key].autoConnection) continue;
                if (listeners.findIndex(x => x.playerId == player.remoteId && x.channel == key) != -1) continue; 

                let dist = mp.game.system.vdist(player.position.x, player.position.y, player.position.z,  
                    mp.players.local.position.x,  mp.players.local.position.y,  mp.players.local.position.z);
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
            let dist = mp.game.system.vdist(player.position.x, player.position.y, player.position.z,  
                mp.players.local.position.x,  mp.players.local.position.y,  mp.players.local.position.z);
            
            if (channels[listener.channel].maxRange != 0) {
                if(dist > channels[listener.channel].maxRange) {
                    mp.speechChanel.disconnect(player, listener.channel);
                }
                else if(!UseAutoVolume) {
                    player.voiceVolume = 1 - (dist / channels[listener.channel].maxRange);
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