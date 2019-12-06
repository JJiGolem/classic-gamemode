"use strict";

let dbChargeStations;
let bizes;

module.exports = {
    business: {
        type: 11,
        name: "Зарядочная станция",
        productName: "Электроэнергия",
    },
    productPrice: 1,
    rentPerDayMultiplier: 0.002,
    minChargePrice: 1,
    maxChargePrice: 10,
    async init() {
        bizes = call('bizes');
        await this.loadChargeStationsFromDB();
    },
    async loadChargeStationsFromDB() {
        dbChargeStations = await db.Models.ChargeStation.findAll();

        for (var i = 0; i < dbChargeStations.length; i++) {
            this.createChargeStation(dbChargeStations[i]);
        }
        console.log(`[CHARGESTATIONS] Загружено станций: ${i}`);
    },
    createChargeStation(station) {
        mp.blips.new(354, new mp.Vector3(station.x, station.y, station.z),
            {
                name: "Зарядочная станция",
                color: 60,
                shortRange: true,
            });

        let shape = mp.colshapes.newSphere(station.x, station.y, station.z, 9);
        shape.isChargeStation = true;
        shape.chargeStationId = station.id;

        let label = mp.labels.new(`~y~${station.name}\n~g~$${station.chargePrice} ~w~за ~o~1%~w~\nНажмите ~b~E~w~`, new mp.Vector3(station.x, station.y, station.z),
            {
                los: false,
                font: 0,
                drawDistance: 18,
            });
        label.isChargeStation = true;
        label.chargeStationId = station.id;
    },
    setChargePrice(id, price) {
        for (let i = 0; i < dbChargeStations.length; i++) {
            if (dbChargeStations[i].id == id) {
                dbChargeStations[i].chargePrice = price;
                dbChargeStations[i].save();
                this.updateLabel(id);
                return;
            }
        }
        throw new Error('Станция не найдена');
    },
    updateLabel(id) {
        mp.labels.forEach((current) => {
            if (current.isChargeStation && current.chargeStationId == id) {
                let station = this.getChargeStationById(id);
                current.text = `~y~${station.name}\n~g~$${station.chargePrice} ~w~за ~o~1%~w~\nНажмите ~b~E~w~`;
            }
        });
    },
    getChargeStationById(id) {
        for (let i = 0; i < dbChargeStations.length; i++) {
            if (dbChargeStations[i].id == id) {
                return dbChargeStations[i]
            }
        }
        return null;
    },
    getBizParamsById(id) {
        let station = dbChargeStations.find(x => x.bizId == id);
        if (!station) return;
        return [
            {
                key: 'chargePrice',
                name: 'Цена 1% зарядки',
                max: this.maxChargePrice,
                min: this.minChargePrice,
                current: station.chargePrice,
                isInteger: true
            }
        ];
    },
    setBizParam(id, key, value) {
        let station = dbChargeStations.find(x => x.bizId == id);
        if (!station) return;
        station[key] = value;
        station.save();
        if (key == 'chargePrice') this.updateLabel(station.id);
    },
    getProductsAmount(id) {
        let station = dbChargeStations.find(x => x.id == id);
        let bizId = station.bizId;
        let products = bizes.getProductsAmount(bizId);
        return products;
    },
    removeProducts(id, products) {
        let station = dbChargeStations.find(x => x.id == id);
        let bizId = station.bizId;
        bizes.removeProducts(bizId, products);
    },
    getChargePriceById(id) {
        for (let i = 0; i < dbChargeStations.length; i++) {
            if (dbChargeStations[i].id == id) {
                return dbChargeStations[i].chargePrice;
            }
        }
    },
    updateCashbox(id, money) {
        let station = dbChargeStations.find(x => x.id == id);
        let bizId = station.bizId;
        bizes.bizUpdateCashBox(bizId, money);
    }
}