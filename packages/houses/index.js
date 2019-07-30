"use strict";
/// Функции модуля системы домов

/// Массив всех домов на сервере
let houses = new Array();

module.exports = {
    async init() {
        let infoHouses = await db.Models.House.findAll({
            includes: [db.Models.Interior]
        });
        for (let i = 0; i < infoHouses.length; i++) {
            this.addHouse(infoHouses);
        }

    },
    addHouse(houseInfo) {
        let dimension = houseInfo.id;
        let houseBlipColor;
        if (houseInfo.characterId == null) {
            houseBlipColor = 2;
        }
        else {
            houseBlipColor = 1;
        }

        let enterMarker = mp.markers.new(2, new mp.Vector3(houseInfo.pickupX, houseInfo.pickupY, houseInfo.pickupZ), 0.75, {
            rotation: new mp.Vector3(0, 180, 0),
            dimension: 0
        });
        let exitMarker = mp.markers.new(2, new mp.Vector3(houseInfo.Interior.exitX, houseInfo.Interior.exitY, houseInfo.Interior.exitZ), 0.75, {
            rotation: new mp.Vector3(0, 180, 0),
            dimension: dimension
        });
        let enterColshape = mp.colshapes.newTube(houseInfo.pickupX, houseInfo.pickupY, houseInfo.pickupZ, 2.0, 1.0, 0);
        let exitColshape = mp.colshapes.newSphere(houseInfo.Interior.exitX, houseInfo.Interior.exitY, houseInfo.Interior.exitZ, 1.0, dimension);
        let blip = mp.blips.new(40, new mp.Vector3(houseInfo.pickupX, houseInfo.pickupY, houseInfo.pickupZ),
        {
            shortRange: true,
            dimension: 0,
            color: houseBlipColor
        });

        enterColshape.marker = enterMarker;
        exitColshape.marker = exitMarker;
        enterColshape.index = houses.length;
        exitColshape.index = houses.length;

        houses.push({
                enter: enterColshape,
                exit: exitColshape,
                blip: blip,
                info: houseInfo
            }
        );
    },
    dropHouse(index) {
        // if (houses[index].owner == null) return;
        // let ownerId = houses[index].owner.id;
        // houses[index].owner = null;
        // updateHouse(index, function() {
        //     for (let i = 0; i < mp.players.length; i++) {
        //         if (ownerId == mp.players.at(i).info.personId) {
        //             mp.players.at(i).call('removeApp.client', ["house", index]);
        //             i = mp.players.length;
        //         }
        //     }
    
        //     console.log("[info] House dropped " + index);
        // });
        // changeBlip(index);
    },
};