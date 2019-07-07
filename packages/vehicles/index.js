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
type
owner

v1.0:
sqlId
model
x
y
z
heading
color1
color2
type
owner
*/


module.exports = {
    "init": ()=> {
        //загрузка транспорта из бд
    },
    "spawnVehicle": (veh) => {
        let vehicle = mp.vehicles.new(veh.model, new mp.Vector3(veh.x, veh.y, veh.z),
        {
            heading: veh.heading
        });
        vehicle.setColor(veh.color1, veh.color2);
        vehicle.spawnPosition = new mp.Vector3(veh.x, veh.y, veh.z);
        vehicle.spawnHeading = veh.heading;
        vehicle.key = veh.key;
        vehicle.owner = veh.owner;
        console.log(veh.key);
    }
}