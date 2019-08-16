"use strict";
let vehicles = call("vehicles");

let shape;
let taxiStation = {
    x: 894.9740600585938,
    y: -179.16798400878906,
    z: 74.70034790039062,
    marker: {
        x: 895.3949584960938,
        y: -179.32843017578125,
        z: 73.50028686523438,
        color: [255, 255, 125, 200],
    },
}

module.exports = {
    init() {
        this.createTaxiStation();

    },
    createTaxiStation() {
        mp.blips.new(198, new mp.Vector3(taxiStation.x, taxiStation.y, taxiStation.z),
            {
                name: `Таксопарк "Cuber"`,
                shortRange: true,
                color: 70
            });
        mp.markers.new(1, new mp.Vector3(taxiStation.marker.x, taxiStation.marker.y, taxiStation.marker.z), 0.4,
            {
                direction: new mp.Vector3(taxiStation.marker.x, taxiStation.marker.y, taxiStation.marker.z),
                rotation: 0,
                color: taxiStation.marker.color,
                visible: true,
                dimension: 0
            });
        shape = mp.colshapes.newSphere(taxiStation.marker.x, taxiStation.marker.y, taxiStation.marker.z + 1, 1.2);
        shape.pos = new mp.Vector3(taxiStation.marker.x, taxiStation.marker.y, taxiStation.marker.z);
        shape.isTaxiStation = true;
    }
}