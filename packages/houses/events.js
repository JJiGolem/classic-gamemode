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
    "characterInit.done": (player) => {
        if (player.character.admin < 5) return;
        let interiors = housesService.getInteriors();
        let interiorsClasses = new Array();
        for (let i = 0; i < interiors.length; i++) {
            interiorsClasses.push({id: interiors[i].id, class: interiors[i].class});
        }
        player.call('house.add.init', [interiorsClasses]);
    },
    "playerEnterColshape": (player, shape) => {
        if (!shape.isHouse) return;
        player.house.place = shape.place;
        let info = housesService.getHouse(shape.index).info;
        /// На улице
        if (shape.place == 0) {
            let houseInfo = {};
    
            if (info.characterId == null) {
                houseInfo = {
                    name: info.id,
                    class: info.Interior.class,
                    numRooms: info.Interior.numRooms,
                    garage: info.Interior.Garage != null,
                    carPlaces: info.Interior.Garage != null ? info.Interior.Garage.carPlaces : 1,
                    rent: info.price * info.Interior.rent,
                    price: info.price,
                    pos: [info.pickupX, info.pickupY, info.pickupZ]
                };
            }
            else {
                houseInfo = {
                    name: info.id,
                    class: info.Interior.class,
                    numRooms: info.Interior.numRooms,
                    garage: info.Interior.Garage != null,
                    carPlaces: info.Interior.Garage != null ? info.Interior.Garage.carPlaces : 1,
                    rent: info.price * info.Interior.rent,
                    owner: info.characterNick,
                    pos: [info.pickupX, info.pickupY, info.pickupZ]
                };
            }
            player.house.index = shape.index;
            player.call('house.menu',[houseInfo]);
        }
        /// В доме / в гараже
        else {
            player.call('house.menu.enter',[shape.place, info.Interior.Garage != null]);
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
        console.log(place);
        if (player.house.index == -1 || player.house.index == null) return player.call('house.enter.ans', []);
        let info = housesService.getHouse(player.house.index).info;
        if (info.characterId != null && info.characterId != player.character.id && !info.isOpened) return player.call('house.enter.ans', []);

        let pos;
        let rot;

        if (place == 0) {
            player.dimension = 0;
            pos = new mp.Vector3(info.spawnX, info.spawnY, info.spawnZ);
            rot = info.angle;
        }   
        else if (place == 1) {
            player.dimension = info.id;
            pos = new mp.Vector3(info.Interior.x, info.Interior.y, info.Interior.z);
            rot = info.Interior.rotation;
            
        }
        else if (place == 2) {
            if (info.Interior.Garage == null) return player.call('house.enter.ans', []);
            player.dimension = info.id;
            pos = new mp.Vector3(info.Interior.Garage.x, info.Interior.Garage.y, info.Interior.Garage.z);
            rot = info.Interior.Garage.rotation;
        }
        player.call('house.enter.ans', [player.house.place == 0, pos, rot]);
        player.house.place = place;
    },
    "house.buy": (player) => {
        if (money == null) return player.call('house.buy.ans', [0, ""]);
        if (player.house.index == -1 || player.house.index == null) return player.call('house.buy.ans', [0, ""]);
        let info = housesService.getHouse(player.house.index).info;
        if (info.characterId != null) return player.call('house.buy.ans', [0, ""]);
        if (player.dist(new mp.Vector3(info.pickupX, info.pickupY, info.pickupZ)) > 10) return player.call('house.buy.ans', [0, ""]);
        if (player.character.cash < info.price) return player.call('house.buy.ans', [0, ""]);
        if (housesService.isHaveHouse(player.character.id)) return player.call('house.buy.ans', [2, ""]);

        money.removeCash(player, info.price, async function(result) {
            if (!result) return player.call('house.buy.ans', [0, ""]);
            info.characterId = player.character.id;
            info.characterNick = player.character.name;
            info.date = housesService.getRandomDate(1);
            await info.save();
            player.call('house.buy.ans', [1, player.character.name]);
            housesService.updateHouse(player.house.index);
            
            player.call('phone.app.add', ["house", housesService.getHouseInfoForApp(player.house.index)]);
        });
    },
    /// Phone app events
    "house.lock": (player, id, isOpened) => {
        if (player == null) return;
        id = parseInt(id);
        if (isNaN(id)) return;
        let info = housesService.getHouseById(id).info;
        info.isOpened = isOpened;
        info.save();
    },
    "house.sell.toGov": (player, id) => {
        if (money == null) return player.call('house.sell.toGov.ans', [0]);
        if (player == null) return player.call('house.sell.toGov.ans', [0]);
        id = parseInt(id);
        if (isNaN(id)) return player.call('house.sell.toGov.ans', [0]);
        let index = housesService.getHouseIndexById(id);
        if (index == -1) return player.call('house.sell.toGov.ans', [0]);
        let info = housesService.getHouse(index).info;
        if (player.dist(new mp.Vector3(info.pickupX, info.pickupY, info.pickupZ)) > 10) return player.call('house.sell.toGov.ans', [3]);
        if (info.characterId != player.character.id) return player.call('house.sell.toGov.ans', [0]);
        housesService.dropHouse(index, true);
    },
    "house.sell.check": (player, idOrNick) => {
        let id = parseInt(idOrNick);
        if (isNaN(id)) {
            if (player.character.name == idOrNick) return player.call("house.sell.check.ans", [null]);
            for (let i = 0; i < mp.players.length; i++) {
                if (mp.players.at(i) == null) continue;
                if (mp.players.at(i).character == null) continue;
                if (mp.players.at(i).character.name == idOrNick) {
                    player.call("house.sell.check.ans", [character.name]);
                    player.house.buyerIndex = i;
                    return;
                }
            }
            player.call("house.sell.check.ans", [null]);
        }
        else {
            if (id > 1000000) return player.call("house.sell.check.ans", [null]);
            if (mp.players.at(id).character != null) {
                player.house.buyerIndex = id;
                player.call("house.sell.check.ans", [mp.players.at(id).character.name]);
            }
            else {
                player.call("house.sell.check.ans", [null]);
            }
        }
    },
    "house.sell": (player, name, cost) => {
        if (player.house.buyerIndex == null) return player.call("house.sell.ans", [0]);
        if (mp.players.at(player.house.buyerIndex) == null) return player.call("house.sell.ans", [0]);
        name = parseInt(name);
        cost = parseInt(cost);
        if (isNaN(name) || isNaN(cost)) return player.call("house.sell.ans", [0]);
        if (mp.players.at(player.house.buyerIndex).character.cash < cost) return player.call("house.sell.ans", [2]);
        if (housesService.isHaveHouse(mp.players.at(player.house.buyerIndex).character.id)) return player.call("house.sell.ans", [2]);
        let index = housesService.getHouseIndexById(name);
        if (index == -1) return player.call("house.sell.ans", [0]);
        let info = housesService.getHouse(index).info;
        if (player.dist(new mp.Vector3(info.pickupX, info.pickupY, info.pickupZ)) > 10 || 
            mp.players.at(player.house.buyerIndex).dist(new mp.Vector3(info.pickupX, info.pickupY, info.pickupZ)) > 10) return player.call("house.sell.ans", [3]);
        if (cost < info.price || cost > 1000000000) return player.call("house.sell.ans", [4]);
        mp.players.at(player.house.buyerIndex).house.sellerIndex = player.id;
        player.house.sellingHouseIndex = index;
        player.house.sellingHouseCost = cost;
        mp.players.at(player.house.buyerIndex).call('offerDialog.show', ["house_sell", {
            name: player.character.name,
            price: cost
        }]);
    },
    "house.sell.ans": (player, result) => {
        if (player.house.sellerIndex == null) return;
        if (mp.players.at(player.house.sellerIndex) == null) return;
        if (mp.players.at(player.house.sellerIndex).house == null) return;
        if (mp.players.at(player.house.sellerIndex).house.buyerIndex == null) return;
        let info = housesService.getHouse(mp.players.at(player.house.sellerIndex).house.sellingHouseIndex).info;
        if (info.characterId != mp.players.at(player.house.sellerIndex).character.id) return mp.players.at(player.house.sellerIndex).call("house.sell.ans", [0]);
        if (player.dist(new mp.Vector3(info.pickupX, info.pickupY, info.pickupZ)) > 10 || 
            mp.players.at(player.house.sellerIndex).dist(new mp.Vector3(info.pickupX, info.pickupY, info.pickupZ)) > 10) return mp.players.at(player.house.sellerIndex).call("house.sell.ans", [3]);
        if (player.character.cash < info.price) return mp.players.at(player.house.sellerIndex).call("house.sell.ans", [2]);
        if (housesService.isHaveHouse(player.character.id)) return mp.players.at(player.house.sellerIndex).call("house.sell.ans", [2]);
        if (result == 2) return  mp.players.at(player.house.sellerIndex).call("house.sell.ans", [2]);

        housesService.sellHouse(mp.players.at(player.house.sellerIndex).house.sellingHouseIndex, mp.players.at(player.house.sellerIndex).house.sellingHouseCost,
            mp.players.at(player.house.sellerIndex), player, function(ans) {
                if (ans) {
                    mp.players.at(player.house.sellerIndex).call("house.sell.ans", [1]);
                }
                else {
                    mp.players.at(player.house.sellerIndex).call("house.sell.ans", [0]);
                }
            });
        mp.players.at(player.house.sellerIndex).house.buyerIndex = null;
        player.house.sellerIndex = null;
        mp.players.at(player.house.sellerIndex).house.sellingHouseIndex = null;
        mp.players.at(player.house.sellerIndex).house.sellingHouseCost = null;
    },
    "house.sell.stop": (player) => {
        if (player.house.buyerIndex != null) {
            mp.players.at(player.house.buyerIndex).call("offerDialog.hide");
            mp.players.at(player.house.buyerIndex).house.sellerIndex = null;
        }
        player.house.buyerIndex = null;
        player.house.sellingHouseIndex = null;
        player.house.sellingHouseCost = null;

    },
};