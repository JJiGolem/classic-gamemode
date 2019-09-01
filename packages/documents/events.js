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
        console.log('offer');
        if (type == 'driverLicense') {
            if (!player.character.carLicense && !player.character.passengerLicense && !player.character.bikeLicense && !player.character.truckLicense && !player.character.airLicense && !player.character.boatLicense) {
                return player.call('notifications.push.error', ['У вас нет лицензий', 'Документы']);
            }
        }

        if (type == `gunLicense`) {
            if (!player.character.gunLicenseDate) {
                return player.call('notifications.push.error', ['У вас нет лицензии на оружие', 'Документы']);
            }
        }

        if (player.id == targetId) return mp.events.call("documents.show", player.id, type, targetId, data); /// Если показывает себе, то не кидаем оффер

        player.call('notifications.push.info', ['Вы предложили игроку посмотреть документы', 'Документы']);

        let target = mp.players.at(targetId);
        if (!target) return;
        target.documentsOffer = {
            playerId: player.id,
            docType: type,
            docData: data
        };

        player.senderDocumentsOffer = {
            targetPlayer: target
        };

        let docName;
        switch (type) {
            case 'characterPass':
                docName = 'паспорт';
                break;
            case 'carPass':
                docName = 'паспорт Т/С';
                break;
            case 'driverLicense':
                docName = 'лицензии на Т/С'
                break;
            case 'gunLicense':
                docName = 'лицензию на оружие';
                break;
        }
        target.call('offerDialog.show', ["documents", {
            name: player.character.name,
            doc: docName
        }]);
    },
    "documents.offer.accept": (player, accept) => {
        let targetId = player.id;
        let offer = player.documentsOffer;
        let sender = mp.players.at(offer.playerId);
        if (!sender) return;
        if (sender.senderDocumentsOffer.targetPlayer != player) return;

        if (accept) {
            console.log('accept');
            mp.events.call('documents.show', offer.playerId, offer.docType, targetId, offer.docData);
            console.log(player.documentsOffer);
            console.log(sender.senderDocumentsOffer);
            delete player.documentsOffer;
            delete sender.senderDocumentsOffer;
        } else {
            console.log(player.documentsOffer);
            console.log(sender.senderDocumentsOffer);
            delete player.documentsOffer;
            delete sender.senderDocumentsOffer;
        }
    },
    "documents.show": (playerId, type, targetId, data) => {
        let target = mp.players.at(targetId);
        let player = mp.players.at(playerId);
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
            case 'driverLicense':
                mp.events.call('documents.driverLicense.show', player, targetId);
                break;
            case 'gunLicense':
                mp.events.call('documents.gunLicense.show', player, targetId);
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
                    id: documents.getCarPassIdentificator() + player.vehicleList[i].id,
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
        if (player.id == target.id) {
            mp.events.call('/me', player, `смотрит паспорт Т/С "${vehData.name}"`);
        } else {
            mp.events.call('/me', player, `показал${player.character.gender ? 'а' : ''} паспорт Т/С "${vehData.name}" ${target.character.name}[${target.id}]`);
        }
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
            number: documents.getPassIdentificator() + player.character.id,
            regDate: player.character.creationDate
        }
        if (!data) return;
        if (player.id == target.id) {
            mp.events.call('/me', player, `смотрит свой паспорт`);
        } else {
            mp.events.call('/me', player, `показал${player.character.gender ? 'а' : ''} свой паспорт ${target.character.name}[${target.id}]`);
        }
        target.call('documents.show', ['characterPass', data]);
    },
    "documents.driverLicense.show": (player, targetId) => {
        let target = mp.players.at(targetId);
        if (!target) return;
        let data = {
            name: player.character.name,
            categories: [player.character.carLicense, player.character.passengerLicense, player.character.bikeLicense, player.character.truckLicense, player.character.airLicense, player.character.boatLicense],
            sex: player.character.gender,
            number: documents.getLicIdentificator() + player.character.id
        }
        console.log(data.categories);
        if (!data) return;
        if (player.id == target.id) {
            mp.events.call('/me', player, `смотрит свои лицензии на Т/С`);
        } else {
            mp.events.call('/me', player, `показал${player.character.gender ? 'а' : ''} свои лицензии на Т/С ${target.character.name}[${target.id}]`);
        }
        target.call('documents.show', ['driverLicense', data]);
    },
    "documents.gunLicense.show": (player, targetId) => {
        let target = mp.players.at(targetId);
        if (!target) return;
        let data = {
            name: player.character.name,
            sex: player.character.gender,
            number: documents.getGunLicIdentificator() + player.character.id,
            date: player.character.gunLicenseDate
        }
        if (!data) return;
        if (player.id == target.id) {
            mp.events.call('/me', player, `смотрит свою лицензию на оружие`);
        } else {
            mp.events.call('/me', player, `показал${player.character.gender ? 'а' : ''} свои лицензию на оружие ${target.character.name}[${target.id}]`);
        }
        target.call('documents.show', ['gunLicense', data]);
    },
}