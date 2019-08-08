let serviceData = [{
    x: 484.9,
    y: -1315.5,
    z: 29.2
},
{
    x: 540.07470703125,
    y: -177.12237548828125,
    z: 54.481346130371094
},
{
    x: -228.7,
    y: -1388.0,
    z: 31.2
}];

module.exports = {
    async init() {
        this.loadCarServicesFromDB();
    },
    loadCarServicesFromDB() {
        serviceData.forEach((service) => {
            this.createCarService(service);
        });
    },
    createCarService(carService) {
        mp.blips.new(402, new mp.Vector3(carService.x, carService.y, carService.z),
            {
                name: "Автомастерская",
                shortRange: true,
            });

        let shape = mp.colshapes.newSphere(carService.x, carService.y, carService.z, 16);
        shape.isCarService = true;
        //shape.carServiceId = carService.id;
    },
    getRepairPriceMultiplier(vehicle) {
        let price = vehicle.properties.price;
        let multiplier;

        if (price < 5000) {
            multiplier = 1;
        }
        if (price >= 5000 && price < 15000) {
            multiplier = 1.5;
        }
        if (price >= 5000 && price < 15000) {
            multiplier = 2;
        }
        if (price >= 15000 && price < 30000) {
            multiplier = 4;
        }
        if (price >= 30000 && price < 60000) {
            multiplier = 6;
        }
        if (price >= 60000 && price < 120000) {
            multiplier = 12;
        }
        if (price >= 120000 && price < 250000) {
            multiplier = 25;
        }
        if (price >= 250000 && price < 500000) {
            multiplier = 60;
        }
        if (price >= 500000 && price < 1000000) {
            multiplier = 120;
        }
        if (price >= 1000000 && price < 3000000) {
            multiplier = 250;
        }
        if (price >= 3000000) {
            multiplier = 500;
        }
        return multiplier;
    },
    repairVehicle(vehicle) {
        try {
            if (vehicle.db) {
                vehicle.db.update({
                    engineState: 0,
                    fuelState: 0,
                    steeringState: 0,
                    brakeState: 0
                });
            }
            vehicle.engineState = 0;
            vehicle.fuelState = 0;
            vehicle.steeringState = 0;
            vehicle.brakeState = 0;
        } catch (err) {
            console.log(err);
        }
    }
}