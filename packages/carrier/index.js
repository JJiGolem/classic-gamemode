"use strict";

let bizes = call('bizes');
let farms = call('farms');
let jobs = call('jobs');
let notifs = call('notifications');
let utils = call('utils');

module.exports = {
    // Место мониторинга складов бизнесов/ферм и заказа товара
    loadPos: new mp.Vector3(925.46, -1563.99, 30.83 - 1),
    // Цена за 1 ед. товара/зерна
    productPrice: 4,
    // Вместимость грузовика
    productsMax: 500,
    // Доп. вместимость грузовика за 1% навыка
    skillProducts: 15,
    // Коэффициент при списании товара назад на склад (productPrice * productSellK)
    productSellK: 0.8,
    // Цена аренды грузовика
    vehPrice: 100,
    // Опыт за доставку товара
    exp: 0.05,
    // Заказы бизнесов
    bizOrders: [],

    init() {
        this.createLoadMarker();
    },
    createLoadMarker() {
        var pos = this.loadPos;
        var marker = mp.markers.new(1, pos, 3, {
            color: [255, 187, 0, 70]
        });
        var colshape = mp.colshapes.newSphere(pos.x, pos.y, pos.z + 2, 2);
        colshape.onEnter = (player) => {
            if (player.character.job != 4) return notifs.error(player, `Отказано в доступе`, `Склад`);
            player.call(`carrier.load.info.set`, [this.getLoadData()]);
            player.carrierLoad = marker;
        };
        colshape.onExit = (player) => {
            player.call(`selectMenu.hide`);
            delete player.carrierLoad;
        };
        marker.colshape = colshape;
        mp.blips.new(318, pos, {
            color: 71,
            name: `Грузоперевозка`,
            shortRange: 10,
            scale: 1
        });
    },
    getLoadData() {
        var data = {
            farms: [],
            bizOrders: this.bizOrders,
            productPrice: this.productPrice,
            productSellK: this.productSellK,
        };
        farms.farms.forEach(farm => {
            data.farms.push({
                grains: farm.grains,
                grainsMax: farms.grainsMax,
                grainPrice: farm.grainPrice,
                soils: farm.soils,
                soilsMax: farms.soilsMax,
                soilPrice: farm.soilPrice,
            });
        });
        return data;
    },
    getProductsMax(player) {
        var skill = jobs.getJobSkill(player, 4);
        return parseInt(this.productsMax + skill.exp * this.skillProducts);
    },
    initBizOrders() {
        var list = bizes.getOrderBizes();
        list.forEach(biz => this.addBizOrder(biz));
    },
    getBizOrder(bizId) {
        return this.bizOrders.find(x => x.bizId == bizId);
    },
    addBizOrder(biz) {
        var vdistance = utils.vdist(this.loadPos, new mp.Vector3(biz.info.x, biz.info.y, biz.info.z));
        var order = {
            bizId: biz.info.id,
            bizName: biz.info.name,
            ownerName: biz.info.characterNick,
            prodName: bizes.getTypeName(biz.info.type),
            prodCount: biz.info.productsOrder,
            prodPrice: this.productPrice,
            orderPrice: biz.info.productsOrderPrice,
            distance: +Math.sqrt(vdistance).toFixed(1),
        };
        this.removeBizOrder(order.bizId);
        this.jobBroadcast(`Поступил заказ для бизнеса ${order.bizName}`);
        this.bizOrders.push(order);
    },
    removeBizOrder(bizId) {
        var list = this.bizOrders;
        for (var i = 0; i < list.length; i++) {
            var order = list[i];
            if (order.bizId != bizId) continue;
            list.splice(i, 1);
            i--;
        }
        // TODO: broadcast all carriers
    },
    takeBizOrder(player, veh, order) {
        if (typeof order == 'number') order = this.getBizOrder(order);

        var pos = bizes.getBizPosition(order.bizId);

        veh.products = {
            bizOrder: order
        };
        veh.setVariable("label", `${order.prodCount} из ${this.getProductsMax(player)} ед.`);

        this.removeBizOrder(order.bizId);
        player.call("waypoint.set", [pos.x, pos.y]);
        notifs.success(player, `Заказ принят`, order.bizName);
        this.jobBroadcast(`Взят заказ для бизнеса ${order.bizName}`);
        bizes.getOrder(order.bizId);
    },
    jobBroadcast(text) {
        mp.players.forEach(rec => {
            if (!rec.character || rec.character.job != 4) return;

            notifs.info(rec, text, `Грузоперевозчики`);
        });
    },
};
