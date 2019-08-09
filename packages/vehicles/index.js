"use strict";

var dbVehicleProperties;
var plates = [];
let utils = call('utils');

const MAX_BREAK_LEVEL = 2;
let breakdownConfig = {
    engineState: 0.004,
    fuelState: 0.004,
    steeringState: 0.004,
    brakeState: 0.004
};

module.exports = {
    async init() {
        await this.loadVehiclePropertiesFromDB();
        await this.loadVehiclesFromDB();
        await this.loadCarPlates();
    },
    spawnVehicle(veh, source) { /// source: 0 - спавн автомобиля из БД, 1 - респавн любого автомобиля, null - спавн админского авто и т. д.
        let vehicle = mp.vehicles.new(veh.modelName, new mp.Vector3(veh.x, veh.y, veh.z),
            {
                heading: veh.h,
                engine: false,
                locked: false
            });
        vehicle.setColor(veh.color1, veh.color2);
        vehicle.modelName = veh.modelName;
        vehicle.color1 = veh.color1;
        vehicle.color2 = veh.color2;
        vehicle.x = veh.x;
        vehicle.y = veh.y;
        vehicle.z = veh.z;
        vehicle.h = veh.h;
        vehicle.key = veh.key; /// ключ показывает тип авто: faction, job, private, newbie
        vehicle.owner = veh.owner;
        vehicle.license = veh.license;
        vehicle.fuel = veh.fuel;
        vehicle.mileage = veh.mileage;
        vehicle.parkingId = veh.parkingId;
        vehicle.parkingHours = veh.parkingHours;
        vehicle.isOnParking = veh.isOnParking;
        vehicle.lastMileage = veh.mileage; /// Последний сохраненный пробег
        vehicle.marketSpot = veh.marketSpot;
        vehicle.plate = veh.plate;
        vehicle.engineState = veh.engineState;
        vehicle.steeringState = veh.steeringState;
        vehicle.fuelState = veh.fuelState;
        vehicle.brakeState = veh.brakeState;
        vehicle.destroys = veh.destroys;
        vehicle.regDate = veh.regDate;
        vehicle.owners = veh.owners;

        vehicle.multiplier = this.initMultiplier(veh);
        vehicle.setVariable("engine", false);

        vehicle.numberPlate = veh.plate; /// устанавливаем номер

        if (source == 0) { /// Если авто спавнится из БД
            vehicle.sqlId = veh.id;
            vehicle.db = veh;
        }
        if (source == 1 && veh.sqlId) { /// Если авто респавнится (есть в БД)
            vehicle.sqlId = veh.sqlId;
            vehicle.db = veh.db;
        }
        if (!veh.properties) {
            vehicle.properties = this.setVehiclePropertiesByModel(veh.modelName);
        } else {
            vehicle.properties = veh.properties;
        }

        let multiplier = vehicle.multiplier;
        if (vehicle.fuelState) {
            if (vehicle.fuelState == 1) {
                multiplier = multiplier * 2;
            }
            if (vehicle.fuelState == 2) {
                multiplier = multiplier * 4;
            }
        }

        vehicle.consumption = vehicle.properties.consumption * multiplier;
        vehicle.fuelTick = 60000/vehicle.consumption;

        vehicle.fuelTimer = setInterval(() => {
            try {
                if (vehicle.engine) {

                    vehicle.fuel = vehicle.fuel - 1;
                    if (vehicle.fuel <= 0) {
                        vehicle.engine = false;
                        vehicle.setVariable("engine", false);
                        vehicle.fuel = 0;
                        return;
                    }
                }
            } catch (err) {
                console.log(err);
            }
        }, vehicle.fuelTick);
        return vehicle;
    },
    getDriver(vehicle) {
        let driver = vehicle.getOccupants()[0];
        if (driver.seat != -1) {
            return null
        }
        return driver;
    },
    respawnVehicle(veh) {
        clearInterval(veh.fuelTimer);

        if (veh.key == "admin") return veh.destroy(); /// Если админская, не респавним

        if (veh.key == "private") {
            mp.events.call('parkings.vehicle.add', veh);
            veh.destroy();
            return;
        }
        this.spawnVehicle(veh, 1);
        veh.destroy();
    },
    async loadVehiclesFromDB() { /// Загрузка автомобилей фракций/работ из БД 
        var dbVehicles = await db.Models.Vehicle.findAll({
            where: {
                key: {
                    [Op.or]: ["newbie", "faction", "job"]
                }
            }
        });
        for (var i = 0; i < dbVehicles.length; i++) {
            var veh = dbVehicles[i];
            this.spawnVehicle(veh, 0);
        }
        console.log(`[VEHICLES] Загружено транспортных средств: ${i}`);
    },
    async loadVehiclePropertiesFromDB() {
        dbVehicleProperties = await db.Models.VehicleProperties.findAll();
        console.log(`[VEHICLES] Загружено характеристик моделей транспорта: ${dbVehicleProperties.length}`);
    },
    setFuel(vehicle, litres) {
        if (litres < 1) return;
        vehicle.fuel = litres;
    },
    setVehiclePropertiesByModel(modelName) {
        for (let i = 0; i < dbVehicleProperties.length; i++) {
            if (dbVehicleProperties[i].model == modelName) {
                var properties = {
                    name: dbVehicleProperties[i].name,
                    maxFuel: dbVehicleProperties[i].maxFuel,
                    consumption: dbVehicleProperties[i].consumption,
                    license: dbVehicleProperties[i].license,
                    price: dbVehicleProperties[i].price,
                    vehType: dbVehicleProperties[i].vehType
                }
                if (properties.name == null) properties.name = modelName;
                return properties;
            }
        }

        var properties = {
            name: modelName,
            maxFuel: 50,
            consumption: 2,
            license: 1,
            price: 100000,
            vehType: 0
        }

        return properties;
    },
    async updateMileage(player) {
        if (!player.vehicle) return;
        let veh = player.vehicle;

        if (veh.sqlId) {
            try {
                var value = parseInt(veh.mileage);
                if ((veh.lastMileage - value) == 0) return;
                veh.lastMileage = value;
                await veh.db.update({
                    mileage: value,
                    fuel: Math.ceil(veh.fuel)
                });
                console.log(`[DEBUG] Обновили пробег для ${veh.properties.name}. Текущий пробег: ${veh.mileage}. К занесению: ${value} км и ${Math.ceil(veh.fuel)} л`);
            } catch (err) {
                console.log(err);
            }
        }
    },
    async loadPrivateVehicles(player) {
        var dbPrivate = await db.Models.Vehicle.findAll({
            where: {
                key: "private",
                owner: player.character.id
            }
        });
        player.vehicleList = [];
        let temp = 0;
        dbPrivate.forEach((current) => {
            if (temp > 3) return; // TEMP!!!
            let props = this.setVehiclePropertiesByModel(current.modelName);
            player.vehicleList.push({
                id: current.id,
                name: props.name,
                plate: current.plate,
                regDate: current.regDate,
                owners: current.owners,
                vehType: props.vehType,
                price: props.price
            });
            temp++;
        });
        console.log(player.vehicleList);
        // if (player.home) spawnHomeVehicles()
        // проверка на отсутствие дома todo
        if (dbPrivate.length > 0) {
            if (dbPrivate[0].isOnParking == 1) {
                mp.events.call('parkings.vehicle.add', dbPrivate[0]);
            }
        }
        console.log(`Для игрока ${player.character.name} загружено ${dbPrivate.length} авто`)
    },
    async loadCarPlates() {
        let carPlatesDB = await db.Models.Vehicle.findAll({
            attributes: ['plate'],
            raw: true
        });
        for (var i = 0; i < carPlatesDB.length; i++) {
            plates.push(carPlatesDB[i].plate);
        }
        console.log(`[VEHICLES] Гос. номеров загружено: ${i}`);
    },

    generateVehiclePlate() {
        let abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let letters = "";
        while (letters.length < 3) {
            letters += abc[Math.floor(Math.random() * abc.length)];
        }
        let number = utils.randomInteger(100, 999);
        let plate = letters + number.toString();

        if (plates.includes(plate)) return this.generateVehiclePlate();
        console.log(`Сгенерировали номер ${plate}`);
        plates.push(plate);
        return plate;
    },
    initMultiplier(veh) {
        if (veh.key == 'admin') return 1;
        let multiplier = 1;
        let mileage = veh.mileage;
        let destroys = veh.destroys;

        if (mileage < 10) multiplier += 0.01;
        if (mileage >= 10 && mileage < 100) multiplier += 0.05;
        if (mileage >= 100 && mileage < 300) multiplier += 0.1;
        if (mileage >= 300 && mileage < 500) multiplier += 0.2;
        if (mileage >= 500 && mileage < 1000) multiplier += 0.4;
        if (mileage >= 1000 && mileage < 2000) multiplier += 0.5;
        if (mileage >= 2000 && mileage < 4000) multiplier += 0.7;
        if (mileage >= 4000 && mileage < 10000) multiplier += 1;
        if (mileage >= 10000) multiplier += 1.2;

        multiplier += 0.01 * destroys;
        return multiplier;
    },
    generateBreakdowns(veh) {
        if (!veh) return;
        let multiplier = veh.multiplier;
        //let multiplier = 10;
        let toUpdate = false;
        for (let key in breakdownConfig) {
            if (veh[key] < MAX_BREAK_LEVEL) {
                console.log(`Пытаемся сломать ${key} у ${veh.properties.name}`);
                let random = Math.random();
                console.log(random);
                if (random < breakdownConfig[key] * multiplier) {
                    veh[key]++;
                    toUpdate = true;
                    console.log(`сломали ${key}`);
                }
            }
        }
        if (toUpdate) {
            console.log('обновляем поломки в бд');
            if (veh.db) {
                veh.db.update({
                    engineState: veh.engineState,
                    fuelState: veh.fuelState,
                    steeringState: veh.steeringState,
                    brakeState: veh.brakeState
                });
            }
        }
    },
    getVehicleBySqlId() {
        if (!sqlId) return null;
        var result;
        mp.vehicles.forEach((veh) => {
            if (veh.sqlId == sqlId) {
                result = veh;
                return;
            }
        });
        return result;
    },
    spawnHomeVehicles(player, vehicles) {
        
    }
}