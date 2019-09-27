// Основной игровой худ - погода, деньги, онлайн
"use strict"

let factions = call('factions');

module.exports = {
    getPlayers() {
        let outputArray = [];
        
        mp.players.forEach((player, id) => {
            if (player.character) {
                let factionName = '-';
        
                if (player.character.factionId != null) {
                    let faction = factions.getFaction(player.character.factionId);
                    
                    if (faction) {
                        factionName = faction.name;
                    }
                }

                outputArray.push(
                    {
                        id: player.id,
                        name: player.character.name,
                        ping: player.ping,
                        faction: factionName
                    }
                );
            }
        });

        return outputArray;
    }
}