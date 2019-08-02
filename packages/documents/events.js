"use strict";
let documents = require("./index.js");

module.exports = {
    "init": () => {
        documents.init();
    },
    // "documents.showTo": (player, type, targetId, data) => {
    //     if (player.id == targetId) return mp.events.call('documents.show', player, type, targetId, data);
    //     /// todo with offer
    // },
    "documents.offer": (player, type, targetId, data) => {
        let target = mp.players.at(targetId);
        if (data) {
            data = JSON.parse(data);
            console.log(data);
        }


        if (!target) return;
        switch (type) {
            case 'carPass':
                mp.events.call('documents.carPass.show', player, targetId, data);
                break;
            case 'characterPass':
                mp.events.call('documents.characterPass.show', player, targetId);
                break;
        }
    },
    "documents.carPass.show": (player, targetId, docData) => {
        let target = mp.players.at(targetId);
        if (!target) return;
        let sqlId = docData.id;
        let vehData;
        for (let i = 0; i < player.vehicleList.length; i++) {
            if (player.vehicleList[i].id == sqlId) {
                vehData = {
                    // id: 3940123342,
                    id: 1703190000 + player.vehicleList[i].id,
                    vehType: player.vehicleList[i].vehType,
                    name: player.vehicleList[i].name,
                    regDate: player.vehicleList[i].regDate,
                    price: player.vehicleList[i].price,
                    owners: player.vehicleList[i].owners,
                    number: player.vehicleList[i].plate
                }
            }
        }
        if (!vehData) return;
        target.call('documents.show', ['carPass', vehData]);
    },
    "documents.carPass.list": (player) => {
        let vehicleList = player.vehicleList;
        if (vehicleList.length < 1) return player.call('notifications.push.error', ['У вас нет транспорта', 'Ошибка']);
        let list = []
        vehicleList.forEach((current) => {
            list.push({
                id: current.id,
                plate: current.plate
            });
        });
        player.call('documents.carPass.list.show', [list]);
    },
    "documents.characterPass.show": (player, targetId) => {
        let target = mp.players.at(targetId);
        if (!target) return;
        let data = {
            name: player.character.name,
            sex: player.character.gender,
            number: 2608180000 + player.character.id
        }


        if (!data) return;
        target.call('documents.show', ['characterPass', data]);
    },
}