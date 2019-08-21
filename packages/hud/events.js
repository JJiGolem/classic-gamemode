var factions = require('../factions');

module.exports = {
    /// Отображение онлайна в худе
    "player.joined": (player) => {
        mp.players.forEach((current) => {
            current.call("hud.setData", [{players: mp.players.length}]);
        });
    },
    "characterInit.done": (player) => {
        player.call('hud.load'); 
    },
    "playerQuit": (player) => {
        mp.players.forEach((current) => {
            current.call("hud.setData", [{players: mp.players.length}]); /// После выхода из игры игрок какое-то время висит в пуле, возможно стоит создать таймер
        });
    },
    "hud.players.list": (player) => {
        if (player.character.admin > 0) {
            let playersInfo = mp.players.toArray().map(currentPlayer => {

                let faction;
                
                if (currentPlayer.character.factionId != null) {
                    faction = factions.getFaction(currentPlayer.character.factionId).name;
                }

                return {
                    id: currentPlayer.id,
                    name: currentPlayer.name,
                    ping: currentPlayer.ping,
                    faction: faction
                }
            });
    
            player.call("hud.players.list", [playersInfo]);
        }
    }
}