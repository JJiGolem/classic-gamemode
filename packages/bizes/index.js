"use strict";


let bizes = new Array();
let bizInfos = new Array();

let utils;
let timer;
let money;

let getBizById = function(id) {
    return bizes.find(x => x.info.id == id);
};
let getBizByCharId = function(characterId) {
    return bizes.find( x => x.info.characterId == characterId);
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
                        if (sellToGov) {
                            mp.players.at(j).call('biz.sell.toGov.ans', [1]);
                        }
                        else {
                            mp.players.at(j).call('phone.app.remove', ["biz", biz.info.id]);
                        }
                        return;
                    }
                }
            }
            else {
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
    return {
        id: biz.info.id,
        name: biz.info.name,
        type: getTypeName(biz.info.type),
        cashBox: biz.info.cashBox,
        pos: [biz.info.x, biz.info.y, biz.info.z],
        days: parseInt((biz.info.date - Date.now()) / (24 * 3600 * 1000)),
        rent: biz.info.price * 0.01,
        resourcesMax: biz.info.productsMaxCount,
        resources: biz.info.productsCount,
        price: biz.info.price,
        statistics: [],
        order: null
    };
};
let getResourceName = function(type) {
    switch(type) {
        case 0: return "Топливо";
        case 1: return "Продукты";
        case 2: return "Авто";
        case 3: return "Запчасти";
        case 4: return "Одежда";
        case 5: return "Оружие и патроны";
        default: return null;
    }
};
let getTypeName = function(type, isTable = false) {
    /// Список с расшифровкой типов бизнесов
    if (!isTable) {
        switch(type) {
            case 0: return "АЗС";
            case 1: return "Супермаркет";
            case 2: return "Автосалон";
            case 3: return "СТО";
            case 4: return "Магазин одежды";
            case 5: return "Магазин оружия";
            default: return null;
        }
    }
    else {
        switch(type) {
            case 0: return "FuelStation";
            //case 1: return ""; //24/7
            //case 2: return "";    //CarShow
            case 3: return "CarService";
            //case 4: return "";   //Clothes
            //case 5: return "";   //Ammu-Nation
            default: return null;
        }
    }
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
    }
    else {
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
    async init() {
        utils = call("utils");
        timer = call("timer");
        money = call("money");

        console.log("[BIZES] load bizes from DB");
        let bizesInfo = await db.Models.Biz.findAll({
            include: [db.Models.BizStatistics]
        });
        for (let i = 0; i < bizesInfo.length; i++) {
            let biz = await this.addBiz(bizesInfo[i]);
            setTimer(biz);
        }
        bizInfos[0] = await db.Models.FuelStation.findAll();
        bizInfos[1] = [];
        bizInfos[2] = [];
        bizInfos[3] = await db.Models.CarService.findAll();
        bizInfos[4] = [];
        bizInfos[5] = [];
        console.log("[BIZES] " + bizesInfo.length + " bizes loaded");
    },
    async createBiz() {

    },
    isHaveBiz(characterId) {
        return bizes.findIndex( x => x.info.characterId == characterId) != -1;
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
            }
        );
        if (bizInfo.BizStatistics.length != 0) {
            if (bizInfo.BizStatistics[0].date.toLocaleDateString() != new Date().toLocaleDateString()) {
                await bizUpdateCashBox(bizInfo.id, 0);
            }
        }
        else {
            await bizUpdateCashBox(bizInfo.id, 0);
        }
        return bizes[bizes.length - 1];
    },
    sellBiz(biz, cost, seller, buyer, callback) {
        biz.info.characterId = buyer.character.id;
        biz.info.characterNick = buyer.character.name;
        biz.info.save().then(() => {
            if (money == null) return;
            money.moveCash(buyer, seller, cost, function(result) {
                if (result) {
                    callback(true);
                    buyer.call('phone.app.add', ["biz", getBizInfoForApp(biz)]);
                }
                else {
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
    setTimer: setTimer,
    /// Функция пополняющая кассу биза
    /// После каждой покупки передавать в нее стоимость покупки и id бизнеса
    bizUpdateCashBox: bizUpdateCashBox,

    addProducts: addProducts,
    removeProducts: removeProducts,

    createOrder: createOrder,
    destroyOrder: destroyOrder,
}
