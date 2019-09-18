var hud = require('./index.js');
let factions = call('factions');

module.exports = {
    /// Отображение онлайна в худе
    "player.joined": (player) => {
        mp.players.forEach((current) => {
            current.call("hud.setData", [{players: mp.players.length}]);
        });
    },
    "characterInit.done": (player) => {
        player.call('hud.load'); 

        let faction;
            
        if (player.character.factionId != null) {
            faction = factions.getFaction(player.character.factionId).name;
        }

        let newPlayer = {
            id: player.id,
            name: player.character.name,
            ping: player.ping,
            faction: faction
        }
        mp.players.forEach(current => {
            current.call('hud.players.list.add', [newPlayer])
        })
    },
    "playerQuit": (player) => {
        mp.players.forEach((current) => {
            current.call("hud.setData", [{players: mp.players.length}]); /// После выхода из игры игрок какое-то время висит в пуле, возможно стоит создать таймер
            current.call('hud.players.list.remove', [player.id]);
        });
    },
    "hud.players.list.load": (player) => {
        if (player.character.admin > 0) {
            player.call("hud.players.list.show", [true]);
            player.call("hud.players.list.load", [hud.getPlayers()]);
        }
    }
}