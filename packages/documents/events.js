"use strict";
let documents = require("./index.js");
let factions = call("factions");

module.exports = {
    "init": () => {
        documents.init();
        inited(__dirname);
    },
    "documents.offer": (player, type, targetId, data) => {
        if (type == 'driverLicense') {
            if (!player.character.carLicense && !player.character.passengerLicense && !player.character.bikeLicense && !player.character.truckLicense && !player.character.airLicense && !player.character.boatLicense) {
                return player.call('notifications.push.error', ['У вас нет лицензий', 'Документы']);
            }
        }

        if (type == 'gunLicense') {
            if (!player.character.gunLicenseDate) {
                return player.call('notifications.push.error', ['У вас нет лицензии на оружие', 'Документы']);
            }
        }

        if (type == 'medCard') {
            if (!player.character.medCardDate) {
                return player.call('notifications.push.error', ['У вас нет медкарты', 'Документы']);
            }
        }


        if (type == 'governmentBadge') {
            let allowedFactionIds = [2, 3, 4];
            if (!allowedFactionIds.includes(player.character.factionId)) {
                return player.call('notifications.push.error', ['Вы не сотрудник PD/FIB', 'Документы']);
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
            case 'medCard':
                docName = 'медкарту';
                break;
            case 'governmentBadge':
                docName = 'удостоверение';
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
            mp.events.call('documents.show', offer.playerId, offer.docType, targetId, offer.docData);
            delete player.documentsOffer;
            delete sender.senderDocumentsOffer;
        } else {
            delete player.documentsOffer;
            delete sender.senderDocumentsOffer;
        }
    },
    "documents.show": (playerId, type, targetId, data) => {
        let target = mp.players.at(targetId);
        let player = mp.players.at(playerId);
        if (data) {
            data = JSON.parse(data);
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
            case 'medCard':
                mp.events.call('documents.medCard.show', player, targetId);
                break;
            case 'governmentBadge':
                mp.events.call('documents.governmentBadge.show', player, targetId);
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
            mp.events.call('/me', player, `показал${player.character.gender ? 'а' : ''} паспорт своего Т/С "${vehData.name}"`); //${target.character.name}[${target.id}]
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
            regDate: player.character.creationDate,
            spouse: player.spouse ? player.spouse.character.name : null
        }
        if (!data) return;
        if (player.id == target.id) {
            mp.events.call('/me', player, `смотрит свой паспорт`);
        } else {
            mp.events.call('/me', player, `показал${player.character.gender ? 'а' : ''} свой паспорт`);
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
        if (!data) return;
        if (player.id == target.id) {
            mp.events.call('/me', player, `смотрит свои лицензии на Т/С`);
        } else {
            mp.events.call('/me', player, `показал${player.character.gender ? 'а' : ''} свои лицензии на Т/С`);
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
            mp.events.call('/me', player, `показал${player.character.gender ? 'а' : ''} свою лицензию на оружие`);
        }
        target.call('documents.show', ['gunLicense', data]);
    },
    "documents.medCard.show": (player, targetId) => {
        let target = mp.players.at(targetId);
        if (!target) return;
        let data = {
            name: player.character.name,
            gender: player.character.gender ? 'Ж' : 'М',
            identifier: documents.getMedCardIdentificator() + player.character.id,
            time: player.character.medCardDate,
            factionId: player.character.factionId
        }
        if (!data) return;
        if (player.id == target.id) {
            mp.events.call('/me', player, `смотрит свою медкарту`);
        } else {
            mp.events.call('/me', player, `показал${player.character.gender ? 'а' : ''} свою медкарту`);
        }
        target.call('documents.show', ['medCard', data]);
    },
    "documents.governmentBadge.show": (player, targetId) => {
        let target = mp.players.at(targetId);
        if (!target) return;
        let data = {
            name: player.character.name,
            gender: player.character.gender ? 'Женский' : 'Мужской',
            identifier: documents.getBadgeIdentificator() + player.character.id,
            factionId: player.character.factionId,
            directorSign: documents.fibLeaderSign,
            rank: factions.getRankName(player) || 'Нет'
        }
        if (!data) return;
        if (player.id == target.id) {
            mp.events.call('/me', player, `смотрит свое удостоверение`);
        } else {
            mp.events.call('/me', player, `показал${player.character.gender ? 'а' : ''} свое удостоверение`);
        }
        target.call('documents.show', ['governmentBadge', data]);
    },
}