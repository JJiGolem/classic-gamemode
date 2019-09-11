"use strict";

let farms = call('farms');

module.exports = {
    // Место мониторинга складов бизнесов/ферм и заказа товара
    loadPos: new mp.Vector3(925.46, -1563.99, 30.83 - 1),
    // Цена за 1 ед. товара/зерна
    productPrice: 4,
    // Цена за 1 ед. товара/зерна
    productPrice: 4,
    // Вместимость грузовика
    productsMax: 1000,
    // Коэффициент при списании товара назад на склад (productPrice * productSellK)
    productSellK: 0.8,

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
            player.call(`selectMenu.show`, [`carrierLoad`]);
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
            name: `Грузчики`,
            shortRange: 10,
            scale: 1
        });
    },
    getLoadData() {
        var data = {
            farms: [],
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
};
