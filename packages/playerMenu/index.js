"use strict";

let bizes = call('bizes');
let factions = call('factions');
let jobs = call('jobs');
let houses = call('houses');

module.exports = {
    init(player) {
        var biz = bizes.getBizByCharId(player.character.id);
        var house = houses.getHouseByCharId(player.character.id);
        var factionName = factions.getFactionName(player);
        var rankName = factions.getRankName(player);
        var jobName = jobs.getJobName(player);

        var data = {
            playerName: player.name,
            admin: player.character.admin,
            factionId: player.character.id,
            factionName: factionName,
            factionRank: rankName,
            jobName: jobName,
            minutes: player.character.minutes,
            gender: player.character.gender,
            cash: player.character.cash,
            wanted: player.character.wanted,
            donate: player.account.donate,
        };
        if (biz) {
            data.biz = {
                id: biz.info.id,
                type: biz.info.type,
                name: biz.info.name,
                price: biz.info.price,
            };
        }
        if (house) {
            data.house = {
                id: house.info.id,
                class: house.info.Interior.class,
                rooms: house.info.Interior.numRooms,
                carPlaces: house.info.Interior.Garage.carPlaces,
                price: house.info.price,
            };
        }
        player.call(`playerMenu.init`, [data]);
    },
};
