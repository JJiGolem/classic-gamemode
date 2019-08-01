"use strict";

let houses = require('./files/houses.json');
let interiors = require('./files/interiors.json');

/// Функции модуля парсера JSON в БД
module.exports = {
    async init() {
        console.log("[PARSE] start");
        let interiorsDB = await db.Models.Interior.findAll();
        if (interiorsDB.length == 0) {
            for (let i = 0; i < interiors.length; i++) {
                db.Models.Interior.create({
                    id: interiors[i].id + 1,
                    class: interiors[i].class,
                    numRooms: interiors[i].numRooms,
                    garage: interiors[i].garage,
                    carPlaces: interiors[i].carPlaces,
                    x: interiors[i].x,  
                    y: interiors[i].y,
                    z: interiors[i].z,
                    rotation: interiors[i].rotation,
                    exitX: interiors[i].exitX,  
                    exitY: interiors[i].exitY,
                    exitZ: interiors[i].exitZ
                }, {});
            }
            console.log("[PARSE] interiors loaded");
        }

        let housesDB = await db.Models.House.findAll();
        interiorsDB = await db.Models.Interior.findAll({raw:true});
        if (housesDB.length == 0 && interiorsDB.length != 0) {
            for (let i = 0; i < houses.length; i++) {
                if (interiorsDB.findIndex( x => x.id == houses[i].interior + 1) == -1) continue;
                db.Models.House.create({
                    characterId: null,
                    interiorId: houses[i].interior + 1,
                    isClosed: false,
                    date: null,
                    pickupX: houses[i].pickup[0],
                    pickupY: houses[i].pickup[1],
                    pickupZ: houses[i].pickup[2],
                    spawnX: houses[i].spawn[0],
                    spawnY: houses[i].spawn[1],
                    spawnZ: houses[i].spawn[2],
                    angle: houses[i].angle,
                    price: houses[i].price,
                    carX: houses[i].carpos[0],
                    carY: houses[i].carpos[1],
                    carZ: houses[i].carpos[2],
                    carAngle: houses[i].carangle
                }, {});
            }
            console.log("[PARSE] houses loaded");
        }
        console.log("[PARSE] end");
    },
}