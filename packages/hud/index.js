// Основной игровой худ - погода, деньги, онлайн
"use strict"

let factions = call('factions');

module.exports = {
    getPlayers() {
        let outputArray = [];
        
        mp.players.forEach((player, id) => {
            if (player.character) {
                let faction;
            
                if (player.character.factionId != null) {
                    faction = factions.getFaction(player.character.factionId).name;
                }

                outputArray.push(
                    {
                        id: player.id,
                        name: player.character.name,
                        ping: player.ping,
                        faction: faction
                    }
                );
            }
        });

        console.log(outputArray);

        return outputArray;
    }
}