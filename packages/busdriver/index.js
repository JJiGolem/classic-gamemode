"use strict";
let vehicles = call("vehicles");
console.log("driver:");
console.log(vehicles);

let busStation = {
    x: 452.52,
    y: -638.28,
    z: 0,
    marker: {
        x: 895.3949584960938,
        y: -179.32843017578125,
        z: 73.50028686523438,
        color: [255, 255, 125, 200],
    },
}

let shape;

module.exports = {
    init() {
        this.createBusStation();
    },
    createBusStation() {
        mp.blips.new(513, new mp.Vector3(busStation.x, busStation.y, busStation.z),
            {
                name: `Автобусная станция`,
                shortRange: true,
                color: 4
            });
        mp.markers.new(1, new mp.Vector3(busStation.marker.x, busStation.marker.y, busStation.marker.z), 0.4,
            {
                direction: new mp.Vector3(busStation.marker.x, busStation.marker.y, busStation.marker.z),
                rotation: 0,
                color: busStation.marker.color,
                visible: true,
                dimension: 0
            });
        shape = mp.colshapes.newSphere(busStation.marker.x, busStation.marker.y, busStation.marker.z + 1, 1.2);
    }
}