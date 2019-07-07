"use strict";

/*
temp
свойства авто:
sqlId
model
name (?)
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
*/

var testdb = [
    {
        model: "blista",
        x: -250.40139770507812,
        y: -317.3185729980469,
        z: 30.105422973632812,
        spawnHeading: 45,
        color1: 27,
        color2: 111,
        key: "newbie",
        owner: 0,
        license: 0,
        id: 123
    },
    {
        model: "blista",
        x: -250.40139770507812,
        y: -314.3185729980469,
        z: 30.105422973632812,
        spawnHeading: 45,
        color1: 27,
        color2: 27,
        key: "newbie",
        owner: 0,
        license: 0,
        id: 456
    },
    {
        model: "blista",
        x: -250.40139770507812,
        y: -311.3185729980469,
        z: 30.105422973632812,
        spawnHeading: 45,
        color1: 111,
        color2: 27,
        key: "newbie",
        owner: 0,
        license: 0,
        id: 789
    }
]

module.exports = {
    init() {
        this.loadVehiclesFromDB();
    },
    spawnVehicle(veh, source) { /// source: 0 - спавн автомобиля из БД, 1 - респавн любого автомобиля, null - спавн админского авто и т. д.
        let vehicle = mp.vehicles.new(veh.model, new mp.Vector3(veh.x, veh.y, veh.z),
        {
            heading: veh.spawnHeading,
            engine: false
        });
        vehicle.setColor(veh.color1, veh.color2);
        vehicle.color1 = veh.color1;
        vehicle.color2 = veh.color2;
        vehicle.x = veh.x,
        vehicle.y = veh.y,
        vehicle.z = veh.z,
        vehicle.spawnHeading = veh.spawnHeading;
        vehicle.key = veh.key; /// faction, job, private, newbie
        vehicle.owner = veh.owner;
        vehicle.license = veh.license;
        if (source == 0) {
            vehicle.sqlId = veh.id;
        } 
        if (source == 1 && veh.sqlId) {
            vehicle.sqlId = veh.sqlId;
        }
        return vehicle;
    },
    respawnVehicle (veh) {
        this.spawnVehicle(veh, 1);
        veh.destroy();
    },
    loadVehiclesFromDB() {
        for (var i = 0; i < testdb.length; i++) {
            var veh = testdb[i];
            if (veh.key != "private") {
                this.spawnVehicle(veh, 0);
            }
        }
        console.log(`[VEHICLES] Загружено транспортных средств: ${i}`);
    }
}