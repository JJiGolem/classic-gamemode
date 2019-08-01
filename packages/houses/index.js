"use strict";
/// Массив всех домов на сервере
let houses = new Array();

/// Функции модуля системы домов
module.exports = {
    async init() {
        console.log("[HOUSES] load houses from DB");
        let infoHouses = await db.Models.House.findAll({
            include: [db.Models.Interior]
        });
        for (let i = 0; i < infoHouses.length; i++) {
            this.addHouse(infoHouses[i]);
            this.setTimer(i);
        }
        console.log("[HOUSES] " + infoHouses.length + " loaded");
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
        enterColshape.isHouse = true;
        exitColshape.isHouse = true;
        enterColshape.place = 0;
        exitColshape.place = 1;

        houses.push({
                enter: enterColshape,
                exit: exitColshape,
                blip: blip,
                info: houseInfo
            }
        );
    },
    updateHouse(i) {
        this.changeBlip(i);
        this.setTimer(i);
    },
    getRandomDate(daysNumber) {
        let date = new Date();
        date.setHours(0);
        date.setDate(date.getDate() + daysNumber);
        date.setHours(call('utils').randomInteger(0, 24));
        date.setMinutes(0);
        date.setSeconds(0);
        return date;
    },
    setTimer(i) {
        if (houses[i].info.characterId == null) return;
        if (houses[i].info.date == null) return this.dropHouse(i);
        if (houses[i].info.date.getTime() - new Date().getTime() <= 10000) return this.dropHouse(i);
        houses[i].timer && clearTimeout(houses[i].timer);
        houses[i].timer = setTimeout(this.dropHouse, houses[i].info.date.getTime() - new Date().getTime(), i);
    },  
    dropHouse(i) {
        if (houses[i].info.characterId == null) return this.changeBlip(i);
        let characterId = houses[i].info.characterId;
        houses[i].info.characterId = null;
        houses[i].info.characterNick = null;
        houses[i].info.date = null;

        houses[i].info.save().then(() => {
            for (let j = 0; j < mp.players.length; j++) {
                if (mp.players.at(j).character == null) return;
                if (characterId == mp.players.at(j).character.id) {
                    mp.players.at(j).call('phone.app.remove', ["house", i]);
                    j = mp.players.length;
                }
            }
    
            console.log("[HOUSES] House dropped " + i);
        });
        this.changeBlip(i);
    },
    changeBlip(i) {
        if (houses[i].blip == null) return;
        if (houses[i].info.characterId != null) {
            houses[i].blip.color = 1;
        }
        else {
            houses[i].blip.color = 2;
        }
    },
    getHouse(i) {
        return houses[i];
    }
};