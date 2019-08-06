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
    }
}