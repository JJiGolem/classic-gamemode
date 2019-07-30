"use strict";

var dbVehicleProperties;
var plates = [];
let utils = call('utils');

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

        vehicle.numberPlate = veh.plate; /// устанавливаем номер

        vehicle.setVariable("engine", false);

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

        vehicle.fuelTimer = setInterval(() => {
            try {
                if (vehicle.engine) {
                    vehicle.fuel = vehicle.fuel - vehicle.properties.defaultConsumption;
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
        }, 60000);
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
                key: { [Op.ne]: "private" }
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
                    defaultConsumption: dbVehicleProperties[i].defaultConsumption,
                    license: dbVehicleProperties[i].license
                }
                if (properties.name == null) properties.name = modelName;
                return properties;
            }
        }

        var properties = {
            name: modelName,
            maxFuel: 50,
            defaultConsumption: 2,
            license: 1
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
                    mileage: value
                });
                console.log(`[DEBUG] Обновили пробег для ${veh.properties.name}. Текущий пробег: ${veh.mileage}. К занесению: ${value}`);
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
    }
}