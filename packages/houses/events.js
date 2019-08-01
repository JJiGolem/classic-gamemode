"use strict";
/// Модуль системы домов
let housesService = require("./index.js");
let money = call('money');

module.exports = {
    /// Событие инициализации сервера
    "init": () => {
        housesService.init();
    },
    "player.joined": (player) => {
        player.house = {};
        player.house.index = -1;
        player.house.place = 0;
    },
    "playerEnterColshape": (player, shape) => {
        if (!shape.isHouse) return;
        player.house.place = shape.place;
        /// На улице
        if (shape.place == 0) {
            let info = housesService.getHouse(shape.index).info;
            let houseInfo = {};
    
            if (info.characterId == null) {
                houseInfo = {
                    name: info.id,
                    class: info.Interior.class,
                    numRooms: info.Interior.numRooms,
                    garage: info.Interior.garage,
                    carPlaces: info.Interior.carPlaces,
                    rent: 10,   //todo with economy system
                    price: info.price,
                    pos: [info.pickupX, info.pickupY, info.pickupZ]
                };
            }
            else {
                houseInfo = {
                    name: info.id,
                    class: info.Interior.class,
                    numRooms: info.Interior.numRooms,
                    garage: info.Interior.garage,
                    carPlaces: info.Interior.carPlaces,
                    rent: 10,   //todo with economy system
                    owner: info.characterNick,
                    pos: [info.pickupX, info.pickupY, info.pickupZ]
                };
            }
            player.house.index = shape.index;
            player.call('house.menu',[houseInfo]);
        }
        /// В доме / в гараже
        else {
            player.call('house.menu.enter',[shape.place]);
        }
    },
    "playerExitColshape": (player, shape) => {
        if (!shape.isHouse) return;
        if (shape.place == 0) {
            player.call('house.menu.close',[true]);
        }
        else {
            player.call('house.menu.enter.close',[true]);
        }
    },
    "house.enter": (player, place) => {
        if (player.house.index == -1 || player.house.index == null) return player.call('house.enter.ans', []);
        let info = housesService.getHouse(player.house.index).info;
        if (info.characterId != null && info.characterId != player.character.id && info.isClosed) return player.call('house.enter.ans', []);

        let pos;
        let rot;

        if (place == 0) {
            player.dimension = 0;
            pos = new mp.Vector3(info.spawnX, info.spawnY, info.spawnZ);
            rot = info.angle;
        }   
        else if (place == 1) {
            if (player.dist(new mp.Vector3(info.pickupX, info.pickupY, info.pickupZ)) > 2) return player.call('house.enter.ans', []);
            player.dimension = info.id;
            pos = new mp.Vector3(info.Interior.x, info.Interior.y, info.Interior.z);
            rot = info.Interior.rotation;
            
        }
        else if (place == 2) {
            return player.call('house.enter.ans', []);
        }
        player.call('house.enter.ans', [player.house.place == 0, pos, rot]);
        player.house.place = place;
    },
    "house.buy": (player) => {
        if (money == null) return player.call('house.buy.ans', [0, ""]);
        if (player.house.index == -1 || player.house.index == null) return player.call('house.buy.ans', [0, ""]);
        let info = housesService.getHouse(player.house.index).info;
        if (info.characterId != null) return player.call('house.buy.ans', [0, ""]);
        if (player.character.cash < info.price) return player.call('house.buy.ans', [0, ""]);

        money.removeCash(player, info.price, async function(result) {
            if (!result) return player.call('house.buy.ans', [0, ""]);
            info.characterId = player.character.id;
            info.characterNick = player.character.name;
            info.date = housesService.getRandomDate(1);
            await info.save();
            player.call('house.buy.ans', [1, info.characterNick]);
            housesService.updateHouse(player.house.index);
        });
    },
};