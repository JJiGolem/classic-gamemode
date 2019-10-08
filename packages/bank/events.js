"use strict";

let bank = require('./index.js');
let bizService;
let houseService;

module.exports = {
    "init": () => {
        bizService = call("bizes");
        houseService = call("houses");
    },
    "bank.show": (player) => {
        if (player == null || player.character == null) return;
        let bankInfo = {
            name: player.character.name,
            cash: player.character.cash,	// Количество наличных денег
            money: player.character.bank,	// Количество денег на счете
            number: "41234",	// Номер счета
            biz: [],
            houses: []
        }
        let biz = bizService.getBizByCharId(player.character.id);
        if (biz != null) {
            bankInfo.biz.push(bizService.getBizInfoForBank(biz));
        }
        let house = houseService.getHouseByCharId(player.character.id);
        if (house != null) {
            bankInfo.houses.push(houseService.getHouseInfoForBank(house));
        }
        player.call("bank.show", [bankInfo]);
    },
    "bank.push": (number) => {

    },
    "bank.pop": (number) => {

    },
    "bank.transfer": (number, accountNumber) => {

    },
    "bank.phone.push": (number) => {

    },
    "bank.biz.push": (id, daysNumber) => {

    },
    "bank.house.push": (id, daysNumber) => {

    },
    "bank.biz.cashbox.push": (id, number) => {

    },
    "bank.biz.cashbox.pop": (id, number) => {

    }
}
