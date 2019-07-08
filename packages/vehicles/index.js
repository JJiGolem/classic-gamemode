"use strict";
const Sequelize = require('sequelize');
const Op = Sequelize.Op; //
/*
temp
свойства авто:
sqlId
model
x
y
z
heading
color1
color2
fuel
maxFuel
consumption
mileage
health
key
owner
license

v1.0:
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
license
fuel
*/

// db.Models.Vehicle.create(
//     {
//         model: "blista",
//         x: -250.40139770507812,
//         y: -317.3185729980469,
//         z: 30.105422973632812,
//         h: 45,
//         color1: 27,
//         color2: 111,
//         key: "newbie",
//         owner: 0,
//         license: 0,
//         fuel: 10
//     });
// db.Models.Vehicle.create(
//     {
//         model: "blista",
//         x: -250.40139770507812,
//         y: -317.3185729980469,
//         z: 30.105422973632812,
//         h: 45,
//         color1: 27,
//         color2: 111,
//         key: "newbie",
//         owner: 0,
//         license: 0,
//         fuel: 10
//     });
// db.Models.Vehicle.create(
//     {
//         model: "blista",
//         x: -250.40139770507812,
//         y: -317.3185729980469,
//         z: 30.105422973632812,
//         h: 45,
//         color1: 27,
//         color2: 111,
//         key: "newbie",
//         owner: 0,
//         license: 0,
//         fuel: 10
//     });

module.exports = {
    init() {
        this.loadVehiclesFromDB();
    },
    spawnVehicle(veh, source) { /// source: 0 - спавн автомобиля из БД, 1 - респавн любого автомобиля, null - спавн админского авто и т. д.
        let vehicle = mp.vehicles.new(veh.model, new mp.Vector3(veh.x, veh.y, veh.z),
            {
                heading: veh.h,
                engine: false
            });
        vehicle.modelName = veh.model;
        vehicle.setColor(veh.color1, veh.color2);
        vehicle.color1 = veh.color1;
        vehicle.color2 = veh.color2;
        vehicle.x = veh.x,
            vehicle.y = veh.y,
            vehicle.z = veh.z,
            vehicle.h = veh.h;
        vehicle.key = veh.key; /// faction, job, private, newbie
        vehicle.owner = veh.owner;
        vehicle.license = veh.license;
        vehicle.fuel = veh.fuel;
        vehicle.db = veh;
        if (source == 0) {
            vehicle.sqlId = veh.id;
        }
        if (source == 1 && veh.sqlId) {
            vehicle.sqlId = veh.sqlId;
        }
        vehicle.fuelTimer = setInterval(() => {
            try {
                if (vehicle.engine) {
                    vehicle.fuel = vehicle.fuel - 1;
                    if (vehicle.fuel <= 0) {
                        vehicle.engine = false;
                        vehicle.fuel = 0;
                        return;
                    }
                }
            } catch (err) {
                console.log(err);
            }
        }, 1000);
        return vehicle;
    },
    respawnVehicle(veh) {
        this.spawnVehicle(veh, 1);
        clearInterval(veh.fuelTimer);
        veh.destroy();
    },
    async loadVehiclesFromDB() {
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
    setFuel(vehicle, litres) {
        vehicle.fuel = litres;
    }
}