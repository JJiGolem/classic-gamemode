var vehicles = call('vehicles');
var parkings = call('parkings');
var money = call('money');
var houses = call('houses');
var dbCarList;
var dbCarShow;
var carShow = [];
var carList = [];

const CARLIST_UPDATE_INTERVAL = 60 * 60 * 1000; /// Интервал заполнения автосалона автомобилями (в секундах)

module.exports = {
    async init() {
        await this.loadCarShowsFromDB();
        await this.loadCarListsFromDB();
        this.startCarListUpdating();
    },
    async loadCarShowsFromDB() { /// Загрузка автосалонов из БД
        dbCarShow = await db.Models.CarShow.findAll();
        for (var i = 0; i < dbCarShow.length; i++) {
            carShow.push({
                sqlId: dbCarShow[i].id,
                name: dbCarShow[i].name,
                x: dbCarShow[i].x,
                y: dbCarShow[i].y,
                z: dbCarShow[i].z,
                cameraX: dbCarShow[i].cameraX,
                cameraY: dbCarShow[i].cameraY,
                cameraZ: dbCarShow[i].cameraZ,
                toX: dbCarShow[i].toX,
                toY: dbCarShow[i].toY,
                toZ: dbCarShow[i].toZ,
                toH: dbCarShow[i].toH,
                returnX: dbCarShow[i].returnX,
                returnY: dbCarShow[i].returnY,
                returnZ: dbCarShow[i].returnZ,
                returnH: dbCarShow[i].returnH,
                blipId: dbCarShow[i].blipId,
                blipColor: dbCarShow[i].blipColor
            });
        }
        for (var i = 0; i < dbCarShow.length; i++) {
            this.createCarShow(dbCarShow[i]);
        }
        console.log(`[CARSHOW] Загружено автосалонов: ${i}`);
    },
    createCarShow(carShow) {
        mp.blips.new(carShow.blipId, new mp.Vector3(carShow.x, carShow.y, carShow.z),
            {
                name: carShow.name,
                color: carShow.blipColor,
                shortRange: true,
            });
        mp.markers.new(1, new mp.Vector3(carShow.x, carShow.y, carShow.z), 1.6,
            {
                direction: new mp.Vector3(carShow.x, carShow.y, carShow.z),
                rotation: 0,
                color: [255, 255, 125, 128],
                visible: true,
                dimension: 0
            });
        let shape = mp.colshapes.newSphere(carShow.x, carShow.y, carShow.z + 0.5, 2);
        shape.isCarShow = true;
        shape.carShowId = carShow.id;

        let shortName = carShow.name.split(' ')[0];
        let label = mp.labels.new(`${shortName}`, new mp.Vector3(carShow.x, carShow.y, carShow.z + 1.7),
            {
                los: false,
                font: 0,
                drawDistance: 10,
            });
        label.isCarShow = true;
        label.carShowId = carShow.id;
    },
    async loadCarListsFromDB() {
        dbCarList = await db.Models.CarList.findAll();

        for (var i = 0; i < dbCarList.length; i++) {
            carList.push({
                sqlId: dbCarList[i].id,
                carShowId: dbCarList[i].carShowId,
                count: dbCarList[i].count,
                vehiclePropertyModel: dbCarList[i].vehiclePropertyModel,
                percentage: dbCarList[i].percentage,
                db: dbCarList[i]
            });
        }

        for (var i = 0; i < carList.length; i++) { /// Устанавливаем характеристики для каждого автомобиля, расположенного в автосалоне
            carList[i] = this.setCarListProperties(carList[i]);
        }
        console.log(`[CARSHOW] Загружено моделей авто для автосалонов: ${i}`);
    },
    getCarShowList(carShowId) {
        var list = [];
        for (var i = 0; i < carList.length; i++) {
            if (carList[i].carShowId == carShowId) {
                list.push(carList[i]);
            }
        }
        return list;
    },
    setCarListProperties(veh) {
        let properties = vehicles.setVehiclePropertiesByModel(veh.vehiclePropertyModel);
        veh.properties = properties;
        return veh;
    },
    startCarListUpdating() {
        setInterval(() => {
            try {
                this.updateCarList();
            } catch (err) {
                console.log(err);
            }
        }, CARLIST_UPDATE_INTERVAL);

        /* ДЛЯ ТЕСТОВ
                for (let j = 0; j < 720; j++) {
                    this.updateCarList();
                }
        */
    },
    updateCarList() {
        console.log("[CARSHOW] Запуск обновления автосалонов");
        for (var i = 0; i < carList.length; i++) {
            let randomInt = this.generateRandomInt();
            console.log(randomInt);
            if (randomInt <= carList[i].percentage) {
                console.log(`[CARSHOW] В автосалон добавлен т/c ${carList[i].vehiclePropertyModel}`);
                carList[i].count = carList[i].count + 1;
                carList[i].db.update({
                    count: carList[i].count + 1
                });
            }
        }
        console.log("[CARSHOW] Обновление автосалонов завершено");
    },
    generateRandomInt() {
        return Math.floor(Math.random() * 1000);
    },
    getCarShowPropertyBySqlId(prop, sqlId) {
        for (var i = 0; i < carShow.length; i++) {
            if (carShow[i].sqlId == sqlId) {
                return carShow[i][prop];
            }
        }
    },
    async buyCarFromCarList(player, carId, primaryColor, secondaryColor) {
        console.log(carId);
        for (var i = 0; i < carList.length; i++) {
            if (carList[i].sqlId == carId) {
                // проверки на деньги и т д
                if (player.character.cash < carList[i].properties.price) return player.call('carshow.car.buy.ans', [2]);
                if (carList[i].count < 1) return player.call('carshow.car.buy.ans', [0]);
                let hasHouse = houses.isHaveHouse(player.character.id);
                if (!hasHouse) {
                    if (player.vehicleList.length > 1) return player.call('carshow.car.buy.ans', [5]);
                } else {
                    if (player.vehicleList.length + 1 > player.carPlaces.length - 1) return player.call('carshow.car.buy.ans', [5]);
                }
                let carToBuy = carList[i];
                money.removeCash(player, carList[i].properties.price, async function (result) {
                    if (result) {
                        try {
                            var carPlate = vehicles.generateVehiclePlate();
                            let parking = parkings.getClosestParkingId(player);
                            let parkingInfo = parkings.getParkingInfoById(parking);
                            console.log(parkingInfo);
                            var data = await db.Models.Vehicle.create({
                                key: "private",
                                owner: player.character.id,
                                modelName: carToBuy.vehiclePropertyModel,
                                color1: primaryColor,
                                color2: secondaryColor,
                                x: 0,
                                y: 0,
                                z: 0,
                                h: 0,
                                isOnParking: hasHouse ? 0 : 1,
                                parkingId: parking,
                                plate: carPlate,
                                owners: 1
                            });
                            var veh = {
                                key: "private",
                                owner: player.character.id,
                                modelName: carToBuy.vehiclePropertyModel,
                                color1: primaryColor,
                                color2: secondaryColor,
                                x: 0,
                                y: 0,
                                z: 0,
                                h: 0,
                                parkingId: parking,
                                isOnParking: hasHouse ? 0 : 1,
                                fuel: 50,
                                mileage: 0,
                                plate: carPlate,
                                engineState: 0,
                                fuelState: 0,
                                steeringState: 0,
                                brakeState: 0,
                                destroys: 0,
                                parkingHours: 0,
                                owners: 1
                            }
                            veh.sqlId = data.id;
                            veh.db = data;
                            if (!hasHouse) {
                                mp.events.call('parkings.vehicle.add', veh);
                            } else {
                                console.log('spawn house');
                                vehicles.spawnHomeVehicle(player, veh);
                            }

                            carToBuy.db.update({
                                count: carToBuy.count - 1
                            });
                            carToBuy.count = carToBuy.count - 1;
                            //player.vehiclesCount = player.vehiclesCount + 1;
                            //console.log(player.vehiclesCount);
                            let props = vehicles.setVehiclePropertiesByModel(data.modelName);
                            player.vehicleList.push({
                                id: data.id,
                                name: props.name,
                                plate: data.plate,
                                regDate: data.regDate,
                                owners: data.owners,
                                vehType: props.vehType,
                                price: props.price
                            });

                            if (!hasHouse) {
                                player.call('carshow.car.buy.ans', [1, carToBuy, parkingInfo]);
                            } else {
                                player.call('carshow.car.buy.ans', [6, carToBuy]);
                            }

                            
                        } catch (err) {
                            console.log(err);
                            player.call('carshow.car.buy.ans', [2]);
                        }
                    } else {

                        player.call('carshow.car.buy.ans', [3]);

                    }
                });

            }
        }
    },
    getCarShowInfoById(sqlId) {
        for (var i = 0; i < carShow.length; i++) {
            if (carShow[i].sqlId == sqlId) {
                return carShow[i];
            }
        }
    },
    parseProps() {
        for (let key in carshowdata) {
            db.Models.VehicleProperties.create({
                model: key,
                name: carshowdata[key].name,
                vehType: 0,
                price: carshowdata[key].price,
                maxFuel: 50,
                consumption: 2
            });
        }
    },
    parseCarList() {
        for (let key in carshowdata) {
            db.Models.CarList.create({
                carShowId: 1,
                vehiclePropertyModel: key
            });
        }
    }
}