"use strict";
/// Массив всех домов на сервере
let houses = new Array();
let money = call('money');

/// Функции модуля системы домов
let changeBlip = function(i) {
    if (houses[i].blip == null) return;
    if (houses[i].info.characterId != null) {
        houses[i].blip.color = 1;
    }
    else {
        houses[i].blip.color = 2;
    }
};
let dropHouse = function(i, sellToGov) {
    try {
        if (houses[i].info.characterId == null) return changeBlip(i);
        let characterId = houses[i].info.characterId;
        houses[i].info.characterId = null;
        houses[i].info.characterNick = null;
        houses[i].info.date = null;
        houses[i].info.isOpened = true;
        changeBlip(i);
        houses[i].info.save().then(() => {
            if (money == null) return console.log("[HOUSES] House dropped " + i + ". But player didn't getmoney");
            money.addMoneyById(characterId, houses[i].info.price * 0.6, function(result) {
                if (result) {
                    for (let j = 0; j < mp.players.length; j++) {
                        if (mp.players.at(j).character == null) continue;
                        if (characterId == mp.players.at(j).character.id) {
                            if (sellToGov) {
                                mp.players.at(j).call('house.sell.toGov.ans', [1]);
                            }
                            else {
                                mp.players.at(j).call('phone.app.remove', ["house", i]);
                            }
                            j = mp.players.length;
                        }
                    }
                    console.log("[HOUSES] House dropped " + i);
                }
                else {
                    console.log("[HOUSES] House dropped " + i + ". But player didn't getmoney");
                }
            });        
        }); 
    } catch (error) {
        console.log("[ERROR] " + error);
    }
};

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
        changeBlip(i);
        this.setTimer(i);
    },
    getRandomDate(daysNumber) {
        return new Date(Date.now() + 20000/*(daysNumber * 1000 * 60 * 60 * 24)*/);
    },
    setTimer(i) {
        if (houses[i].info.characterId == null) return;
        if (houses[i].info.date == null) return dropHouse(i);
        if (houses[i].info.date.getTime() - new Date().getTime() <= 10000) return dropHouse(i);
        houses[i].timer != null && clearTimeout(houses[i].timer);
        console.log(houses[i].info.date);
        console.log(houses[i].info.date.getTime());
        console.log(new Date().getTime());
        houses[i].timer = setTimeout(dropHouse, houses[i].info.date.getTime() - new Date().getTime(), i);
    },  
    dropHouse: dropHouse,
    changeBlip: changeBlip,
    getHouse(i) {
        return houses[i];
    },
    getHouseById(id) {
        return houses.find( x => x.info.id == id);
    },
    getHouseIndexByCharId(id) {
        return houses.findIndex( x => x.info.characterId == id);
    },
    getHouseIndexById(id) {
        return houses.findIndex( x => x.info.id == id);
    },
    isHaveHouse(id) {
        return houses.findIndex( x => x.info.characterId == id) != -1;
    },
    getHouseInfoForApp(i) {
        let info = this.getHouse(i).info;
        return {
            name: info.id,
            class: info.Interior.class,
            numRooms:  info.Interior.numRooms,
            garage:  info.Interior.garage,
            carPlaces:  info.Interior.carPlaces,
            rent: 10, //todo with economic system
            isOpened: info.isOpened,
            improvements: new Array(),
            price: info.price,
            days: parseInt((info.date.getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000)),
            pos: [info.pickupX, info.pickupY, info.pickupZ]
        };
    },
};