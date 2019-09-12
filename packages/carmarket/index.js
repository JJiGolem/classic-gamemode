"use strict";
let vehicles = call("vehicles");
let money = call("money");
// console.log("carmarket:");
// console.log(vehicles);
var marketSpots = [];
var carMarketData;
var marketCapacity;
var dbMarket;
var shape;
var carMarket = {
    x: 61.73748779296875,
    y: -1727.130615234375,
    z: 29.502595901489258
}

const PRICE_CONFIG = {
    BUY: 0.8,
    SELL: 0.7
}

module.exports = {
    async init() {
        await this.createCarMarket();
        // await this.loadCarMarketData();
        // await this.loadCarMarketVehicles();

    },
    createCarMarket() {
        mp.blips.new(225, new mp.Vector3(carMarket.x, carMarket.y, carMarket.z),
            {
                name: "Авторынок",
                shortRange: true,
                color: 73
            });
        mp.markers.new(1, new mp.Vector3(carMarket.x, carMarket.y, carMarket.z - 3.5), 4,
            {
                direction: new mp.Vector3(carMarket.x, carMarket.y, carMarket.z),
                rotation: 0,
                color: [102, 186, 255, 128],
                visible: true,
                dimension: 0
            });
        shape = mp.colshapes.newSphere(carMarket.x, carMarket.y, carMarket.z, 4);
        shape.pos = new mp.Vector3(carMarket.x, carMarket.y, carMarket.z);
        shape.isCarMarket = true;

        let label = mp.labels.new(`Продажа транспорта`, new mp.Vector3(carMarket.x, carMarket.y, carMarket.z + 0.5),
            {
                los: false,
                font: 0,
                drawDistance: 10,
            });
        label.isCarMarket = true;
    },
    async loadCarMarketData() { /// Загрузка точек спавна авто из БД
        carMarketData = await db.Models.CarMarketData.findAll();
        for (var i = 0; i < carMarketData.length; i++) {
            marketSpots.push({
                sqlId: carMarketData[i].id,
                x: carMarketData[i].x,
                y: carMarketData[i].y,
                z: carMarketData[i].z,
                h: carMarketData[i].h
            });
        }
        for (var i = 0; i < marketSpots.length; i++) {
            marketSpots[i].isFree = true;
        }
        marketCapacity = i;

        console.log(`[CARMARKET] Загружено мест для авторынка: ${i}`);
    },
    async loadCarMarketVehicles() { /// Загрузка точек спавна авто из БД

        dbMarket = await db.Models.Vehicle.findAll({
            where: {
                key: "market"
            }
        });

        for (var i = 0; i < dbMarket.length; i++) {
            if (i >= marketCapacity) return;
            this.addMarketVehicle(dbMarket[i]);
        }
    },
    addMarketVehicle(veh) {
        for (var i = 0; i < marketSpots.length; i++) {
            if (marketSpots[i].isFree) {
                console.log('Нашли свободный спот, ставим на него')
                marketSpots[i].vehicle = veh;
                veh.x = marketSpots[i].x;
                veh.y = marketSpots[i].y;
                veh.z = marketSpots[i].z;
                veh.h = marketSpots[i].h;
                veh.marketSpot = i;

                if (!veh.sqlId) {
                    vehicles.spawnVehicle(veh, 0);
                } else {
                    vehicles.spawnVehicle(veh, 1);
                }
                marketSpots[i].isFree = false;
                return;
            }
        }
        console.log('Свободных спотов нет');
        let spotIndex = this.getRandomCarSpot();
        console.log(`Выбрали рандомный спот ${spotIndex}`);
        if (marketSpots[spotIndex].vehicle.db) {
            marketSpots[spotIndex].vehicle.db.destroy();
            this.destroyMarketVehicleById(marketSpots[spotIndex].vehicle.sqlId);
        } else {
            marketSpots[spotIndex].vehicle.destroy();
            this.destroyMarketVehicleById(marketSpots[spotIndex].vehicle.id);
        }

        marketSpots[spotIndex].vehicle = veh;
        veh.x = marketSpots[spotIndex].x;
        veh.y = marketSpots[spotIndex].y;
        veh.z = marketSpots[spotIndex].z;
        veh.h = marketSpots[spotIndex].h;
        veh.marketSpot = spotIndex;

        if (!veh.sqlId) {
            vehicles.spawnVehicle(veh, 0);
        } else {
            vehicles.spawnVehicle(veh, 1);
        }
        return;
    },
    isPlayerInCarMarketColshape(player) {
        if (shape.isPointWithin(player.position)) {
            return true;
        } else {
            return false;
        }
    },
    sellCar(vehicle) {
        vehicle.key = "market";
        vehicle.db.update({
            key: "market",
        });
        this.addMarketVehicle(vehicle);
        if (vehicle.fuelTimer) {
            clearInterval(vehicle.fuelTimer);
        }
        vehicle.destroy();
    },
    getRandomCarSpot() {
        return Math.floor(Math.random() * (marketCapacity));
    },
    destroyMarketVehicleById(id) {
        mp.vehicles.forEach((current) => {
            if (current.sqlId == id) {
                clearInterval(current.fuelTimer);
                current.destroy();
            }
        });
    },
    setMarketSpotFree(spotId) {
        marketSpots[spotId].isFree = true;
    },
    async sellAllCharacterVehicles(id) {
        let vehs = await db.Models.Vehicle.findAll({
            where: {
                key: "private",
                owner: id,
                parkingDate: null
            }
        })
        if (vehs.length == 0) return;

        let fullPrice = 0;
        for (let i = 0; i < vehs.length; i++) {
            let props = vehicles.setVehiclePropertiesByModel(vehs[i].modelName);
            await vehs[i].update({
                key: "market",
                owners: vehs[i].owners + 1
            });
            fullPrice += parseInt(props.price * PRICE_CONFIG.SELL);
            this.addMarketVehicle(vehs[i]);
        }
        //let player = mp.players.toArray().find(x => x.character && x.character.id == id);

        let player = mp.players.toArray().find(x => {
            if (!x.character) return;
            if (x.character.id == id) return true;
        });

        if (player) {
            mp.vehicles.forEach((veh) => {
                if (veh.key == 'private' && veh.owner == id) {
                    clearInterval(veh.fuelTimer);
                    veh.destroy();
                    vehicles.removeVehicleFromPlayerVehicleList(player, veh.sqlId);
                    vehicles.removeVehicleFromCarPlace(player, veh);
                }
            })
        }
        money.addMoneyById(id, fullPrice, function (result) {
            if (result) {
                if (player) {
                    player.call('chat.message.push', [`!{#f3c800} Ваш дом продан государству за неуплату`]);
                    player.call('chat.message.push', [`!{#f3c800} Весь транспорт из гаража продан государству за !{#80c102}$${fullPrice}`]);
                    player.call('chat.message.push', [`!{#f3c800} Деньги поступили на ваш банковский счет`]);
                }
            } else {
                console.log(`Ошибка начисления денег за авто, слетевшее в гос для игрока с ID ${id}`);
            }
        });
    },
    getPriceConfig() {
        return PRICE_CONFIG;
    }
}