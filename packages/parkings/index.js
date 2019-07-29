var dbParkings;
var parkings = [];
var parkingVehicles = []; /// автомобили на парковке
var vehicles = call("vehicles");

const PARKING_PRICE = 2; /// цена парковки за час

module.exports = {
    async init() {
        await this.loadParkingsFromDB();
        this.startParkingHoursUpdater();
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
        mp.blips.new(267, new mp.Vector3(parking.x, parking.y, parking.z),
            {
                name: "Подземная парковка",
                shortRange: true,
            });
        mp.markers.new(1, new mp.Vector3(parking.x, parking.y, parking.z), 2,
            {
                direction: new mp.Vector3(parking.x, parking.y, parking.z),
                rotation: 0,
                color: [102, 186, 255, 128],
                visible: true,
                dimension: 0
            });
        let shape = mp.colshapes.newSphere(parking.x, parking.y, parking.z, 2);
        shape.pos = new mp.Vector3(parking.x, parking.y, parking.z);
        shape.isParking = true;
        shape.parkingId = parking.id;

        let label = mp.labels.new(`Парковка \n ~y~${parking.name}\n~g~$2 ~w~в час`, new mp.Vector3(parking.x, parking.y, parking.z + 1.6),
            {
                los: false,
                font: 0,
                drawDistance: 10,
            });
        label.isParking = true;
        label.parkingId = parking.id;
    },
    addVehicleToParking(veh) {
        console.log(`добавили на парковку ${veh.modelName}`);
        parkingVehicles.push(veh);
    },
    spawnParkingVehicle(player, parkingId) {
        
        for (var i = 0; i < parkingVehicles.length; i++) {
            if ((parkingVehicles[i].owner == player.character.id) && (parkingId == parkingVehicles[i].parkingId)) {

                let index = this.findParkingIndexById(parkingVehicles[i].parkingId);
                // TODO Проверки на деньги и снятие денег
                player.call('chat.message.push', [`!{#80c102} Вы забрали транспорт с парковки за !{#009eec}$${parkingVehicles[i].parkingHours*PARKING_PRICE}`]);
                player.call('notifications.push.success', ["Вы забрали т/с с парковки", "Успешно"]);
                parkingVehicles[i].x = parkings[index].carX;
                parkingVehicles[i].y = parkings[index].carY;
                parkingVehicles[i].z = parkings[index].carZ;
                parkingVehicles[i].h = parkings[index].carH;
                parkingVehicles[i].parkingHours = 0;
                if (!parkingVehicles[i].sqlId) {
                    vehicles.spawnVehicle(parkingVehicles[i], 0);
                } else {
                    vehicles.spawnVehicle(parkingVehicles[i], 1);
                }
                parkingVehicles.splice(i, 1);
                return;
            }
        }
        player.call('notifications.push.error', ["На парковке нет вашего т/c", "Ошибка"]);
    },
    findParkingIndexById(id) {
        for (var i = 0; i < parkings.length; i++) {
            if (parkings[i].sqlId == id) {
                return i;
            }
        }
    },
    getClosestParkingId(entity) {
        var minId = 1;
        var minDist = 10000;
        mp.colshapes.forEach((shape) => {
            if (shape.isParking) {
                let dist = entity.dist(shape.pos);
                if (dist < minDist) {
                    minDist = dist;
                    minId = shape.parkingId;
                }
            }
        });
        return minId;
    },
    addNewParking(parking) {
        parkings.push(parking);
        this.createParking(parking);
    },
    startParkingHoursUpdater() {
        setInterval(() => {
            try {
                this.parkingHoursUpdater();
                console.log('[PARKINGS] Обновление платных часов у парковок');
            } catch (err) {
                console.log(err);
            }
        }, 60*60*1000);
    },
    async parkingHoursUpdater() {
        let data = await db.Models.Vehicle.findAll({
            where: {
                key: "private",
                isOnParking: 1
            }
        });
        data.forEach((current) => {
            current.update({
                parkingHours: data[0].parkingHours + 1,
            });
        })
        parkingVehicles.forEach((veh) => {
            veh.parkingHours = veh.parkingHours + 1;
        });
    },
    savePlayerParkingVehicles(player) {
        console.log(player.character.id);
        mp.vehicles.forEach((current) => {
            console.log("key" + current.key);
            console.log("owner" + current.owner);
            console.log(current.key == "private");
            console.log(current.owner == player.character.id);
            if (current.key == "private" && current.owner == player.character.id) {
                if (current.isOnParking) {
                    console.log("нашли");
                    current.db.update({
                        parkingId: this.getClosestParkingId(player),
                        parkingHours: 0
                    });
                }
            }
        });
        parkingVehicles.forEach((current) => {
            if (current.db) {
                current.db.update({
                    parkingHours: current.parkingHours
                });
            } else {
                current.update({
                    parkingHours: current.parkingHours
                });
            }
        });
    }
}