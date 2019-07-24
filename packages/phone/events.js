"use strict";
/// Модуль телефона
let phone = require("./index.js");
let characterInit = call('characterInit');
let utils = call('utils');

let phoneNumbers = new Array();

module.exports = {
    "init": () => {
        if (!characterInit) return;
        characterInit.addLoadedInfo([{
            model: db.Models.Phone,
            include: [
                db.Models.PhoneContact, {
                    model: db.Models.PhoneDialog,
                    include: [db.Models.PhoneMessage]
                }
            ]
        }]);
    },
    /// Событие инициализации сервера
    "characterInit.create.init": (player) => {
        if (!utils || !characterInit) return;
        player.character.Phones = new Array();
        let newNumber = utils.randomInteger(1000000, 9999999);
        while (phoneNumbers.includes(newNumber)) {
            newNumber++;
            if (newNumber > 9999999) newNumber = 1000000;
        }
        phoneNumbers.push(newNumber);
        player.character.Phones.push({
            number: newNumber,
            PhoneContacts: [],
            PhoneDialogs: []
        });
    },
};