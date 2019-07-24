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
    'sendMessage.server': (player, message, number) => {
        if (player.info.inventory.phone.number == number) {
            player.info.inventory.phone.newMessage(number, message, true);
        }
        else {
            for (let i = 0; i < mp.players.length; i++) {
                if (player.id == i) continue;
                if (mp.players.at(i).info.inventory.phone.number == number) {
                    console.log("Message" + message);
                    mp.players.at(i).info.inventory.phone.newMessage(player.info.inventory.phone.number, message, false);
                    mp.players.at(i).call('setMessage.client', [message, player.info.inventory.phone.number]);
                }
            }
        }
    },
    'addContact.server': (player, name, number) => {
        player.info.inventory.phone.addContact(name, number);
    },
    'removeContact.server': (player, number) => {
        player.info.inventory.phone.removeContact(number);
    },
    'renameContact.server': (player, number, name) => {
        player.info.inventory.phone.renameContact(player.info.inventory.phone.findContact(number), name, number);
    },
};