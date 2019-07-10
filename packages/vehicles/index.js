"use strict";
const Sequelize = require('sequelize');
const Op = Sequelize.Op; // TEMP, добавить к глобальным

var dbVehicleProperties;
/*
Vehicle:
sqlId
model
x
y
z
heading
color1
color2
key
owner
license(?)
fuel

VehicleProperties:
model
name
maxFuel
defaultConsumption
license
*/

module.exports = {
    init() {
        this.loadVehiclePropertiesFromDB();
        this.loadVehiclesFromDB();
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
    respawnVehicle(veh) {
        this.spawnVehicle(veh, 1);
        clearInterval(veh.fuelTimer);
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
        vehicle.fuel = litres;
    },
    setVehiclePropertiesByModel(modelName) {
        console.log("find props");
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
    }
}