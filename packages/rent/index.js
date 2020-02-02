let vehicles;

let points;
let dbRentVehicles;

module.exports = {
    rentPriceMultiplier: 0.05,
    respawnTime: 20 * 60 * 1000,
    maxRentVehicles: 2,
    licenseConfig: {
        0: {
            licType: 'carLicense',
            name: 'легковые т/с'
        },
        1: {
            licType: 'bikeLicense',
            name: 'мотоциклы'
        },
        2: null,
    },
    async init() {
        vehicles = call("vehicles");
        await this.loadRentPointsFromDB();
        this.loadRentVehicles();
    },
    async loadRentPointsFromDB() {
        points = await db.Models.RentPoint.findAll();
        for (var i = 0; i < points.length; i++) {
            this.createRentPoint(points[i]);
        }
        console.log(`[RENT] Загружено точек аренды: ${i}`);
    },
    createRentPoint(point) {
        mp.blips.new(point.blip, new mp.Vector3(point.x, point.y, point.z),
            {
                name: point.name,
                color: point.blipColor,
                shortRange: true,
            });
    },
    async loadRentVehicles() {
        dbRentVehicles = await db.Models.Vehicle.findAll({
            where: {
                key: "rent"
            }
        });
        for (var i = 0; i < dbRentVehicles.length; i++) {
            let veh = dbRentVehicles[i];
            vehicles.spawnVehicle(veh, 0);
        }
        console.log(`[RENT] Загружено транспорта для аренды: ${i}`);
    },
}