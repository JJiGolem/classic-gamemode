"use strict";
/// Массив всех домов на сервере
let houses = new Array();
let interiors = new Array();
let garages = new Array();
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
            include: [{ model: db.Models.Interior,
                    include: [{ model: db.Models.Garage,
                        include: [db.Models.GaragePlace]
                    }]
                }
            ]
        });
        for (let i = 0; i < infoHouses.length; i++) {
            this.addHouse(infoHouses[i]);
            this.setTimer(i);
        }
        console.log("[HOUSES] " + infoHouses.length + " houses loaded");
        console.log("[HOUSES] load interiors from DB");
        interiors = await db.Models.Interior.findAll();
        console.log("[HOUSES] " + interiors.length + " interiors loaded");
        garages = await db.Models.Garage.findAll();
        console.log("[HOUSES] " + garages.length + " garages loaded");
    },
    getInteriors() {
        return interiors;
    },
    getGarages() {
        return garages;
    },
    initHouseAdding(player) {
        let interiorsClasses = new Array();
        for (let i = 0; i < interiors.length; i++) {
            interiorsClasses.push({id: interiors[i].id, class: interiors[i].class});
        }

        let garagesIdCarPlaces = new Array();
        for (let i = 0; i < garages.length; i++) {
            garagesIdCarPlaces.push({id: garages[i].id, carPlaces: garages[i].carPlaces});
        }

        player.call('house.add.init', [interiorsClasses, garagesIdCarPlaces]);
    },
    async createHouse(houseInfo) {
        let house = await db.Models.House.create({
            interiorId: houseInfo.interiorId,
            price: houseInfo.price,
            isOpened: true,
            pickupX: houseInfo.pickupX,
            pickupY: houseInfo.pickupY,
            pickupZ: houseInfo.pickupZ,
            spawnX: houseInfo.spawnX,
            spawnY: houseInfo.spawnY,
            spawnZ: houseInfo.spawnZ,
            angle: houseInfo.angle,
            carX: houseInfo.carX,
            carY: houseInfo.carY,
            carZ: houseInfo.carZ,
            carAngle: houseInfo.carAngle,
        }, {
            include: [{ model: db.Models.Interior,
                    include: [{ model: db.Models.Garage,
                        include: [db.Models.GaragePlace]
                    }]
                }
            ]
        });
        house = await db.Models.House.findOne({
            where: {
                id: house.id
            },
            include: [{ model: db.Models.Interior,
                    include: [{ model: db.Models.Garage,
                        include: [db.Models.GaragePlace]
                    }]
                }
            ]
        });
        this.addHouse(house);
        this.setTimer(houses.length - 1);
        console.log("[HOUSES] added new house");
    },
    async createInterior(player, interiorInfo) {
        let interior = await db.Models.Interior.create({
            garageId: interiorInfo.garageId,
            class: interiorInfo.class,
            numRooms: interiorInfo.numRooms,
            rent: interiorInfo.rent,
            exitX: interiorInfo.exitX,
            exitY: interiorInfo.exitY,
            exitZ: interiorInfo.exitZ,
            x: interiorInfo.x,
            y: interiorInfo.y,
            z: interiorInfo.z,
            rotation: interiorInfo.rotation,
        });
        interiors.push(interior);
        this.initHouseAdding(player);
        console.log("[HOUSES] added new interior");
    },
    async createGarage(player, garageInfo) {
        let garage = await db.Models.Garage.create({
            carPlaces: garageInfo.carPlaces,
            x: garageInfo.x,
            y: garageInfo.y,
            z: garageInfo.z,
            rotation: garageInfo.rotation,
            exitX: garageInfo.exitX,
            exitY: garageInfo.exitY,
            exitZ: garageInfo.exitZ,
            GaragePlaces: garageInfo.GaragePlaces,
        }, {
            include: [db.Models.GaragePlace]
        });
        garages.push(garage);
        this.initHouseAdding(player);
        console.log("[HOUSES] added new garage");
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
        let exitGarageMarker = null;
        if (houseInfo.Interior.Garage != null) {
            exitGarageMarker = mp.markers.new(2, new mp.Vector3(houseInfo.Interior.Garage.exitX, houseInfo.Interior.Garage.exitY, houseInfo.Interior.Garage.exitZ), 0.75, {
                rotation: new mp.Vector3(0, 180, 0),
                dimension: dimension
            });
        }
        
        let enterColshape = mp.colshapes.newTube(houseInfo.pickupX, houseInfo.pickupY, houseInfo.pickupZ, 2.0, 1.0, 0);
        let exitColshape = mp.colshapes.newSphere(houseInfo.Interior.exitX, houseInfo.Interior.exitY, houseInfo.Interior.exitZ, 1.0, dimension);
        let exitGarageColshape = null;
        if (houseInfo.Interior.Garage != null) {
            exitGarageColshape = mp.colshapes.newSphere(houseInfo.Interior.Garage.exitX, houseInfo.Interior.Garage.exitY, houseInfo.Interior.Garage.exitZ, 1.0, dimension);
        }
        let blip = mp.blips.new(40, new mp.Vector3(houseInfo.pickupX, houseInfo.pickupY, houseInfo.pickupZ),
        {
            shortRange: true,
            dimension: 0,
            color: houseBlipColor
        });

        enterColshape.marker = enterMarker;
        exitColshape.marker = exitMarker;
        if (exitGarageColshape != null) exitGarageColshape.marker = exitGarageMarker;
        enterColshape.index = houses.length;
        exitColshape.index = houses.length;
        if (exitGarageColshape != null) exitGarageColshape.index = houses.length;
        enterColshape.isHouse = true;
        exitColshape.isHouse = true;
        if (exitGarageColshape != null) exitGarageColshape.isHouse = true;
        enterColshape.place = 0;
        exitColshape.place = 1;
        if (exitGarageColshape != null) exitGarageColshape.place = 2;

        houses.push({
                enter: enterColshape,
                exit: exitColshape,
                exitGarage: exitGarageColshape,
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
        return new Date(Date.now() + (daysNumber * 1000 * 60 * 60 * 24));
    },
    setTimer(i) {
        if (houses[i].info.characterId == null) return;
        if (houses[i].info.date == null) return dropHouse(i);
        if (houses[i].info.date.getTime() - new Date().getTime() <= 10000) return dropHouse(i);
        houses[i].timer != null && clearTimeout(houses[i].timer);
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
            numRooms: info.Interior.numRooms,
            garage: info.Interior.Garage != null,
            carPlaces: info.Interior.Garage != null ? info.Interior.Garage.carPlaces : 1,
            rent: info.price * info.Interior.rent,
            isOpened: info.isOpened,
            improvements: new Array(),
            price: info.price,
            days: parseInt((info.date.getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000)),
            pos: [info.pickupX, info.pickupY, info.pickupZ]
        };
    },
    sellHouse(i, cost, seller, buyer, callback) {
        houses[i].info.characterId = buyer.character.id;
        houses[i].info.characterNick = buyer.character.name;
        houses[i].info.save().then(() => {
            if (money == null) return;
            money.moveCash(buyer, seller, cost, function(result) {
                if (result) {
                    callback(true);
                    seller.call('phone.app.remove', ["house", i]);
                    buyer.call('phone.app.add', ["house", {
                        name: houses[i].info.id,
                        class: houses[i].info.Interior.class,
                        numRooms: houses[i].info.Interior.numRooms,
                        garage: houses[i].info.Interior.Garage != null,
                        carPlaces: houses[i].info.Interior.Garage != null ? houses[i].info.Interior.Garage.carPlaces : 1,
                        rent:  houses[i].info.price * houses[i].info.Interior.rent,
                        isOpened: houses[i].info.isOpened,
                        improvements: new Array(),
                        price: houses[i].info.price,
                        days: parseInt((houses[i].info.date.getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000)),
                        pos: [houses[i].info.pickupX, houses[i].info.pickupY, houses[i].info.pickupZ]
                    }]);
                }
                else {
                    callback(false);
                }
            });        
        }); 
    }
};