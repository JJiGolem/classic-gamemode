"use strict";
/// Модуль телефона
let phone = require("./index.js");




module.exports = {
    /// Событие инициализации сервера
    "init": () => {
        phone.init();
        inited(__dirname);
    },
    'player.joined': player => {
        player.isTalking = false;
    },
    'playerQuit': player => {

    },
    /// Загрузка телефона после выбора персоонажа
    'characterInit.done': async (player) => {
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
        mp.events.call(`phoneInit.done`, player);
    },
    /// Покупка телефона
    "phone.buy": async (player) => {
        if (player.phone != null) return;
        let number = phone.generateNumber();
        if (!number) return;
        player.phone = {
            characterId: player.character.id,
            number: number,
            PhoneContacts: [],
            PhoneDialogs: []
        };
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
    /// Начало звонка игроку
    'phone.call.ask': (player, number) => {
        if (player.phone == null) return;
        if (player.isTalking) return player.call('phone.call.start.ans', [2]);
        if (!phone.isExists(number)) return player.call('phone.call.start.ans', [1]);

        let calledPlayer = mp.players.toArray().find(x => x.phone != null && x.phone.number == number);
        if (calledPlayer != null) {
            if (calledPlayer.isTalking) {
                player.call('phone.call.start.ans', [2]);
            }
            else {
                player.isTalking = true;
                calledPlayer.call('phone.call.in', [player.phone.number, player.id]);
            }

        }
        else {
            player.call('phone.call.start.ans', [4]);
        }
    },
    /// Ответ на начало звонка игроку
    'phone.call.ans': (player, ans, callerId) => {
        if (callerId == -1) return;
        if (ans == 1) {
            if (mp.players.at(callerId).phone == null) {
                if (player.phone != null) {
                    player.call('endCallAns.client', []);
                }
            }
            else {
                if (player.phone != null) {
                    player.isTalking = true;
                    mp.players.at(callerId).call('phone.call.start.ans', [0, player.id]);
                    return;
                }
                else {
                    mp.players.at(callerId).call('phone.call.start.ans', [4]);
                }
            }
        }
        else {
            if (mp.players.at(callerId).phone != null) {
                mp.players.at(callerId).isTalking = false;
                mp.players.at(callerId).call('phone.call.start.ans', [3]);
            }
        }
    },
    /// Окончание звонка с игроком
    'phone.call.end': (player, callerId) => {
        player.isTalking = false;
        if (callerId != -1) {
            if (mp.players.at(callerId) != null) {
                if (mp.players.at(callerId).phone != null) {
                    mp.players.at(callerId).isTalking = false;
                    mp.players.at(callerId).call('phone.call.end.in', []);
                }
            }
        }
    },
    /// Отправка сообщения игроку данным номером
    'phone.message.send': async (player, message, number) => {
        if (player.phone == null) return;
        if (message.length > 100) return;
        if (!phone.isExists(number)) return player.call('phone.error', [1]);

        /// Работа с отправителем
        let index = player.phone.PhoneDialogs.findIndex( x => x.number == number);
        if (index == -1) {
            let newDialog = db.Models.PhoneDialog.build({phoneId: player.phone.id, number: number, PhoneMessages: [
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
        let getterPlayer = mp.players.toArray().find(x => x.id != player.id && x.phone != null && x.phone.number == number);
        if (getterPlayer != null) {
            index = getterPlayer.phone.PhoneDialogs.findIndex( x => x.number == player.phone.number);
            if (index == -1) {
                let newDialog = db.Models.PhoneDialog.build({phoneId: getterPlayer.phone.id, number: player.phone.number, PhoneMessages: [
                    {isMine: false, text: message, isRead: false, date: Date.now()}
                ]}, { include: [db.Models.PhoneMessage]});
                let result = await newDialog.save();
                getterPlayer.phone.PhoneDialogs.push(result);
            }
            else {
                let newMessage = db.Models.PhoneMessage.build({phoneDialogId: getterPlayer.phone.PhoneDialogs[index].id, isMine: false, text: message, isRead: false, date: Date.now()});
                let result = await newMessage.save();
                getterPlayer.phone.PhoneDialogs[index].PhoneMessages.push(result);
            }
            getterPlayer.call('phone.message.set', [message, player.phone.number]);
        }
        else {
            player.call('phone.error', [2]);
        }
    },
    'phone.dialog.read': async (player, dialogNumber) => {
        if (player == null) return;
        if (player.phone == null) return;
        if (player.phone.PhoneDialogs == null) return;
        let index = player.phone.PhoneDialogs.findIndex( x => x.number == dialogNumber);
        if (index == -1) return;
        if (player.phone.PhoneDialogs[index].PhoneMessages == null) return;

        let isChanged = false;
        for (let i = 0; i < player.phone.PhoneDialogs[index].PhoneMessages.length; i++) {
            if (player.phone.PhoneDialogs[index].PhoneMessages[i].isRead) continue;
            player.phone.PhoneDialogs[index].PhoneMessages[i].set("isRead", true);
            isChanged = true;
        }
        if (!isChanged) return;
        await db.Models.PhoneMessage.update({
                isRead: true
            },
            {
                where: {
                    phoneDialogId: player.phone.PhoneDialogs[index].id
                }
            }
        );
    },
    'phone.contact.add': async (player, name, number) => {
        if (player.phone.PhoneContacts.findIndex( x => x.name === name) != -1) return player.call('phone.error', [3]);
        let newContact = db.Models.PhoneContact.build({phoneId: player.phone.id, name: name, number: number});
        let result = await newContact.save();
        player.phone.PhoneContacts.push(result);
    },
    'phone.contact.rename': async (player, number, name) => {
        if (player.phone.PhoneContacts.findIndex( x => x.name === name) != -1) return player.call('phone.error', [3]);
        let index = player.phone.PhoneContacts.findIndex( x => x.number === number);
        if (index == -1) return player.call('phone.error', [4]);
        await player.phone.PhoneContacts[index].update({name: name});
    },
    'phone.contact.remove': async (player, number) => {
        let index = player.phone.PhoneContacts.findIndex( x => x.number === number);
        if (index == -1) return player.call('phone.error', [4]);
        await player.phone.PhoneContacts[index].destroy();
        player.phone.PhoneContacts.splice(index, 1);
    },
};
