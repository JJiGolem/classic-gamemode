let serviceData = [{
    x: 484.9,
    y: -1315.5,
    z: 29.2
},
{
    x: 532.5,
    y: -181.9,
    z: 54.2
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
    }
}