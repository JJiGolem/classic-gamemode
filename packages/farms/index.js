"use strict";

let inventory = call('inventory');
let jobs = call('jobs');
let money = call('money');
let timer = call('timer');
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
    // Требуемые скиллы для работы на должности
    jobExps: [0, 1, 2, 10],
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
    growthTime: 20 * 60 * 1000,
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
    // Коэффициент при продаже фермы в штат (farmPrice * farmSellK)
    farmSellK: 0.8,
    // Макс. баланс налога
    taxBalanceMax: 10000,
    // Налог в час
    tax: 50,
    // Кол-во опыта за 1 куст
    exp: 0.01,

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
            if (player.vehicle) return;
            player.call(`selectMenu.show`, [`farm`]);
            var data = {
                id: farm.id,
                owner: (farm.owner) ? farm.owner.name : null,
                balance: farm.balance,
                taxBalance: farm.taxBalance,
                pay: farm.pay,
                farmerPay: farm.farmerPay,
                tractorPay: farm.tractorPay,
                pilotPay: farm.pilotPay,
                fields: farm.fields.length,
                price: farm.price,
            };
            if (player.character.id == farm.playerId) {
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
                data.statePrice = parseInt(farm.price * this.farmSellK);
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
                grainPrice: farm.grainPrice,
                productA: farm.productA,
                productB: farm.productB,
                productC: farm.productC,
                productAPrice: farm.productAPrice,
                productBPrice: farm.productBPrice,
                productCPrice: farm.productCPrice,
                grainsMax: this.grainsMax,
                productsMax: this.productsMax,
                fieldIds: farm.fields.map(x => x.id),
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
        var colshape = mp.colshapes.newSphere(pos.x, pos.y, pos.z + 2, 3);
        colshape.onEnter = (player) => {
            player.call(`selectMenu.show`, [`farmSoilsWarehouse`]);
            player.call(`farms.soilsWarehouse.info.set`, [{
                soils: farm.soils,
                soilPrice: farm.soilPrice,
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
        inventory.clearAllView(player);
        player.inventory.denyUpdateView = enable;
        if (enable) {
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
            new mp.Vector3(1982.4197998046875, 5020.7783203125, 42.205257415771484 - 2),
            new mp.Vector3(410.41259765625, 6455.1552734375, 28.809022903442383 - 2),
        ];
        farmId = Math.clamp(farmId, 1, positions.length);
        return positions[farmId - 1];
    },
    getSoilsWarehousePosByFarmId(farmId) {
        var positions = [
            new mp.Vector3(2104.8779296875, 4785.744140625, 41.21879959106445 - 2),
            new mp.Vector3(469.9630126953125, 6526.43505859375, 29.309743881225586 - 2),
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
            point.z = field.p1.z + 1;
            route[k] = point;
            k += 2;
        });
        k = 1;
        pointsRight.forEach((point) => {
            point.z = field.p1.z + 1;
            route[k] = point;
            k += 2;
        });
        return route;
    },
    getPilotPoints(farm) {
        var points = [
            [
                new mp.Vector3(2090.642822265625, 4791.0380859375, 41.06044387817383),
                new mp.Vector3(2050.44677734375, 4773.1884765625, 41.06514358520508),
                new mp.Vector3(2001.443603515625, 4749.4453125, 41.06047821044922),
                new mp.Vector3(1955.3023681640625, 4728.11083984375, 41.06528091430664),
                new mp.Vector3(1914.87060546875, 4708.4716796875, 41.34502029418945),
                new mp.Vector3(1819.9908447265625, 4653.00146484375, 37.763179779052734),
                new mp.Vector3(1749.459228515625, 4675.36279296875, 44.00497055053711),
                new mp.Vector3(1788.14599609375, 4760.419921875, 40.28403854370117),
                new mp.Vector3(1871.528564453125, 4813.0458984375, 45.05659484863281),
                new mp.Vector3(1966.951904296875, 4870.236328125, 45.468971252441406),
                new mp.Vector3(2003.7847900390625, 4903.142578125, 42.77552032470703),
                new mp.Vector3(2048.97216796875, 4953.45654296875, 40.96768569946289),
                new mp.Vector3(2111.275634765625, 5097.65283203125, 46.71536636352539),
                new mp.Vector3(2209.676025390625, 5130.552734375, 53.69499206542969),
                new mp.Vector3(2272.67529296875, 5121.6875, 51.33568572998047),
                new mp.Vector3(2249.429443359375, 5046.5380859375, 44.653648376464844),
                new mp.Vector3(2176.230224609375, 5001.357421875, 41.648277282714844),
                new mp.Vector3(2072.47705078125, 4913.0673828125, 41.085052490234375),
                new mp.Vector3(2014.7940673828125, 4882.927734375, 42.888336181640625),
                new mp.Vector3(1924.393798828125, 4841.20703125, 46.36700439453125),
                new mp.Vector3(1818.208984375, 4867.21875, 41.570648193359375),
                new mp.Vector3(1706.7135009765625, 4799.94970703125, 41.805519104003906),
                new mp.Vector3(1727.8955078125, 4715.150390625, 42.08133316040039),
                new mp.Vector3(1796.1060791015625, 4660.0517578125, 40.08576965332031),
                new mp.Vector3(1914.87060546875, 4708.4716796875, 41.34502029418945),
                new mp.Vector3(1955.3023681640625, 4728.11083984375, 41.06528091430664),
                new mp.Vector3(2001.443603515625, 4749.4453125, 41.06047821044922),
                new mp.Vector3(2050.44677734375, 4773.1884765625, 41.06514358520508),
                new mp.Vector3(2090.642822265625, 4791.0380859375, 41.06044387817383),
                new mp.Vector3(2132.9755859375, 4782.25, 40.97028732299805),
            ]
        ];
        var start = 5; // первые 5 точек - на разгон самолета
        var deltaZ = [70, 80]; // высота полета
        var list = points[farm.id - 1].slice();
        for (var i = start; i < list.length - start; i++) {
            list[i].z = utils.randomInteger(deltaZ[0], deltaZ[1]);
        }
        return list;
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

        var timerId = timer.addInterval(() => {
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
                    timer.remove(timerId);
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
    pay(player) {
        if (!player.farmJob || !player.farmJob.pay) return;

        var farm = player.farmJob.farm;
        if (farm.playerId) {
            if (farm.balance < player.farmJob.pay) return;
            else {
                farm.balance -= player.farmJob.pay;
                farm.save();
                money.addCash(player, player.farmJob.pay * jobs.bonusPay, (res) => {
                    if (!res) return;
                }, `Зарплата на ферме #${farm.id} x${jobs.bonusPay}`);
            }
        } else {
            money.addCash(player, player.farmJob.pay * jobs.bonusPay, (res) => {
                if (!res) return;
            }, `Зарплата на ферме #${farm.id} без владельца x${jobs.bonusPay}`);
        }
    }
};
