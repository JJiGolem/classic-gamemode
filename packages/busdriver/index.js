"use strict";
let vehicles = call("vehicles");

let busStation = {
    x: 435.4512634277344,
    y: -646.3255615234375,
    z: 0,
    marker: {
        x: 435.9074401855469,
        y: -646.0038452148438,
        z: 27.55,
        color: [255, 255, 125, 200],
    },
}

let shape;
let busStops;

const RENT_PRICE = 50;

module.exports = {
    init() {
        this.createBusStation();
        this.loadBusStopsFromDB();
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

        shape.onEnter = (player) => {
            let state = player.character.job == 3 ? 1 : 0;
            player.call('busdriver.jobmenu.show', [state]);
        }

        shape.onExit = (player) => {
            player.call('busdriver.jobmenu.close');
        }
    },
    async loadBusStopsFromDB() {
        busStops = await db.Models.BusStop.findAll();

        for (var i = 0; i < busStops.length; i++) {
            this.createBusStop(busStops[i]);
        }
        console.log(`[BUSDRIVER] Загружено автобусных остановок: ${i}`);
    },
    createBusStop(stop) {
       let label = mp.labels.new(`Автобусная остановка \n ~y~${stop.name}`, new mp.Vector3(stop.x, stop.y, stop.z),
        {
            los: false,
            font: 0,
            drawDistance: 15,
        });
        label.busStopId = stop.id;
    },
    getRentPrice() {
        return RENT_PRICE;
    },
    getRoutesTypeByModel(model) {
        if (model == 'rentalbus') return 0;
        if (model == 'coach') return 1;
    }
}