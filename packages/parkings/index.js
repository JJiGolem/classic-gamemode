var dbParkings;
var parkings = [];

module.exports = {
    async init() {
        await this.loadParkingsFromDB();
    },
    async loadParkingsFromDB() {
        dbParkings = await db.Models.Parking.findAll();
        for (var i = 0; i < dbParkings.length; i++) {
            parkings.push({
                sqlId: dbParkings[i].id,
                name: dbParkings[i].name,
                x: dbParkings[i].x,
                y: dbParkings[i].y,
                z: dbParkings[i].z,
                carX: dbParkings[i].carX,
                carY: dbParkings[i].carY,
                carZ: dbParkings[i].carZ,
                carH: dbParkings[i].carH
            });
        }
        for (var i = 0; i < dbParkings.length; i++) {
            this.createParking(dbParkings[i]);
        }
        console.log(`[PARKINGS] Загружено парковок: ${i}`);
    },
    createParking(parking) {
        mp.blips.new(1, new mp.Vector3(parking.x, parking.y, parking.z),
            {
                name: "Парковка",
                shortRange: true,
            });
        mp.markers.new(1, new mp.Vector3(parking.x, parking.y, parking.z), 2,
            {
                direction: new mp.Vector3(parking.x, parking.y, parking.z),
                rotation: 0,
                color: [255, 255, 255, 255],
                visible: true,
                dimension: 0
            });
        let shape = mp.colshapes.newSphere(parking.x, parking.y, parking.z, 2);
        shape.isParking = true;
        shape.parkingId = parking.id;
    },
}