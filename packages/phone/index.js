"use strict";

let phoneNumbers = new Array();
let utils = call('utils');

module.exports = {
    async init() {
        console.log("[PHONE] load numbers from DB...");
        let phoneNumbersTemp = await db.Models.Phone.findAll({
            attributes: ['number'],
            raw: true
        });
        for (let i = 0; i < phoneNumbersTemp.length; i++) {
            phoneNumbers.push(phoneNumbersTemp[i].number);
        }
        console.log("[PHONE] loaded.");
    },
    generateNumber() {
        if (!utils) return null;
        let newNumber = utils.randomInteger(1000000, 9999999);
        while (phoneNumbers.includes(newNumber + "")) {
            newNumber++;
            if (newNumber > 9999999) newNumber = 1000000;
        }
        phoneNumbers.push(newNumber + "");
        return newNumber + "";
    },
    loadPhoneOnClient(player) {
        let jsonPhone;
        if (player.phone != null) jsonPhone = player.phone.toJSON();
        player.call('phone.load', [{
                isHave: player.phone != null,
                name: player.character.name,
                houses: [],//housesInfo,
                biz: [],//bizInfo,
                contacts: player.phone != null ? (player.phone.PhoneContacts != null ? jsonPhone['PhoneContacts'] : []) : []
            },
            player.phone != null ? (player.phone.PhoneDialogs != null ? jsonPhone['PhoneDialogs'] : []) : []
        ]);
    },
    isExists(number) {
        return phoneNumbers.includes(number);
    }
};