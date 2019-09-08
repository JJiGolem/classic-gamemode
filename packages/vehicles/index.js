"use strict";

var dbVehicleProperties;
var plates = [];
let inventory = call('inventory');
let utils = call('utils');
let tuning = call('tuning');

const MAX_BREAK_LEVEL = 2;
let breakdownConfig = {
    engineState: 0.004,
    fuelState: 0.004,
    steeringState: 0.004,
    brakeState: 0.004
};

let houses;

module.exports = {
    async init() {
        houses = call('houses');
        await this.loadVehiclePropertiesFromDB();
        await this.loadVehiclesFromDB();
        await this.loadCarPlates();
        mp.events.call('vehicles.loaded');
    },
    async spawnVehicle(veh, source) { /// source: 0 - спавн автомобиля из БД, 1 - респавн любого автомобиля, null - спавн админского авто и т. д.
        let vehicle = mp.vehicles.new(veh.modelName, new mp.Vector3(veh.x, veh.y, veh.z), {
            heading: veh.h,
            engine: false,
            locked: false
        });
        vehicle.setColor(veh.color1, veh.color2);
        vehicle.modelName = veh.modelName;
        vehicle.color1 = veh.color1;
        vehicle.color2 = veh.color2;
        vehicle.x = veh.x;
        vehicle.y = veh.y;
        vehicle.z = veh.z;
        vehicle.h = veh.h;
        vehicle.d = veh.d;
        vehicle.key = veh.key; /// ключ показывает тип авто: faction, job, private, newbie
        vehicle.owner = veh.owner;
        vehicle.license = veh.license;
        vehicle.fuel = veh.fuel;
        vehicle.mileage = veh.mileage;
        vehicle.parkingId = veh.parkingId;
        vehicle.parkingHours = veh.parkingHours;
        vehicle.isOnParking = veh.isOnParking;
        vehicle.lastMileage = veh.mileage; /// Последний сохраненный пробег
        vehicle.marketSpot = veh.marketSpot;
        vehicle.plate = veh.plate;
        vehicle.engineState = veh.engineState;
        vehicle.steeringState = veh.steeringState;
        vehicle.fuelState = veh.fuelState;
        vehicle.brakeState = veh.brakeState;
        vehicle.destroys = veh.destroys;
        vehicle.regDate = veh.regDate;
        vehicle.owners = veh.owners;

        vehicle.multiplier = this.initMultiplier(veh);
        vehicle.setVariable("engine", false);

        vehicle.numberPlate = veh.plate; /// устанавливаем номер

        veh.d ? vehicle.dimension = veh.d : vehicle.dimension = 0; /// устанавливаем измерение

        veh.isInGarage ? vehicle.isInGarage = veh.isInGarage : vehicle.isInGarage = false;

        veh.carPlaceIndex ? vehicle.carPlaceIndex = veh.carPlaceIndex : vehicle.carPlaceIndex = null;

        if (source == 0) { /// Если авто спавнится из БД
            vehicle.sqlId = veh.id;
            vehicle.db = veh;
            inventory.initVehicleInventory(vehicle);
        }
        if (source == 1 && veh.sqlId) { /// Если авто респавнится (есть в БД)
            vehicle.sqlId = veh.sqlId;
            vehicle.db = veh.db;
        }
        if (!veh.properties) {
            vehicle.properties = this.setVehiclePropertiesByModel(veh.modelName);
        } else {
            vehicle.properties = veh.properties;
        }

        if (veh.key == 'private' || veh.key == 'market' || veh.key == 'newbie') { // temp
            if (!veh.tuning) {
                await this.initTuning(vehicle);
            } else {
                vehicle.tuning = veh.tuning;
            }
            tuning.setTuning(vehicle);
        }


        let multiplier = vehicle.multiplier;
        if (vehicle.fuelState) {
            if (vehicle.fuelState == 1) {
                multiplier = multiplier * 2;
            }
            if (vehicle.fuelState == 2) {
                multiplier = multiplier * 4;
            }
        }

        vehicle.consumption = vehicle.properties.consumption * multiplier;
        vehicle.fuelTick = 60000 / vehicle.consumption;
        if (!vehicle.fuelTick || isNaN(vehicle.fuelTick)) vehicle.fuelTick = 60000;

        vehicle.fuelTimer = setInterval(() => {
            try {
                if (vehicle.engine) {
                    vehicle.fuel = vehicle.fuel - 1;
                    if (vehicle.fuel <= 0) {
                        vehicle.engine = false;
                        vehicle.setVariable("engine", false);
                        vehicle.fuel = 0;
                        return;
                    }
                }
            } catch (err) {
                console.log(err);
            }
        }, vehicle.fuelTick);
        return vehicle;
    },
    getDriver(vehicle) {
        let driver = vehicle.getOccupants()[0];
        if (driver.seat != -1) {
            return null
        }
        return driver;
    },
    respawnVehicle(veh) {
        if (!mp.vehicles.exists(veh)) return;
        console.log('respawn');
        //let occupants = veh.getOccupants();
        //console.log(occupants);
        // if (occupants.length > 0) {
        //     occupants.forEach((player) => {
        //         try {
        //             player.removeFromVehicle();
        //         } catch (err) {
        //             console.log(err);
        //         }
        //     });
        // }

        if (veh.key == "admin") { /// Если админская, не респавним
            clearInterval(veh.fuelTimer);
            veh.destroy();
            return;
        }

        if (veh.key == "private" && veh.isOnParking) {
            mp.events.call('parkings.vehicle.add', veh);
            clearInterval(veh.fuelTimer);
            veh.destroy();
            return;
        }

        if (veh.key == "private" && !veh.isOnParking && veh.d != 0) {
            veh.isInGarage = true;
        }
        // veh.repair();
        // veh.position = new mp.Vector3(veh.x, veh.y, veh.z);
        // veh.rotation = new mp.Vector3(0, 0, veh.h);
        // veh.d ? veh.dimension = veh.d : veh.dimension = 0;
        // veh.setVariable('engine', false);
        // veh.setVariable("leftTurnSignal", false);
        // veh.setVariable("rightTurnSignal", false);
        // veh.setVariable("hood", false);
        // veh.setVariable("trunk", false);
        clearInterval(veh.fuelTimer);
        this.spawnVehicle(veh, 1);
        veh.destroy();
    },
    async loadVehiclesFromDB() { /// Загрузка автомобилей фракций/работ из БД
        var dbVehicles = await db.Models.Vehicle.findAll({
            where: {
                key: {
                    [Op.or]: ["newbie", "faction", "job", "farm"]
                }
            }
        });
        for (var i = 0; i < dbVehicles.length; i++) {
            var veh = dbVehicles[i];
            this.spawnVehicle(veh, 0);
        }
        console.log(`[VEHICLES] Загружено транспортных средств: ${i}`);
    },
    async loadVehiclePropertiesFromDB() {
        dbVehicleProperties = await db.Models.VehicleProperties.findAll();
        console.log(`[VEHICLES] Загружено характеристик моделей транспорта: ${dbVehicleProperties.length}`);
    },
    setFuel(vehicle, litres) {
        if (litres < 1) return;
        vehicle.fuel = litres;
    },
    addFuel(vehicle, litres) {
        if (litres < 1) return;
        vehicle.fuel = vehicle.fuel + litres;
    },
    setVehiclePropertiesByModel(modelName) {
        for (let i = 0; i < dbVehicleProperties.length; i++) {
            if (dbVehicleProperties[i].model == modelName) {
                var properties = {
                    name: dbVehicleProperties[i].name,
                    maxFuel: dbVehicleProperties[i].maxFuel,
                    consumption: dbVehicleProperties[i].consumption,
                    license: dbVehicleProperties[i].license,
                    price: dbVehicleProperties[i].price,
                    vehType: dbVehicleProperties[i].vehType
                }
                if (properties.name == null) properties.name = modelName;
                return properties;
            }
        }

        var properties = {
            name: modelName,
            maxFuel: 50,
            consumption: 2,
            license: 1,
            price: 100000,
            vehType: 0
        }

        return properties;
    },
    async updateMileage(player) {
        if (!player.vehicle) return;
        let veh = player.vehicle;

        if (veh.sqlId) {
            try {
                var value = parseInt(veh.mileage);
                if ((veh.lastMileage - value) == 0) return;
                veh.lastMileage = value;
                await veh.db.update({
                    mileage: value,
                    fuel: Math.ceil(veh.fuel)
                });
                console.log(`[DEBUG] Обновили пробег для ${veh.properties.name}. Текущий пробег: ${veh.mileage}. К занесению: ${value} км и ${Math.ceil(veh.fuel)} л`);
            } catch (err) {
                console.log(err);
            }
        }
    },
    async loadPrivateVehicles(player) {
        var dbPrivate = await db.Models.Vehicle.findAll({
            where: {
                key: "private",
                owner: player.character.id
            },
            // include: [{
            //     model: db.Models.VehicleTuning
            // }]
        });
        player.vehicleList = [];
        let temp = 0;
        dbPrivate.forEach((current) => {
            //if (temp > 3) return; // TEMP!!!
            let props = this.setVehiclePropertiesByModel(current.modelName);
            player.vehicleList.push({
                id: current.id,
                name: props.name,
                plate: current.plate,
                regDate: current.regDate,
                owners: current.owners,
                vehType: props.vehType,
                price: props.price,
                isOnParking: current.isOnParking
            });
            temp++;
        });
        console.log(`[VEHICLES] Для игрока ${player.character.name} загружено ${dbPrivate.length} авто`)
        if (houses.isHaveHouse(player.character.id)) {
            await this.setPlayerCarPlaces(player);
        }
        if (dbPrivate.length > 0) {
            let parkingVeh = dbPrivate.find(x => x.isOnParking);

            if (parkingVeh) {
                mp.events.call('parkings.vehicle.add', parkingVeh);
                mp.events.call('parkings.notify', player, parkingVeh, 0);
            }

            if (houses.isHaveHouse(player.character.id)) {
                let length = player.carPlaces.length != 1 ? player.carPlaces.length - 1 : player.carPlaces.length;
                for (let i = 0; i < length; i++) {
                    if (i >= dbPrivate.length) return;
                    if (!dbPrivate[i].isOnParking) {
                        this.spawnHomeVehicle(player, dbPrivate[i]);
                    }
                }
            }
        }
    },
    async loadCarPlates() {
        let carPlatesDB = await db.Models.Vehicle.findAll({
            attributes: ['plate'],
            raw: true
        });
        for (var i = 0; i < carPlatesDB.length; i++) {
            plates.push(carPlatesDB[i].plate);
        }
        console.log(`[VEHICLES] Гос. номеров загружено: ${i}`);
    },

    generateVehiclePlate() {
        let abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let letters = "";
        while (letters.length < 3) {
            letters += abc[Math.floor(Math.random() * abc.length)];
        }
        let number = utils.randomInteger(100, 999);
        let plate = letters + number.toString();

        if (plates.includes(plate)) return this.generateVehiclePlate();
        plates.push(plate);
        return plate;
    },
    initMultiplier(veh) {
        if (veh.key == 'admin') return 1;
        let multiplier = 1;
        let mileage = veh.mileage;
        let destroys = veh.destroys ? veh.destroys : 0;
        if (mileage < 10) multiplier += 0.01;
        if (mileage >= 10 && mileage < 100) multiplier += 0.05;
        if (mileage >= 100 && mileage < 300) multiplier += 0.1;
        if (mileage >= 300 && mileage < 500) multiplier += 0.2;
        if (mileage >= 500 && mileage < 1000) multiplier += 0.4;
        if (mileage >= 1000 && mileage < 2000) multiplier += 0.5;
        if (mileage >= 2000 && mileage < 4000) multiplier += 0.7;
        if (mileage >= 4000 && mileage < 10000) multiplier += 1;
        if (mileage >= 10000) multiplier += 1.2;

        multiplier += 0.01 * destroys;
        return multiplier;
    },
    generateBreakdowns(veh) {
        if (!veh) return;
        let multiplier = veh.multiplier;
        //let multiplier = 10;
        let toUpdate = false;
        for (let key in breakdownConfig) {
            if (veh[key] < MAX_BREAK_LEVEL) {
                console.log(`[DEBUG] Пытаемся сломать ${key} у ${veh.properties.name}`);
                let random = Math.random();
                console.log(random);
                if (random < breakdownConfig[key] * multiplier) {
                    veh[key]++;
                    toUpdate = true;
                    console.log(`[DEBUG] сломали ${key}`);
                }
            }
        }
        if (toUpdate) {
            if (veh.db) {
                veh.db.update({
                    engineState: veh.engineState,
                    fuelState: veh.fuelState,
                    steeringState: veh.steeringState,
                    brakeState: veh.brakeState
                });
            }
        }
    },
    getVehicleBySqlId(sqlId) {
        if (!sqlId) return null;
        var result;
        mp.vehicles.forEach((veh) => {
            if (veh.sqlId == sqlId) {
                result = veh;
                return;
            }
        });
        return result;
    },
    spawnHomeVehicles(player, vehicles) {

    },
    updateConsumption(vehicle) {
        if (!vehicle) return;
        try {
            clearInterval(vehicle.fuelTimer);

            let multiplier = vehicle.multiplier;
            vehicle.consumption = vehicle.properties.consumption * multiplier;
            vehicle.fuelTick = 60000 / vehicle.consumption;

            vehicle.fuelTimer = setInterval(() => {
                try {
                    if (vehicle.engine) {

                        vehicle.fuel = vehicle.fuel - 1;
                        if (vehicle.fuel <= 0) {
                            vehicle.engine = false;
                            vehicle.setVariable("engine", false);
                            vehicle.fuel = 0;
                            return;
                        }
                    }
                } catch (err) {
                    console.log(err);
                }
            }, vehicle.fuelTick);
        } catch (err) {
            console.log(err);
        }
    },
    getVehiclePosition(vehicle) {
        let data = {
            x: vehicle.position.x,
            y: vehicle.position.y,
            z: vehicle.position.z,
            h: vehicle.heading
        }
        return data;
    },
    removeVehicleFromPlayerVehicleList(player, vehId) {
        if (!player) return;

        for (let i = 0; i < player.vehicleList.length; i++) {
            if (player.vehicleList[i].id == vehId) {
                player.vehicleList.splice(i, 1);
                return;
            }
        }
    },
    setPlayerCarPlaces(player) {
        if (!houses.isHaveHouse(player.character.id)) player.carPlaces = null;


        let places = houses.getHouseCarPlaces(player.character.id);
        places.forEach((current) => {
            current.veh = null;
        });
        player.carPlaces = places;
    },
    spawnHomeVehicle(player, vehicle) {
        if (player.carPlaces.length == 1 && player.carPlaces[0].d == 0) { // TODO ПРОВЕРИТЬ С БИЧ ДОМОМ

            let place = player.carPlaces[0];
            vehicle.x = place.x;
            vehicle.y = place.y;
            vehicle.z = place.z;
            vehicle.h = place.h;
            vehicle.d = place.d;
            place.veh = vehicle;
            vehicle.isInGarage = false;

        } else {
            let index = player.carPlaces.findIndex(x => x.veh == null && x.d != 0);
            let place = player.carPlaces[index];
            vehicle.carPlaceIndex = index;
            vehicle.x = place.x;
            vehicle.y = place.y;
            vehicle.z = place.z;
            vehicle.h = place.h;
            vehicle.d = place.d;
            place.veh = vehicle;
            vehicle.isInGarage = true;
        }


        vehicle.db ? this.spawnVehicle(vehicle, 1) : this.spawnVehicle(vehicle, 0);
    },
    removeVehicleFromCarPlace(player, vehicle) {
        if (!vehicle) return;
        if (!player.carPlaces) return;
        if (vehicle.isOnParking) return;

        let place = player.carPlaces[vehicle.carPlaceIndex];

        if (!place) return;
        place.veh = null;
    },
    setVehicleHomeSpawnPlace(player) {
        if (!player) return;
        if (!player.vehicle) return;
        let vehicle = player.vehicle;

        let index = player.carPlaces.findIndex(x => x.veh == null && x.d != 0);

        if (player.carPlaces.length == 1 && player.carPlaces[0].d == 0) { // TODO ПРОВЕРИТЬ С БИЧ ДОМОМ
            index = 0;
        }

        let place = player.carPlaces[index];
        vehicle.carPlaceIndex = index;
        vehicle.x = place.x;
        vehicle.y = place.y;
        vehicle.z = place.z;
        vehicle.h = place.h;
        vehicle.d = place.d;
        place.veh = vehicle;
    },
    isAbleToBuyVehicle(player) {
        let hasHouse = houses.isHaveHouse(player.character.id);
        if (!hasHouse) {
            if (player.vehicleList.length > 1) return false;
        } else {
            if (player.carPlaces.length > 1 && player.vehicleList.length + 1 > player.carPlaces.length - 1) return false;
            if (player.carPlaces.length == 1 && player.vehicleList.length >= player.carPlaces.length) return false;
        }
        return true;
    },
    doesPlayerHaveHomeVehicles(player) {
        let list = player.vehicleList;
        let result = list.filter(x => x.isOnParking == 0);
        if (result.length > 0) return true
        else return false;
    },
    async initTuning(vehicle) {
        let tuning = await db.Models.VehicleTuning.findOrCreate({
            where: {
                vehicleId: vehicle.sqlId
            }
        });
        vehicle.tuning = tuning[0];
    }
}
