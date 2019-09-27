"use strict";

let phoneNumbers = new Array();
let utils;
let houseServise;
let bizService;

module.exports = {
    async init() {
        utils = call('utils');
        houseServise = call('houses');
        bizService = call("bizes");

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

        let houses = [];
        if (houseServise) {
            let house = houseServise.getHouseByCharId(player.character.id);
            houses = house != null ? [houseServise.getHouseInfoForApp(house)] : [];
        }

        let bizes = [];
        if (bizService) {
            let biz = bizService.getBizByCharId(player.character.id);
            if (biz != null) {
                let bizInfo = bizService.getBizInfoForApp(biz);
                bizes = bizInfo != null ? [bizInfo] : [];
            }
        }

        let apps = [];
        if (player.character.job == 2) {
            apps.push("taxi");
        }

        player.call('phone.load', [{
                isHave: player.phone != null,
                houses: houses,
                biz: bizes,
                contacts: player.phone != null ? (player.phone.PhoneContacts != null ? jsonPhone['PhoneContacts'] : []) : []
            },
            player.phone != null ? (player.phone.PhoneDialogs != null ? jsonPhone['PhoneDialogs'] : []) : [],
            apps
        ]);
    },
    isExists(number) {
        return phoneNumbers.includes(number);
    },
    async changeNumber(player, newNumber) {
        if (player.phone == null) return false;
        if (phoneNumbers.includes(newNumber)) return false;
        let numberIndex = phoneNumbers.findIndex( x => x == player.phone.number);
        if (numberIndex != -1) {
            phoneNumbers[numberIndex] = newNumber;
        } 
        else {
            phoneNumbers.push(newNumber);
        }
        player.phone.number = newNumber;
        await player.phone.save();
        return true;
    }
};