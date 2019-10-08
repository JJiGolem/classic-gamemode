"use strict";


module.exports = {
    getInfo(player) {
        if (player == null || player.character == null) return;
        let bankInfo = {
            name: player.character.name,
            cash: player.character.cash,
            money: player.character.bank,
            number: `${player.character.id}`,
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
}