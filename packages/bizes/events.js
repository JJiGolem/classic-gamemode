"use strict";

let factions;
let prompt;
let money;
let notifications;

let bizService = require('./index.js');
module.exports = {
    "init": () => {
        factions = call("factions");
        prompt = call("prompt");
        money = call("money");
        notifications = call('notifications');
        bizService.init();
    },
    "player.joined": (player) => {
        player.biz = {
            at: null,
            buyerIndex: null,
            sellerIndex: null,
            sellingBizId: null,
            sellingBizCost: null
        };
    },
    "player.name.changed": (player) => {
        let biz = bizService.getBizByCharId(player.character.id);
        if(biz != null) {
            biz.info.characterNick = player.character.name;
        }
    },
    "playerEnterColshape": (player, shape) => {
        if (!shape.isBiz) return;
        if (prompt != null) prompt.showByName(player, "biz_info_ask");
        player.biz.at = shape.bizId;
    },
    "playerExitColshape": (player, shape) => {
        if (!shape.isBiz) return;
        player.call('biz.menu.close',[true]);
        if (prompt != null) prompt.hide(player);
        player.biz.at = null;
    },
    "biz.menu.open": (player) => {
        if (player.biz.at == null) return;
        let biz = bizService.getBizById(player.biz.at);
        if (biz == null) return;
        let info = biz.info;
        if (prompt != null) prompt.hide(player);
        let actions = [];
        if (info.characterId == null) {
            player.call("biz.menu.open", [{
                name: info.name,
                faction: info.factionId != null ? factions && factions.getFaction(info.factionId).name : "",
                type: bizService.getTypeName(info.type),
                rent: info.price * bizService.bizesModules[info.type].rentPerDayMultiplier,
                price: info.price,
                actions: actions,
                pos: [info.x, info.y, info.z]
            }]);
        }
        else {
            if (player.character.id == info.characterId) actions.push('finance');
            player.call("biz.menu.open", [{
                name: info.name,
                faction: info.factionId != null ? factions && factions.getFaction(info.factionId).name : "",
                type: bizService.getTypeName(info.type),
                rent: info.price * bizService.bizesModules[info.type].rentPerDayMultiplier,
                owner: info.characterNick,
                actions: actions,
                pos: [info.x, info.y, info.z]
            }]);
        }
    },
    "biz.buy": (player) => {
        if (money == null) return player.call('biz.buy.ans', [0, ""]);
        if (player.biz.at == null) return player.call('biz.buy.ans', [0, ""]);
        let biz = bizService.getBizById(player.biz.at);
        if (biz == null) return;
        let info = biz.info;
        if (info.characterId != null) return player.call('biz.buy.ans', [0, ""]);
        if (player.dist(new mp.Vector3(info.x, info.y, info.z)) > 10) return player.call('biz.buy.ans', [0, ""]);
        if (player.character.cash < info.price) return player.call('biz.buy.ans', [0, ""]);
        if (bizService.isHaveBiz(player.character.id)) return player.call('biz.buy.ans', [2, ""]);

        money.removeCash(player, info.price, async function(result) {
            if (!result) return player.call('biz.buy.ans', [0, ""]);
            info.characterId = player.character.id;
            info.characterNick = player.character.name;
            info.date = bizService.getRandomDate(1);
            await info.save();

            let actions = [];
            if (player.character.id == info.characterId) actions.push('finance');
            player.call('biz.buy.ans', [1, player.character.name, actions]);

            bizService.setTimer(biz);
            mp.events.call('player.biz.changed', player);

            let bizInfo = bizService.getBizInfoForApp(biz);
            bizInfo != null && player.call('phone.app.add', ["biz", bizInfo]);
        }, `Покупка бизнеса #${info.id} у государства`);
    },
    "biz.sell.toGov": (player, id) => {
        if (money == null) return player.call('biz.sell.toGov.ans', [0]);
        if (player == null) return;
        id = parseInt(id);
        if (isNaN(id)) return player.call('biz.sell.toGov.ans', [0]);
        let biz = bizService.getBizById(id);
        if (biz == null) return player.call('biz.sell.toGov.ans', [0]);
        let info = biz.info;
        if (player.dist(new mp.Vector3(info.x, info.y, info.z)) > 10) return player.call('biz.sell.toGov.ans', [3]);
        if (info.characterId != player.character.id) return player.call('biz.sell.toGov.ans', [0]);
        bizService.dropBiz(biz, true);
    },
    "biz.sell.check": (player, idOrNick) => {
        let id = parseInt(idOrNick);
        if (isNaN(id)) {
            if (player.character.name == idOrNick) return player.call("biz.sell.check.ans", [null]);
            for (let i = 0; i < mp.players.length; i++) {
                if (mp.players.at(i) == null) continue;
                if (mp.players.at(i).character == null) continue;
                if (mp.players.at(i).character.name == idOrNick) {
                    if (player.id == i) return player.call("biz.sell.check.ans", [null]);
                    player.call("biz.sell.check.ans", [character.name]);
                    player.biz.buyerIndex = i;
                    return;
                }
            }
            player.call("biz.sell.check.ans", [null]);
        }
        else {
            if (id > 1000000) return player.call("biz.sell.check.ans", [null]);
            if (player.id == id) return player.call("biz.sell.check.ans", [null]);
            if (mp.players.at(id).character != null) {
                player.biz.buyerIndex = id;
                player.call("biz.sell.check.ans", [mp.players.at(id).character.name]);
            }
            else {
                player.call("biz.sell.check.ans", [null]);
            }
        }
    },
    "biz.sell": (player, bizId, cost) => {
        if (player.biz.buyerIndex == null) return player.call("biz.sell.ans", [0]);
        if (mp.players.at(player.biz.buyerIndex) == null) return player.call("biz.sell.ans", [0]);
        if (vehicles == null) return player.call('biz.sell.ans', [0]);
        bizId = parseInt(bizId);
        cost = parseInt(cost);
        if (isNaN(bizId) || isNaN(cost)) return player.call("biz.sell.ans", [0]);
        if (mp.players.at(player.biz.buyerIndex).character.cash < cost) return player.call("biz.sell.ans", [2]);
        if (bizService.isHaveBiz(mp.players.at(player.biz.buyerIndex).character.id)) return player.call("biz.sell.ans", [2]);
        let biz = bizService.getBizById(bizId);
        if (biz == null) return player.call("biz.sell.ans", [0]);
        let info = biz.info;
        if (player.dist(new mp.Vector3(info.pickupX, info.pickupY, info.pickupZ)) > 10 || 
            mp.players.at(player.biz.buyerIndex).dist(new mp.Vector3(info.pickupX, info.pickupY, info.pickupZ)) > 10) return player.call("biz.sell.ans", [3]);
        if (cost < info.price || cost > 1000000000) return player.call("biz.sell.ans", [4]);
        mp.players.at(player.biz.buyerIndex).biz.sellerIndex = player.id;
        player.biz.sellingBizId = info.id;
        player.biz.sellingBizCost = cost;
        mp.players.at(player.biz.buyerIndex).call('offerDialog.show', ["biz_sell", {
            name: player.character.name,
            price: cost
        }]);
    },
    "biz.sell.ans": (player, result) => {
        if (player.biz.sellerIndex == null) return;
        if (mp.players.at(player.biz.sellerIndex) == null) return;
        if (mp.players.at(player.biz.sellerIndex).biz == null) return;
        if (mp.players.at(player.biz.sellerIndex).biz.buyerIndex == null) return;
        let biz = bizService.getBizById(mp.players.at(player.biz.sellerIndex).biz.sellingBizId);
        if (biz == null) return mp.players.at(player.biz.sellerIndex).call("biz.sell.ans", [0]);
        let info = biz.info;
        if (info.characterId != mp.players.at(player.biz.sellerIndex).character.id) return mp.players.at(player.biz.sellerIndex).call("biz.sell.ans", [0]);
        if (player.dist(new mp.Vector3(info.pickupX, info.pickupY, info.pickupZ)) > 10 || 
            mp.players.at(player.biz.sellerIndex).dist(new mp.Vector3(info.pickupX, info.pickupY, info.pickupZ)) > 10) return mp.players.at(player.biz.sellerIndex).call("biz.sell.ans", [3]);
        if (player.character.cash < info.price) return mp.players.at(player.biz.sellerIndex).call("biz.sell.ans", [2]);
        if (bizService.isHaveBiz(player.character.id)) return mp.players.at(player.biz.sellerIndex).call("biz.sell.ans", [2]);
        if (result == 2) return  mp.players.at(player.biz.sellerIndex).call("biz.sell.ans", [2]);

        bizService.sellBiz(biz, mp.players.at(player.biz.sellerIndex).biz.sellingBizCost,
            mp.players.at(player.biz.sellerIndex), player, function(ans) {
                if (ans) {
                    mp.players.at(player.biz.sellerIndex).call("biz.sell.ans", [1]);
                }
                else {
                    mp.players.at(player.biz.sellerIndex).call("biz.sell.ans", [0]);
                }
            });
        mp.players.at(player.biz.sellerIndex).biz.buyerIndex = null;
        mp.players.at(player.biz.sellerIndex).biz.sellingBizId = null;
        mp.players.at(player.biz.sellerIndex).biz.sellingBizCost = null;
        player.biz.sellerIndex = null;
    },
    "biz.sell.stop": (player) => {
        if (player.biz.buyerIndex != null) {
            mp.players.at(player.biz.buyerIndex).call("offerDialog.hide");
            mp.players.at(player.biz.buyerIndex).biz.sellerIndex = null;
        }
        player.biz.buyerIndex = null;
        player.biz.sellingBizId = null;
        player.biz.sellingBizCost = null;
    },
    "biz.order.add": async (player, id, productCount, productPrice) => {
        productCount = parseInt(productCount);
        productPrice = parseFloat(productPrice);
        if (isNaN(productCount) || isNaN(productPrice)) return player.call("biz.order.ans", [0]);
        let biz = bizService.getBizById(id);
        if (biz.info.characterId != player.character.id) return player.call("biz.order.ans", [0]);
        if (biz.info.cashBox < parseInt(productPrice * productCount)) return player.call("biz.order.ans", [2]);
        player.call("biz.order.ans", [await bizService.createOrder(biz, productCount, productPrice)]);
    },
    "biz.order.cancel": async (player, id) => {
        id = parseInt(id);
        await bizService.destroyOrder(id);
    },
    "biz.actions": (player, action) => {
        switch(action) {
            case 'finance':
                if (player.biz.at == null) return notifications != null && notifications.error(player, "Вы находитесь не рядом с бизнесом", "Ошибка");
                let bizParameters = bizService.getBizParameters(player.character.id, player.biz.at);
                if (bizParameters == null) return notifications != null && notifications.error(player, "Экономические параметры бизнеса недоступны", "Ошибка");
                player.call("biz.finance.show", [bizParameters]);
                break;
        }
    },
    "biz.finance.save": (player, bizParameters) => {
        if (player.biz.at == null) return notifications != null && notifications.error(player, "Вы находитесь не рядом с бизнесом", "Ошибка");
        if (bizService.setBizParameters(player.character.id, JSON.parse(bizParameters))) {
            notifications != null && notifications.success(player, "Экономические параметры успешно изменены", "Успешно");
        }
        else {
            notifications != null && notifications.error(player, "Экономические параметры бизнеса недоступны", "Ошибка");
        }
    },
}