"use strict";

let inventory = call('inventory');
let utils = call('utils');

module.exports = {
    // Фермы
    farms: [],
    // Маркеры ферм
    markers: [],
    // Блипы ферм
    blips: [],
    // Должности
    jobNames: ["Рабочий", "Фермер", "Тракторист", "Пилот"],
    // Модели авто и их типы работ
    vehModels: {
        "bodhi2": 1,
        "rebel": 1,
        "tractor2": 2,
        "duster": 3,
    },
    // Объекты урожая на поле
    fieldObjects: {},
    // Время сбора одного 1 ед. урожая (ms)
    takeCropTime: 1000,

    async init() {
        await this.loadFarmsFromDB();
        this.initFarmMarkers();
    },
    async loadFarmsFromDB() {
        var dbFarms = await db.Models.Farm.findAll({
            include: [{
                model: db.Models.FarmField,
                as: "fields"
            }]
        });
        this.farms = dbFarms;
        console.log(`[FARMS] Фермы загужены (${dbFarms.length} шт.)`);
    },
    initFarmMarkers() {
        for (var i = 0; i < this.farms.length; i++) {
            var farm = this.farms[i];
            this.createFarmMarker(farm);
            this.initFarmWarehouse(farm);
            this.initFarmLabels(farm);
            this.initFarmFieldObjects(farm);
        }
    },
    initFarmFieldObjects(farm) {
        for (var i = 0; i < farm.fields.length; i++) {
            var field = farm.fields[i];
            var count = field.count;
            var objPositions = this.getObjPositions(field);
            this.fieldObjects[field.id] = [];
            for (var j = 0; j < objPositions.length; j++) {
                var fieldCount = Math.clamp(parseInt(600 / objPositions.length), 0, count);
                count -= fieldCount;
                if (fieldCount <= 0) break;
                objPositions[j].z = field.p1.z;
                var object = mp.objects.new(mp.joaat("prop_veg_crop_04"), objPositions[j], {
                    rotation: new mp.Vector3(0, 0, 0),
                    alpha: 255,
                    heading: 90
                });
                object.count = fieldCount;
                object.field = field;
                this.fieldObjects[field.id].push(object);
            }
        }
    },
    createFarmMarker(farm) {
        var pos = new mp.Vector3(farm.x, farm.y, farm.z - 1);
        var marker = mp.markers.new(1, pos, 0.5, {
            color: [255, 187, 0, 70]
        });
        var colshape = mp.colshapes.newSphere(pos.x, pos.y, pos.z, 1.5);
        colshape.onEnter = (player) => {
            player.call(`selectMenu.show`, [`farm`]);
            player.farm = farm;
        };
        colshape.onExit = (player) => {
            player.call(`selectMenu.hide`);
            delete player.farm;
        };
        marker.colshape = colshape;
        this.markers.push(marker);
        this.blips.push(mp.blips.new(88, pos, {
            color: 60,
            name: `Ферма #${farm.id}`,
            shortRange: 10,
            scale: 1
        }));
    },
    initFarmWarehouse(farm) {

    },
    initFarmLabels(farm) {

    },
    setJobClothes(player, enable, job) {
        if (enable) {
            inventory.clearAllView(player);
            player.inventory.denyUpdateView = true;
            var textures = [6, 0, 8, 4];
            if (player.character.gender == 0) {
                var torsos = [41, 63, 74];
                var torso = torsos[utils.randomInteger(0, torsos.length - 1)];
                player.setProp(0, 13, 1);
                player.setClothes(11, 56, 0, 0);
                player.setClothes(3, torso, 0, 0);
                player.setClothes(4, 90, textures[job], 0);
                player.setClothes(6, 51, 4, 0);
            } else {
                var torsos = [72, 85, 114];
                var torso = torsos[utils.randomInteger(0, torsos.length - 1)];
                player.setProp(0, 20, 0);
                player.setClothes(11, 0, 0, 0);
                player.setClothes(3, torso, 0, 0);
                player.setClothes(4, 93, textures[job], 0);
                player.setClothes(6, 64, 2, 0);
            }
        } else {
            // TODO: Clear Clothes.
            player.inventory.denyUpdateView = false;
            inventory.clearAllView(player);
            inventory.updateAllView(player);
        }
    },
    getJobName(jobType) {
        jobType = Math.clamp(jobType, 0, this.jobNames.length - 1);
        return this.jobNames[jobType];
    },
    getJobTypeByVehModel(model) {
        if (!this.vehModels[model]) return -1;
        return this.vehModels[model];
    },
    getObjPositions(field) {
        var step = 5;
        var pointsLeft = utils.getPointsOnInterval(field.p1, field.p3, 5);
        var pointsRight = utils.getPointsOnInterval(field.p2, field.p4, 5);
        if (pointsLeft.length > pointsRight.length) pointsLeft.splice(pointsRight.length);
        if (pointsLeft.length < pointsRight.length) pointsRight.splice(pointsLeft.length);

        var objPositions = [];
        for (var i = 0; i < pointsLeft.length; i++) {
            var points = utils.getPointsOnInterval(pointsLeft[i], pointsRight[i], 5);
            objPositions = objPositions.concat(points);
        }
        return objPositions;
    },
    addVehicleProducts(vehicle, type, count) {
        // TODO: Синхра объектов в кузове
        
    }
};
