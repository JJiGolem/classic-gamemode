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
    "playersList": (player) => {
        if (player.character.admin > 0) {
            let playersInfo = mp.players.toArray().map((pl, index) => {

                let faction;
                
                if (pl.character.factionId != null) {
                    faction = factions.getFaction(pl.character.factionId).name;
                }

                return {
                    id: pl.id,
                    name: pl.name,
                    ping: pl.ping,
                    factionName: faction
                }
            });
    
            console.log(playersInfo)
    
            player.call("hud.players", [playersInfo]);
        }
    }
}