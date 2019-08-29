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
                        name: player.name,
                        ping: player.ping,
                        faction: faction
                    }
                );
            }
        });

        return outputArray;
    }

}

// let players = [
//     {
//         id: 1,
//         name: 'Tom',
//         age: 13
//     },
//     {
//         id: 2,
//         name: 'Dun',
//         age: 12
//     },
//     {
//         id: 3,
//         name: 'Kir',
//         age: 16
//     },
//     {
//         id: 4,
//         name: 'Tim',
//         age: 11
//     },
//     {
//         id: 5,
//         name: 'Bill',
//         age: 10
//     },
// ];

// console.log(getPlayers());

// function getPlayers() {
//     let outputArray = [];

//     players.forEach(player => {
//         if (player.id !== 2) {
//             outputArray.push(
//                 {
//                     name: player.name,
//                     age: player.age
//                 }
//             );
//         }
//     })

//     return outputArray;
// }