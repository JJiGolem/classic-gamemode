// Основной игровой худ - погода, деньги, онлайн

"use strict"

module.exports = {
    getPlayers() {  
        return mp.players.toArray().map(currentPlayer => {
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
    }

}