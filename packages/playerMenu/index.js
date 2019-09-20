"use strict";

let bizes = call('bizes');
let houses = call('houses');

module.exports = {
    init(player) {
        var biz = bizes.getBizByCharId(player.character.id);
        var house = houses.getHouseByCharId(player.character.id);

        var data = {
            playerName: player.name,
            admin: player.character.admin,
            factionId: player.character.factionId,
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
