"use strict";
/// Модуль телефона
let phone = require("./index.js");




module.exports = {
    /// Событие инициализации сервера
    "init": () => {
        phone.init();
    },
    'playerJoin': player => {
        player.isTalking = false;
    },
    'playerQuit': player => {
        player.phone.save();
    },
    'characterInit.done': async (player) => {
        // PhoneDialogs = [{name: null, number: "5553535", PhoneMessages: [isMine: true, text: "Займы под 100% годовых"]}];
        player.phone = await db.Models.Phone.findOne({
            where: {
                characterId: player.character.id
            },
            include: [
                db.Models.PhoneContact, {
                    model: db.Models.PhoneDialog,
                    include: [db.Models.PhoneMessage]
                }
            ]
        });
        phone.loadPhoneOnClient(player);
    },
    "phone.buy": async (player) => {
        let number = phone.generateNumber();
        if (!number) return;
        player.phone = {
            characterId: player.character.id,
            number: number,
            PhoneContacts: [],
            PhoneDialogs: []
        };
        player.phone.PhoneContacts.push({name: "Мой номер", number: number});
        player.phone = await db.Models.Phone.create(player.phone, {
            include: [{
                    model: db.Models.PhoneContact
                }, {
                    model: db.Models.PhoneDialog,
                    include: [db.Models.PhoneMessage]
                }
            ]
        });
        phone.loadPhoneOnClient(player);
    },
    'phoneCall.server': (player, number) => {
        if (player.info == null) return;
        if (!player.info.inventory.phone.isHave) return;
        if (player.phone.isTalking) {
            player.call('startCallAns.client', [2]);
            return;
        };
        if (!isExist(number)) {
            player.call('startCallAns.client', [1]);
            return;
        }
        for (let i = 0; i < mp.players.length; i++) {
            if (mp.players[i].info == null) continue;
            if (!mp.players[i].info.inventory.phone.isHave) continue;
            if (mp.players[i].info.inventory.phone.number != number) continue;
            if (mp.players[i].phone.isTalking) {
                player.call('startCallAns.client', [2]);
                return;
            }
            mp.players[i].call('inCall.client', [player.info.inventory.phone.number, player.id]);
            return;
        }
        player.call('startCallAns.client', [3]);
    },
    'phoneCallAns.server': (player, ans, callerId) => {
        if (callerId == -1) return;
        if (ans == 1) {
            if (mp.players.at(callerId).info == null) {
                if (player.info != null) {
                    player.call('endCallAns.client', []);
                }
            }
            else {
                if (player.info != null) {
                    player.phone.isTalking = true;
                    mp.players.at(callerId).phone.isTalking = true;
                    mp.players.at(callerId).call('startCallAns.client', [0, player.id]);
                    return;
                }
                else {
                    mp.players.at(callerId).call('startCallAns.client', [3]);
                }
            }
        }
        else {
            if (mp.players.at(callerId).info != null) {
                mp.players.at(callerId).call('startCallAns.client', [3]);
            }
        }
    },
    'endCall.server': (player, callerId) => {
        player.phone.isTalking = false;
        if (callerId != -1) {
            if (mp.players.at(callerId) != null) {
                if (mp.players.at(callerId).info != null) {
                    mp.players.at(callerId).phone.isTalking = false;
                    mp.players.at(callerId).call('endCallAns.client', []);
                }
            }
        }
    },
    /// Отправка сообщения игроку данным номером
    'phone.message.send': async (player, message, number) => {
        if (player.phone == null) return;
        if (message.length > 100) return;
        if (!phone.isExists(number)) return;

        /// Работа с отправителем
        let index = player.phone.PhoneDialogs.findIndex( x => x.number == number);
        if (index == -1) {
            let contact = null;
            if (player.phone.PhoneContacts != null) contact = player.phone.PhoneContacts.find( x => x.number == number);
            let newDialog = db.Models.PhoneDialog.build({phoneId: player.phone.id, name: contact != null ? contact.name : null, number: number, PhoneMessages: [
                {isMine: true, text: message, isRead: true, date: Date.now()}
            ]}, { include: [db.Models.PhoneMessage]});
            let result = await newDialog.save();
            player.phone.PhoneDialogs.push(result);
        }
        else {
            let newMessage = db.Models.PhoneMessage.build({phoneDialogId: player.phone.PhoneDialogs[index].id, isMine: true, text: message, isRead: true, date: Date.now()});
            let result = await newMessage.save();
            player.phone.PhoneDialogs[index].PhoneMessages.push(result);
        }
        
        /// Работа с получателем
        if (player.phone.number == number) return;
        for (let i = 0; i < mp.players.length; i++) {
            if (player.id == i) continue;
            if (player.phone == null) continue;
            if (mp.players.at(i).phone.number == number) {
                index = mp.players.at(i).phone.PhoneDialogs.findIndex( x => x.number == player.phone.number);
                if (index == -1) {
                    let contact = null;
                    if (mp.players.at(i).phone.PhoneContacts != null) contact = mp.players.at(i).phone.PhoneContacts.find( x => x.number == player.phone.number);
                    let newDialog = db.Models.PhoneDialog.build({phoneId: mp.players.at(i).phone.id, name: contact != null ? contact.name : null, number: player.phone.number, PhoneMessages: [
                        {isMine: false, text: message, isRead: false, date: Date.now()}
                    ]}, { include: [db.Models.PhoneMessage]});
                    let result = await newDialog.save();
                    mp.players.at(i).phone.PhoneDialogs.push(result);
                }
                else {
                    let newMessage = db.Models.PhoneMessage.build({phoneDialogId: mp.players.at(i).phone.PhoneDialogs[index].id, isMine: true, text: message, isRead: true, date: Date.now()});
                    let result = await newMessage.save();
                    mp.players.at(i).phone.PhoneDialogs[index].PhoneMessages.push(result);
                }
                return mp.players.at(i).call('phone.message.set', [message, player.phone.number]);
            }
        }
        console.log("not found");
    },
    'addContact.server': async (player, name, number) => {
        let newContact = db.Models.PhoneContact.build({phoneId: player.phone.id, name: name, number: number});
        let result = await newContact.save();
        player.phone.PhoneContacts.push(result);
    },
    'renameContact.server': async (player, number, name) => {
        let index = player.phone.PhoneContacts.findIndex( x => x.number === number);
        if (index == -1) return console.log("error");
        await player.phone.PhoneContacts[index].update({name: name});
    },
    'removeContact.server': async (player, number) => {
        let index = player.phone.PhoneContacts.findIndex( x => x.number === number);
        if (index == -1) return console.log("error");
        await player.phone.PhoneContacts[index].destroy();
        player.phone.PhoneContacts.splice(index, 1);
    },
};