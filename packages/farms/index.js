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
    // Склады ферм
    warehouses: [],
    // Склады ферм с удобрением
    soilsWarehouse: [],
    // Должности
    jobNames: ["Работник", "Фермер", "Тракторист", "Пилот"],
    // Муж. рабочая одежда
    maleClothes: [
        [{
                type: "Clothes",
                params: [3, 41, 0],
            },
            {
                type: "Clothes",
                params: [4, 97, 4],
            },
            {
                type: "Clothes",
                params: [6, 27, 0],
            },
            {
                type: "Clothes",
                params: [11, 56, 0],
            },
            {
                type: "Prop",
                params: [0, 58, 0],
            },
        ],
        [{
                type: "Clothes",
                params: [3, 0, 0],
            },
            {
                type: "Clothes",
                params: [4, 97, 4],
            },
            {
                type: "Clothes",
                params: [6, 27, 0],
            },
            {
                type: "Clothes",
                params: [8, 81, 0],
            },
            {
                type: "Clothes",
                params: [11, 179, 2],
            },
        ],
        [{
                type: "Clothes",
                params: [3, 41, 1],
            },
            {
                type: "Clothes",
                params: [4, 97, 4],
            },
            {
                type: "Clothes",
                params: [6, 27, 0],
            },
            {
                type: "Clothes",
                params: [8, 59, 0],
            },
            {
                type: "Clothes",
                params: [11, 56, 0],
            },
            {
                type: "Prop",
                params: [11, 56, 0],
            },
        ],
        [{
                type: "Clothes",
                params: [3, 1, 0],
            },
            {
                type: "Clothes",
                params: [4, 97, 4],
            },
            {
                type: "Clothes",
                params: [6, 27, 0],
            },
            {
                type: "Clothes",
                params: [8, 2, 11],
            },
            {
                type: "Clothes",
                params: [11, 37, 1],
            },
            {
                type: "Prop",
                params: [0, 19, 0],
            },
            {
                type: "Prop",
                params: [1, 24, 0],
            },
        ]
    ],
    // Жен. рабочая одежда
    femaleClothes: [
        [{
                type: "Clothes",
                params: [3, 57, 0],
            },
            {
                type: "Clothes",
                params: [4, 100, 4],
            },
            {
                type: "Clothes",
                params: [6, 26, 0],
            },
            {
                type: "Clothes",
                params: [11, 49, 0],
            },
            {
                type: "Prop",
                params: [0, 58, 0],
            },
        ],
        [{
                type: "Clothes",
                params: [3, 14, 0],
            },
            {
                type: "Clothes",
                params: [4, 100, 4],
            },
            {
                type: "Clothes",
                params: [6, 26, 0],
            },
            {
                type: "Clothes",
                params: [8, 86, 6],
            },
            {
                type: "Clothes",
                params: [11, 154, 2],
            },
            {
                type: "Prop",
                params: [0, 20, 0],
            },
        ],
        [{
                type: "Clothes",
                params: [3, 57, 1]
            },
            {
                type: "Clothes",
                params: [4, 100, 4]
            },
            {
                type: "Clothes",
                params: [6, 26, 0]
            },
            {
                type: "Clothes",
                params: [8, 36, 0]
            },
            {
                type: "Clothes",
                params: [11, 49, 0]
            },
            {
                type: "Prop",
                params: [0, 58, 0]
            },
        ],
        [{
                type: "Clothes",
                params: [3, 3, 0],
            },
            {
                type: "Clothes",
                params: [4, 100, 4],
            },
            {
                type: "Clothes",
                params: [6, 26, 0],
            },
            {
                type: "Clothes",
                params: [8, 2, 0],
            },
            {
                type: "Clothes",
                params: [11, 55, 0],
            },
            {
                type: "Prop",
                params: [0, 19, 0],
            },
            {
                type: "Prop",
                params: [1, 26, 0],
            },
        ],
    ],
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
    takeCropTime: 7000,
    // Время созревания поля (ms)
    growthTime: 20000,
    // Вместимость зерна на складе
    grainsMax: 2000,
    // Вместимость урожая на складе (для каждого типа)
    productsMax: 800,
    // Вместимость удобрения на складе
    soilsMax: 1000,
    // Вместимость урожая на поле
    cropMax: 600 + 400, // 400 ед. для эффекта удобрения
    // Макс. цена за 1 ед. зерна/удобрения/урожая
    priceMax: 100,
    // Макс. ЗП для работника/фермера/тракториста/пилота
    payMax: 100,

    async init() {
        await this.loadFarmsFromDB();
        this.initFarmMarkers();
    },
    async loadFarmsFromDB() {
        var dbFarms = await db.Models.Farm.findAll({
            include: [{
                    model: db.Models.FarmField,
                    as: "fields"
                },
                {
                    model: db.Models.Character,
                    as: "owner",
                    attributes: ['name']
                }
            ]
        });
        this.farms = dbFarms;
        console.log(`[FARMS] Фермы загужены (${dbFarms.length} шт.)`);
    },
    initFarmMarkers() {
        for (var i = 0; i < this.farms.length; i++) {
            var farm = this.farms[i];
            this.createFarmMarker(farm);
            this.createFarmWarehouse(farm);
            this.createFarmSoilsWarehouse(farm);
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
            color: [255, 0, 0, 70]
        });
        var colshape = mp.colshapes.newSphere(pos.x, pos.y, pos.z, 1.5);
        colshape.onEnter = (player) => {
            player.call(`selectMenu.show`, [`farm`]);
            var data = {
                id: farm.id,
                owner: (farm.owner) ? farm.owner.name : null,
                pay: farm.pay,
                farmerPay: farm.farmerPay,
                tractorPay: farm.tractorPay,
                pilotPay: farm.pilotPay,
                fields: farm.fields.length,
            };
            if (player.character.id == farm.playerId) {
                data.price = farm.price;
                data.balance = farm.balance;
                data.taxBalance = farm.taxBalance;
                data.pay = farm.pay;
                data.farmerPay = farm.farmerPay;
                data.tractorPay = farm.tractorPay;
                data.pilotPay = farm.pilotPay;
                data.grainPrice = farm.grainPrice;
                data.soilPrice = farm.soilPrice;
                data.productAPrice = farm.productAPrice;
                data.productBPrice = farm.productBPrice;
                data.productCPrice = farm.productCPrice;
            }
            player.call(`farms.info.set`, [data]);
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
    createFarmWarehouse(farm) {
        var pos = this.getWarehousePosByFarmId(farm.id);
        var marker = mp.markers.new(1, pos, 3, {
            color: [187, 255, 0, 70],
        });
        var colshape = mp.colshapes.newSphere(pos.x, pos.y, pos.z + 2, 2);
        colshape.onEnter = (player) => {
            player.call(`selectMenu.show`, [`farmWarehouse`]);
            player.call(`farms.warehouse.info.set`, [{
                grains: farm.grains,
                productA: farm.productA,
                productB: farm.productB,
                productC: farm.productC,
                grainsMax: this.grainsMax,
                productsMax: this.productsMax,
            }]);
            player.farm = farm;
        };
        colshape.onExit = (player) => {
            player.call(`selectMenu.hide`);
            delete player.farm;
        };
        marker.colshape = colshape;
        this.warehouses.push(marker);
    },
    createFarmSoilsWarehouse(farm) {
        var pos = this.getSoilsWarehousePosByFarmId(farm.id);
        var marker = mp.markers.new(1, pos, 3, {
            color: [187, 255, 0, 70],
        });
        var colshape = mp.colshapes.newSphere(pos.x, pos.y, pos.z + 2, 2);
        colshape.onEnter = (player) => {
            player.call(`selectMenu.show`, [`farmSoilsWarehouse`]);
            player.call(`farms.soilsWarehouse.info.set`, [{
                soils: farm.soils,
                soilsMax: this.soilsMax,
            }]);
            player.farm = farm;
        };
        colshape.onExit = (player) => {
            player.call(`selectMenu.hide`);
            delete player.farm;
        };
        marker.colshape = colshape;
        this.soilsWarehouse.push(marker);
    },
    setJobClothes(player, enable, job) {
        if (enable) {
            inventory.clearAllView(player);
            player.inventory.denyUpdateView = true;
            if (player.character.gender == 0) {
                this.maleClothes[job].forEach(item => {
                    var params = item.params;
                    if (item.type == "Clothes") player.setClothes(params[0], params[1], params[2], 0);
                    else player.setProp(params[0], params[1], params[2]);
                });
            } else {
                this.femaleClothes[job].forEach(item => {
                    var params = item.params;
                    if (item.type == "Clothes") player.setClothes(params[0], params[1], params[2], 0);
                    else player.setProp(params[0], params[1], params[2]);
                });
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
    addVehicleProducts(vehicle, type) {
        if (!vehicle.products) vehicle.products = {
            type: type,
            count: 0
        };
        if (vehicle.products.type != type) return;

        vehicle.products.count++;
        vehicle.setVariable("label", `${vehicle.products.count} из 200 ед.`);
        // Синхра объектов в кузове
        if (vehicle.products.count % 33 == 0)
            vehicle.setVariable("farmProductsState", parseInt(vehicle.products.count / 33));
    },
    getWarehousePosByFarmId(farmId) {
        var positions = [
            new mp.Vector3(1982.4197998046875, 5020.7783203125, 42.205257415771484 - 2)
        ];
        farmId = Math.clamp(farmId, 1, positions.length);
        return positions[farmId - 1];
    },
    getSoilsWarehousePosByFarmId(farmId) {
        var positions = [
            new mp.Vector3(2104.150146484375, 4782.9306640625, 41.20178985595703 - 2)
        ];
        farmId = Math.clamp(farmId, 1, positions.length);
        return positions[farmId - 1];
    },
    getFarm(id) {
        return this.farms[id - 1];
    },
    getMarker(id) {
        return this.markers[id - 1];
    },
    getWarehouse(id) {
        return this.warehouses[id - 1];
    },
    getSoilsWarehouse(id) {
        return this.soilsWarehouse[id - 1];
    },
    getFillingPoints(field) {
        var pointsLeft = utils.getPointsOnInterval(field.p1, field.p3, 4);
        var pointsRight = utils.getPointsOnInterval(field.p2, field.p4, 4);
        if (pointsLeft.length > pointsRight.length) pointsLeft.splice(pointsRight.length);
        if (pointsLeft.length < pointsRight.length) pointsRight.splice(pointsLeft.length);
        var route = [];
        var k = 0;
        pointsLeft.forEach((point) => {
            point.z = field.p1.z - 1;
            route[k] = point;
            k += 2;
        });
        k = 1;
        pointsRight.forEach((point) => {
            point.z = field.p1.z - 1;
            route[k] = point;
            k += 2;
        });
        return route;
    },
    getPilotPoints(farm) {
        var points = [
            [new mp.Vector3(2081.72705078125, 4784.01513671875, 41.48800277709961),
                new mp.Vector3(2042.3280029296875, 4763.7509765625, 41.42406463623047),
                new mp.Vector3(1961.8079833984375, 4726.33447265625, 41.404598236083984),
                new mp.Vector3(1906.7515869140625, 4700.05712890625, 41.0810546875),
            ]
        ];
        return points[farm.id - 1];
    },
    fillField(field, crop) {
        if (field.count) return;
        if (this.fieldObjects[field.id]) {
            this.fieldObjects[field.id].forEach((object) => {
                object.destroy();
            });
        }
        field.type = Math.clamp(crop, 1, 3);
        field.count = 600;
        field.save();
        field.state = 0;
        this.fieldObjects[field.id] = [];

        var timerId = setInterval(() => {
            try {
                field.state++;
                if (field.state == 1) {
                    var objPositions = this.getObjPositions(field);
                    for (var i = 0; i < objPositions.length; i++) {
                        objPositions[i].z = field.p1.z - 0.5;
                        var object = mp.objects.new(mp.joaat("prop_veg_crop_04"), objPositions[i], {
                            rotation: new mp.Vector3(0, 0, 0),
                            alpha: 255,
                            heading: 90
                        });
                        object.count = parseInt(600 / objPositions.length);
                        object.field = field;
                        this.fieldObjects[field.id].push(object);
                    }
                    // debug(`Поле ${field.sqlId} проросло!`)
                } else if (field.state == 2) {
                    for (var i = 0; i < this.fieldObjects[field.id].length; i++) {
                        var pos = this.fieldObjects[field.id][i].position;
                        pos.z += 0.25;
                        this.fieldObjects[field.id][i].position = pos;
                    }
                    // debug(`Поле ${field.sqlId} почти созрело!`)
                } else if (field.state == 3) {
                    for (var i = 0; i < this.fieldObjects[field.id].length; i++) {
                        var pos = this.fieldObjects[field.id][i].position;
                        pos.z += 0.25;
                        this.fieldObjects[field.id][i].position = pos;
                    }

                    // debug(`Поле ${field.sqlId} созрело!`)
                    clearInterval(timerId);
                }
            } catch (e) {
                console.log(e);
            }
        }, this.growthTime / 3);
    },
    // удобрить поля фермы
    soilFields(farm) {
        var fields = farm.fields.filter(x => x.count && x.count < this.cropMax);
        var objects = [];
        fields.forEach(field => {
            var list = this.fieldObjects[field.id];
            objects = objects.concat(list);
        });
        var objSoils = 2;
        objects.forEach(obj => {
            obj.count += objSoils;
        });
    },
};
