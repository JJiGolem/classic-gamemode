"use strict";

var dbVehicleProperties;
var plates = [];
let inventory = call('inventory');
let utils = call('utils');
let timer = call('timer');
let tuning = call('tuning');

const MAX_BREAK_LEVEL = 2;
const NO_BREAK_DAYS = 2;

let breakdownConfig = {
    engineState: 0.001,
    fuelState: 0.004,
    steeringState: 0.003,
    brakeState: 0.001
};

let houses;

// vehtypes:
// 0 - автомобиль
// 1 - мотоцикл
// 2 - велосипед
// 3 - электромобиль

module.exports = {
    // Время простоя авто, после которого оно будет заспавнено (ms) - точность ~0-5 мин
    vehWaitSpawn: 20 * 60 * 1000,
    // Кол-во топлива при респавне авто (кроме рабочих - в них всегда полный бак)
    respawnFuel: 10,
    ownVehicleRespawnPrice: 300,


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
        vehicle.fuel = veh.fuel;
        vehicle.mileage = veh.mileage;
        vehicle.parkingId = veh.parkingId;
        vehicle.parkingDate = veh.parkingDate;
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

        vehicle.setVariable('isValid', true);

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
            if (!veh.inventory) {
                inventory.initVehicleInventory(vehicle);
            } else {
                vehicle.inventory = veh.inventory;
            }
        }
        if (!veh.properties) {
            vehicle.properties = this.getVehiclePropertiesByModel(veh.modelName);
        } else {
            vehicle.properties = veh.properties;
        }

        if (veh.key == 'job' || veh.key == 'newbie') {
            vehicle.fuel = vehicle.properties.maxFuel;
        }

        if (veh.key == 'rent') {
            vehicle.fuel = parseInt(vehicle.properties.maxFuel / 2);
        }

        if (veh.key == 'private' || veh.key == 'market') { // temp
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

        vehicle.fuelTimer = timer.addInterval(() => {
            try {
                if (!mp.vehicles.exists(vehicle)) return timer.remove(vehicle.fuelTimer);
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
        return this.getOccupants(vehicle).find(x => x.seat == -1);
    },
    respawnVehicle(veh) {
        if (!mp.vehicles.exists(veh)) return;
        timer.remove(veh.fuelTimer);
        if (veh.key == "admin") { /// Если админская, не респавним
            veh.destroy();
            return;
        }

        if (veh.key == "private") {

            let owner = mp.players.toArray().find(x => {
                if (!x.character) return;
                if (x.character.id == veh.owner) return true;
            });

            if (!houses.isHaveHouse(owner.character.id)) {
                mp.events.call('parkings.vehicle.add', veh);
                veh.destroy();
                owner.call('chat.message.push', ['!{#ffcb5c}Транспорт доставлен на парковку, отмеченную на карте !{#e485e6}розовым']);
                return;
            }
            if (veh.carPlaceIndex == null || !veh.hasOwnProperty('carPlaceIndex')) {
                let index = owner.carPlaces.findIndex(x => x.veh == null && x.d != 0);

                if (owner.carPlaces.length == 1 && owner.carPlaces[0].d == 0) {
                    index = 0;
                }

                let place = owner.carPlaces[index];
                veh.carPlaceIndex = index;
                veh.x = place.x;
                veh.y = place.y;
                veh.z = place.z;
                veh.h = place.h;
                veh.d = place.d;
                place.veh = veh;
                veh.isInGarage = true;
            }
            if (veh.hasOwnProperty('carPlaceIndex')) {
                veh.isInGarage = true;
            }
            if (owner.carPlaces.length == 1 && owner.carPlaces[0].d == 0) {
                veh.isInGarage = false;
            }
        }
        mp.events.call('vehicles.respawn.full', veh);
        this.spawnVehicle(veh, 1);
        veh.destroy();
    },
    async loadVehiclesFromDB() { /// Загрузка автомобилей фракций/работ из БД
        var dbVehicles = await db.Models.Vehicle.findAll({
            where: {
                key: {
                    [Op.or]: ["newbie", "faction", "job", "farm"]
                }
            },
            include: {
                as: "minRank",
                model: db.Models.FactionVehicleRank
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
        if (vehicle.db) {
            vehicle.db.fuel = litres;
            vehicle.db.save();
        }
    },
    addFuel(vehicle, litres) {
        if (litres < 1) return;
        if (vehicle.db) {
            vehicle.db.fuel = vehicle.fuel + litres;
            vehicle.db.save();
        }
        vehicle.fuel = vehicle.fuel + litres;
    },
    getVehiclePropertiesByModel(modelName) {
        for (let i = 0; i < dbVehicleProperties.length; i++) {
            if (dbVehicleProperties[i].model == modelName) {
                var properties = {
                    name: dbVehicleProperties[i].name,
                    maxFuel: dbVehicleProperties[i].maxFuel,
                    consumption: dbVehicleProperties[i].consumption,
                    license: dbVehicleProperties[i].license,
                    price: dbVehicleProperties[i].price,
                    vehType: dbVehicleProperties[i].vehType,
                    isElectric: dbVehicleProperties[i].isElectric
                }
                if (properties.name == null) properties.name = modelName;
                return properties;
            }
        }

        var properties = {
            name: modelName,
            maxFuel: 80,
            consumption: 1.5,
            license: 1,
            price: 100000,
            vehType: 0,
            isElectric: 0
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
        });
        player.vehicleList = [];
        dbPrivate.forEach((current) => {
            let props = this.getVehiclePropertiesByModel(current.modelName);
            player.vehicleList.push({
                id: current.id,
                name: props.name,
                plate: current.plate,
                regDate: current.regDate,
                owners: current.owners,
                vehType: props.vehType,
                price: props.price,
                parkingDate: current.parkingDate
            });
        });
        console.log(`[VEHICLES] Для игрока ${player.character.name} загружено ${dbPrivate.length} авто`)
        let hasHouse = houses.isHaveHouse(player.character.id);
        if (hasHouse) {
            await this.setPlayerCarPlaces(player);
        }
        if (dbPrivate.length > 0) {

            if (hasHouse) {
                let parkingVeh = dbPrivate.find(x => x.parkingDate);

                if (parkingVeh) {
                    mp.events.call('parkings.vehicle.add', parkingVeh);
                    mp.events.call('parkings.notify', player, parkingVeh, 0);
                }

                // if (houses.isHaveHouse(player.character.id)) {
                let length = player.carPlaces.length != 1 ? player.carPlaces.length - 1 : player.carPlaces.length;
                for (let i = 0; i < length; i++) {
                    if (i >= dbPrivate.length) return;
                    if (!dbPrivate[i].parkingDate) {
                        this.spawnHomeVehicle(player, dbPrivate[i]);
                        //   }
                    }
                }
            } else {
                let veh = dbPrivate[0];
                if (dbPrivate[0].parkingDate == null) {
                    let now = new Date();
                    dbPrivate[0].update({
                        parkingDate: now
                    });
                }
                mp.events.call('parkings.vehicle.add', veh);
                mp.events.call('parkings.notify', player, veh, 0);
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
        if (veh.properties.isElectric) return;
        if (veh.regDate) {
            let date = veh.regDate;
            let now = new Date();
            let diff = (now - date) / (1000 * 60 * 60 * 24);
            if (diff < NO_BREAK_DAYS) return;
        }
        if (veh.mileage < 4000) return;
        if (veh.properties.price > 100000 && veh.mileage < 8000) return;
        if (veh.properties.price > 1000000 && veh.mileage < 12000) return;

        let toUpdate = false;
        for (let key in breakdownConfig) {
            if (veh[key] < MAX_BREAK_LEVEL) {
                //console.log(`[DEBUG] Пытаемся сломать ${key} у ${veh.properties.name}`);
                let random = Math.random();
                if (random < breakdownConfig[key] * multiplier) {
                    veh[key]++;
                    toUpdate = true;
                    //console.log(`[DEBUG] сломали ${key}`);
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
    updateConsumption(vehicle) {
        if (!vehicle) return;
        try {
            timer.remove(vehicle.fuelTimer);

            let multiplier = vehicle.multiplier;
            vehicle.consumption = vehicle.properties.consumption * multiplier;
            vehicle.fuelTick = 60000 / vehicle.consumption;

            vehicle.fuelTimer = timer.addInterval(() => {
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
        if (vehicle.parkingDate) return;

        let place = player.carPlaces[vehicle.carPlaceIndex];

        if (!place) return;
        place.veh = null;
    },
    setVehicleHomeSpawnPlace(player) {
        if (!player) return;
        if (!player.vehicle) return;
        let vehicle = player.vehicle;

        let index = player.carPlaces.findIndex(x => x.veh == null && x.d != 0);

        if (player.carPlaces.length == 1 && player.carPlaces[0].d == 0) {
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
    setVehicleHomeSpawnPlaceByVeh(player, vehicle) {
        if (!player) return;
        if (!vehicle) return;

        let index = player.carPlaces.findIndex(x => x.veh == null && x.d != 0);

        if (player.carPlaces.length == 1 && player.carPlaces[0].d == 0) {
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
            if (player.vehicleList.length >= 1) return false;
        } else {
            if (player.carPlaces.length > 1 && player.vehicleList.length + 1 > player.carPlaces.length - 1) return false;
            if (player.carPlaces.length == 1 && player.vehicleList.length >= player.carPlaces.length) return false;
        }
        return true;
    },
    doesPlayerHaveHomeVehicles(player) {
        let list = player.vehicleList;
        let result = list.filter(x => x.parkingDate == null);
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
    },
    async parseVehicles() {
        var dbVehicles = await db.Models.OldVeh.findAll({
            where: {
                key: {
                    [Op.or]: ["faction", "job", "farm", "market"]
                }
            }
        });
        for (var i = 0; i < dbVehicles.length; i++) {
            var veh = dbVehicles[i];
            await db.Models.Vehicle.create({
                key: veh.key,
                owner: veh.owner,
                modelName: veh.modelName,
                plate: veh.plate,
                regDate: veh.regDate,
                owners: veh.owners,
                color1: veh.color1,
                color2: veh.color2,
                x: veh.x,
                y: veh.y,
                z: veh.z,
                h: veh.h
            });
        }
    },
    // Имеет ли игрок ключи от авто
    haveKeys(player, vehicle) {
        var items = inventory.getItemsByParams(player.inventory.items, 33, ['vehId', 'owner'], [vehicle.db.id, vehicle.db.owner]);
        return items.length > 0;
    },
    // Получить всех игроков в авто
    getOccupants(vehicle) {
        var occupants = vehicle.getOccupants();
        mp.players.forEachInRange(vehicle.position, 10, rec => {
            if (!rec.vehicle) return;
            if (rec.vehicle.id != vehicle.id) return;
            if (occupants.find(x => x.id == rec.id)) return;
            occupants.push(rec);
        });
        // Обходим баги рейджа через проверку на player.vehicle в радиусе авто
        return occupants;
    },
    // Убито ли авто
    isDead(vehicle) {
        return !vehicle.engineHealth || !vehicle.bodyHealth || vehicle.dead;
    },
    getVehiclePropertiesList() {
        return dbVehicleProperties;
    },
    respawn(veh) {
        if (veh.getVariable("robbed")) veh.setVariable("robbed", null);
        var fuel = (veh.db.key == 'job' || veh.db.key == 'newbie') ? veh.properties.maxFuel : Math.max(veh.db.fuel, this.respawnFuel);

        veh.engine = false;
        veh.setVariable("engine", false);

        veh.repair();
        veh.position = new mp.Vector3(veh.db.x, veh.db.y, veh.db.z);
        veh.rotation = new mp.Vector3(0, 0, veh.db.h);
        veh.setVariable("heading", veh.db.h);
        this.setFuel(veh, fuel);
        delete veh.lastPlayerTime;
        mp.events.call("vehicle.respawned", veh);
    },
    // Вкл/откл управление авто игроку
    disableControl(player, enable) {
        if (enable) player.vehicleDisabledControl = true;
        else delete player.vehicleDisabledControl;
        player.call(`vehicles.disableControl`, [enable]);
    }
}
