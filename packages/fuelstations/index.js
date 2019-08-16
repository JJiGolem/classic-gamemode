"use strict";

let dbFuelStations;

module.exports = {
    init() {
        this.loadFuelStationsFromDB();
    },
    async loadFuelStationsFromDB() {
        dbFuelStations = await db.Models.FuelStation.findAll();

        for (var i = 0; i < dbFuelStations.length; i++) {
            this.createFuelStation(dbFuelStations[i]);
        }
        console.log(`[FUELSTATIONS] Загружено АЗС: ${i}`);
    },
    createFuelStation(station) {
        mp.blips.new(361, new mp.Vector3(station.x, station.y, station.z),
            {
                name: "Заправка",
                shortRange: true,
            });

        let shape = mp.colshapes.newSphere(station.x, station.y, station.z, 10);
        shape.isFuelStation = true;
        shape.fuelStationId = station.id;

        let label = mp.labels.new(`~y~${station.name}\n~g~$${station.fuelPrice} ~w~за литр\nНажмите ~b~E~w~`, new mp.Vector3(station.x, station.y, station.z),
            {
                los: false,
                font: 0,
                drawDistance: 20,
            });
        label.isFuelStation = true;
        label.fuelStationId = station.id;
    },
    getFuelPriceById(id) {
        for (let i = 0; i < dbFuelStations.length; i++) {
            if (dbFuelStations[i].id == id) {
                return dbFuelStations[i].fuelPrice;
            }
        }
    },
    parseFuelStations() {
        st.forEach((current) => {
            db.Models.FuelStation.create({
                name: current.name,
                x: current.pos[0],
                y: current.pos[1],
                z: current.pos[2]
            });
        });
    },
    setFuelPrice(id, price) {
        for (let i = 0; i < dbFuelStations.length; i++) {
            if (dbFuelStations[i].id == id) {
                dbFuelStations[i].fuelPrice = price;
                dbFuelStations[i].save();
                this.updateLabel(id);
                return;
            }
        }
        throw new Error('АЗС не найдена');
    },
    updateLabel(id) {
        mp.labels.forEach((current) => {
            if (current.isFuelStation && current.fuelStationId == id) {
                let station = this.getFuelStationById(id);
                current.text = `~y~${station.name}\n~g~$${station.fuelPrice} ~w~за литр\nНажмите ~b~E~w~`;
            }
        });
    },
    getFuelStationById(id) {
        for (let i = 0; i < dbFuelStations.length; i++) {
            if (dbFuelStations[i].id == id) {
                return dbFuelStations[i]
            }
        }
        return null;
    },
}