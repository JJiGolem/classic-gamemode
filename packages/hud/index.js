// Основной игровой худ - погода, деньги, онлайн
let factions = call('factions');

module.exports = {
    loadPlayers() {
        let arrayPlayers = [];

        mp.players.forEach(player => {
            if (player.character) {
                let factionName = '-';
        
                if (player.character.factionId != null) {
                    let faction = factions.getFaction(player.character.factionId);
                    
                    if (faction) {
                        factionName = faction.name;
                    }
                }

                let newPlayer = {
                    id: player.id,
                    name: player.character.name,
                    ping: player.ping,
                    faction: factionName
                }

                arrayPlayers.push(newPlayer);
            }
        });

        return arrayPlayers;
    },
    loadNewPlayer(player) {
        if (!player.character) return;

        let factionName = '-';
        
        if (player.character.factionId != null) {
            let faction = factions.getFaction(player.character.factionId);
            
            if (faction) {
                factionName = faction.name;
            }
        }

        let newPlayer = {
            id: player.id,
            name: player.character.name,
            ping: player.ping,
            faction: factionName
        }

        return newPlayer;
    }
};