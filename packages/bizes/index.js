"use strict";

let fs = require('fs');

let bizes = new Array();
let bizesModules = new Array();

/// biz types
/// 0 - АЗС
/// 1 - Супермаркет
/// 2 - 
/// 3 - СТО
/// 4 - Магазин одежды
/// 5 - Магазин оружия
/// 6 - Парикмахерская
/// 7 - Магазин масок


let utils;
let timer;
let money;

/// Economic constants
let maxProductPriceMultiplier = 2.0;
let minProductPriceMultiplier = 1.2;


let getBizById = function(id) {
    return bizes.find(x => x.info.id == id);
};
let getBizByCharId = function(characterId) {
    return bizes.find(x => x.info.characterId == characterId);
};
let dropBiz = function(biz, sellToGov = false) {
    if (biz == null) return;
    if (biz.info.characterId == null) return;
    let characterId = biz.info.characterId;
    biz.info.characterId = null;
    biz.info.characterNick = null;
    biz.info.date = null;
    biz.info.save().then(() => {
        if (money == null) return console.log("[bizes] Biz dropped " + biz.info.id + ". But player didn't getmoney");
        money.addMoneyById(characterId, biz.info.price * 0.6, function(result) {
            if (result) {
                console.log("[bizes] Biz dropped " + biz.info.id);
                for (let j = 0; j < mp.players.length; j++) {
                    if (mp.players.at(j).character == null) continue;
                    if (characterId == mp.players.at(j).character.id) {
                        mp.events.call('player.biz.changed', mp.players.at(j));
                        if (sellToGov) {
                            mp.players.at(j).call('biz.sell.toGov.ans', [1]);
                        } else {
                            mp.players.at(j).call('phone.app.remove', ["biz", biz.info.id]);
                        }
                        return;
                    }
                }
            } else {
                console.log("[bizes] Biz dropped " + biz.info.id + ". But player didn't getmoney");
            }
        });
    });
};
let setTimer = function(biz) {
    if (biz == null) return;
    if (biz.info.characterId == null) return;
    if (biz.info.date == null) return dropBiz(id);
    if (biz.info.date.getTime() - new Date().getTime() <= 10000) return dropBiz(biz);
    biz.timer != null && timer.remove(biz.timer);
    biz.timer = timer.add(async function() {
        dropBiz(biz);
    }, biz.info.date.getTime() - new Date().getTime());
};
let getRandomDate = function(daysNumber) {
    let date = new Date();
    date.setTime(Date.now() - (date.getHours() * 1000 * 3600) + (daysNumber * 1000 * 3600 * 24) + (utils.randomInteger(0, 23) * 1000 * 3600));
    return date;
};
let getBizInfoForApp = function(biz) {
    if (biz == null) return null;
    if (bizesModules[biz.info.type] == null) return null;
    return {
        id: biz.info.id,
        name: biz.info.name,
        type: getTypeName(biz.info.type),
        cashBox: biz.info.cashBox,
        pos: [biz.info.x, biz.info.y, biz.info.z],
        days: parseInt((biz.info.date - Date.now()) / (24 * 3600 * 1000)),
        rent: biz.info.price * bizesModules[biz.info.type].rentPerDayMultiplier,
        resourcesMax: biz.info.productsMaxCount,
        resources: biz.info.productsCount,
        price: biz.info.price,
        statistics: biz.info.BizStatistics,
        order: null,
        resourcePriceMin: bizesModules[biz.info.type].productPrice * bizesModules[biz.info.type].minProductPriceMultiplier == null ? minProductPriceMultiplier : bizesModules[biz.info.type].minProductPriceMultiplier,
        resourcePriceMax: bizesModules[biz.info.type].productPrice * bizesModules[biz.info.type].maxProductPriceMultiplier == null ? maxProductPriceMultiplier : bizesModules[biz.info.type].maxProductPriceMultiplier
    };
};
let getResourceName = function(type) {
    return bizesModules[type].business.productName;
};
let getTypeName = function(type) {
    return bizesModules[type].business.name;
};
let bizUpdateCashBox = async function(id, money) {
    let biz = getBizById(id);
    if (biz == null) return;
    biz.info.cashBox += money;
    let currentDay = biz.info.BizStatistics.find(x => x.date.toLocaleDateString() == new Date().toLocaleDateString());
    if (currentDay == null) {
        currentDay = {
            bizId: biz.info.id,
            date: new Date(),
            money: money
        }
        currentDay = await db.Models.BizStatistics.create(currentDay);
        biz.info.BizStatistics.unshift(currentDay);
    } else {
        currentDay.money += money;
        currentDay.save();
    }
    biz.info.save();
};
let addProducts = async function(id, count) {
    let biz = getBizById(id);
    if (biz == null) return false;
    biz.info.productsCount += count;
    if (biz.info.productsCount > biz.info.productsMaxCount) biz.info.productsCount = biz.info.productsMaxCount;
    await biz.info.save();
    return true;
};
let removeProducts = async function(id, count) {
    let biz = getBizById(id);
    if (biz == null) return false;
    if (biz.info.productsCount < count) return false;
    biz.info.productsCount -= count;
    await biz.info.save();
    return true;
};
let createOrder = async function(id, count, price) {
    let biz = getBizById(id);
    if (biz == null) return false;
    if (biz.info.productsCount + count > biz.info.productsMaxCount) return false;
    bizesModules
    //if (price > ) проверка в модуле экономики. Входит ли цена за 1 продукт в разрешенный диапазон
    biz.info.productsOrder = count;
    biz.info.productsOrderPrice = price;
    await biz.info.save();
    return true;
}
let destroyOrder = async function(id) {
    let biz = getBizById(id);
    if (biz == null) return false;
    // if проверка взял ли дальнобой заказ
    biz.info.productsOrder = null;
    biz.info.productsOrderPrice = null;
    await biz.info.save();
    return true;
}


module.exports = {
    maxProductPriceMultiplier: maxProductPriceMultiplier,
    minProductPriceMultiplier: minProductPriceMultiplier,

    async init() {
        utils = call("utils");
        timer = call("timer");
        money = call("money");

        for (let file of fs.readdirSync(path.dirname(__dirname))) {
            if (file != 'base' && !ignoreModules.includes(file) && fs.existsSync(path.dirname(__dirname) + "/" + file + '/index.js'))
            {
                let objects = require('../' + file + '/index');
                if (objects.business != null && objects.business.type != null && objects.business.name != null && objects.business.productName != null && objects.rentPerDayMultiplier != null && objects.productPrice != null) {
                    bizesModules[objects.business.type] = call(file);
                }
            }
        }

        console.log("[BIZES] load bizes from DB");
        let bizesInfo = await db.Models.Biz.findAll({
            include: [db.Models.BizStatistics]
        });
        let loadedCount = 0;
        for (let i = 0; i < bizesInfo.length; i++) {
            if (!bizesModules[bizesInfo[i].type]) continue;
            let biz = await this.addBiz(bizesInfo[i]);
            setTimer(biz);
            loadedCount++;
        }
        console.log("[BIZES] " + loadedCount + " bizes loaded");
    },
    async createBiz(name, price, type, position) {
        let biz = await db.Models.Biz.create({
            name: name,
            price: price,
            type: type,
            cashBox: 0,
            productsCount: 0,
            productsMaxCount: 100,
            x: position.x,
            y: position.y,
            z: position.z
        }, {});
        biz = await db.Models.Biz.findAll({
            where: {
                id: biz.id
            },
            include: [db.Models.BizStatistics]
        });
        biz = await this.addBiz(biz);
        setTimer(biz);
        console.log("[BIZES] added new biz");
    },
    isHaveBiz(characterId) {
        return bizes.findIndex(x => x.info.characterId == characterId) != -1;
    },
    async addBiz(bizInfo) {
        let colshape = mp.colshapes.newSphere(bizInfo.x, bizInfo.y, bizInfo.z, 4.0);
        colshape.isBiz = true;
        colshape.bizId = bizInfo.id;
        bizInfo.BizStatistics = bizInfo.BizStatistics.sort((x, y) => {
            if (x.date.getTime() < y.date.getTime()) {
                return 1;
            }
            if (x.date.getTime() > y.date.getTime()) {
                return -1;
            }
            return 0;
        });
        bizes.push({
            colshape: colshape,
            info: bizInfo
        });
        if (bizInfo.BizStatistics.length != 0) {
            if (bizInfo.BizStatistics[0].date.toLocaleDateString() != new Date().toLocaleDateString()) {
                await bizUpdateCashBox(bizInfo.id, 0);
            }
        } else {
            await bizUpdateCashBox(bizInfo.id, 0);
        }
        return bizes[bizes.length - 1];
    },
    sellBiz(biz, cost, seller, buyer, callback) {
        biz.info.characterId = buyer.character.id;
        biz.info.characterNick = buyer.character.name;
        biz.info.date = getRandomDate(1);
        setTimer(biz);
        biz.info.save().then(() => {
            if (money == null) return;
            money.moveCash(buyer, seller, cost, function(result) {
                if (result) {
                    callback(true);
                    mp.events.call('player.biz.changed', seller);
                    mp.events.call('player.biz.changed', buyer);
                    let bizInfo = getBizInfoForApp(biz);
                    bizInfo != null && buyer.call('phone.app.add', ["biz", bizInfo]);
                } else {
                    callback(false);
                }
            });
        });
    },
    getBizById: getBizById,
    getBizByCharId: getBizByCharId,
    getTypeName: getTypeName,
    getResourceName: getResourceName,
    getRandomDate: getRandomDate,
    getBizInfoForApp: getBizInfoForApp,
    getBizesFactionIds() {
        return bizes.map((elem) => elem.info.factionId);
    },
    getFactionId(bizId) {
        return getBizById(bizId).info.factionId;
    },
    setFactionId(bizId, factionId) {
        let biz = getBizById(bizId)
        if (biz == null) return;
        biz.info.factionId = factionId;
        biz.info.save();
    },
    getBizesCount() {
        return bizes.length;
    },
    getBizesByFactionId(factionId) {
        return bizes.filter(x => x.info.factionId == factionId);
    },
    getBizesForBizWar(factionId) {
        return bizes.filter(x => x.info.factionId != factionId).map(x => {
            return {
                id: x.info.id,
                name: x.info.name,
                factionId: x.info.factionId,
            };
        });
    },
    getBizCount() {
        return bizes.length;
    },
    getNearBiz(player, range = 10) {
        var nearBiz;
        var minDist = 99999;
        bizes.forEach(biz => {
            var bizPos = new mp.Vector3(biz.info.x, biz.info.y, biz.info.z);
            var distance = player.dist(bizPos);
            if (distance < range && distance < minDist) {
                nearBiz = biz;
                minDist = distance;
            }
        });
        return nearBiz;
    },
    setTimer: setTimer,
    /// Функция пополняющая кассу биза
    /// После каждой покупки передавать в нее стоимость покупки и id бизнеса
    bizUpdateCashBox: bizUpdateCashBox,

    addProducts: addProducts,
    removeProducts: removeProducts,
    getProductsAmount(id) {
        let biz = getBizById(id);
        if (biz == null) return null;
        return biz.info.productsCount;
    },
    getBizPosition(id) {
        let biz = getBizById(id);
        if (biz == null) return null;
        return new mp.Vector3(biz.info.x, biz.info.y, biz.info.z);
    },

    createOrder: createOrder,
    destroyOrder: destroyOrder,
}
