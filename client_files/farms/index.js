"use strict";


/*
    Модуль ферм.

    created 07.09.19 by Carter Slade
*/

mp.farms = {
    jobType: null,
    vehAttachInfo: {
        0xAA699BB6: [
            [
                ["prop_haybale_01", 5, 0.01, -2.88, -0.26, 0, 0, 90],
            ],
            [
                ["prop_haybale_01", 5, 0.01, -2.88, -0.26, 0, 0, 90],
                ["prop_haybale_01", 5, 0.27, -2, -0.26, 0, 0, 0],
            ],
            [
                ["prop_haybale_01", 5, 0.01, -2.88, -0.26, 0, 0, 90],
                ["prop_haybale_01", 5, 0.27, -2, -0.26, 0, 0, 0],
                ["prop_haybale_01", 5, -0.2, -2, -0.26, 0, 0, 0],
            ],
            [
                ["prop_haybale_01", 5, 0.01, -2.88, -0.26, 0, 0, 90],
                ["prop_haybale_01", 5, 0.27, -2, -0.26, 0, 0, 0],
                ["prop_haybale_01", 5, -0.2, -2, -0.26, 0, 0, 0],
                ["prop_haybale_01", 5, 0.01, -3.4, -0.26, 0, 0, 90],
            ],
            [
                ["prop_haybale_01", 5, 0.01, -2.88, -0.26, 0, 0, 90],
                ["prop_haybale_01", 5, 0.27, -2, -0.26, 0, 0, 0],
                ["prop_haybale_01", 5, -0.2, -2, -0.26, 0, 0, 0],
                ["prop_haybale_01", 5, 0.01, -3.4, -0.26, 0, 0, 90],
                ["prop_haybale_01", 5, 0.6, -2.6, 0.2, 0, 30, 0],
            ],
            [
                ["prop_haybale_01", 5, 0.01, -2.88, -0.26, 0, 0, 90],
                ["prop_haybale_01", 5, 0.27, -2, -0.26, 0, 0, 0],
                ["prop_haybale_01", 5, -0.2, -2, -0.26, 0, 0, 0],
                ["prop_haybale_01", 5, 0.01, -3.4, -0.26, 0, 0, 90],
                ["prop_haybale_01", 5, 0.6, -2.6, 0.2, 0, 30, 0],
                ["prop_haybale_01", 5, -0.53, -2.6, 0.2, 0, 150, 0],
                ["prop_haybale_01", 5, 0.01, -2.6, 0.3, 0, 0, 0],
                ["prop_haybale_01", 5, 0.03, -3.5, 0.3, 0, 0, 90],
            ],
        ],
        0xB802DD46: [
            [
                ["prop_haybale_01", 3, 0.13, -1.60, 0.1, 0, 0, 0],
            ],
            [
                ["prop_haybale_01", 3, 0.13, -1.60, 0.1, 0, 0, 0],
                ["prop_haybale_01", 3, 0.67, -1.60, 0.1, 0, 0, 0],
            ],
            [
                ["prop_haybale_01", 3, 0.13, -1.60, 0.1, 0, 0, 0],
                ["prop_haybale_01", 3, 0.67, -1.60, 0.1, 0, 0, 0],
                ["prop_haybale_01", 3, 0.4, -2.41, 0.1, 0, 0, 90],
            ],
            [
                ["prop_haybale_01", 3, 0.13, -1.60, 0.1, 0, 0, 0],
                ["prop_haybale_01", 3, 0.67, -1.60, 0.1, 0, 0, 0],
                ["prop_haybale_01", 3, 0.4, -2.41, 0.1, 0, 0, 90],
                ["prop_haybale_01", 3, 0.40, -1.3, 0.63, 0, 0, 90],
            ],
            [
                ["prop_haybale_01", 3, 0.13, -1.60, 0.1, 0, 0, 0],
                ["prop_haybale_01", 3, 0.67, -1.60, 0.1, 0, 0, 0],
                ["prop_haybale_01", 3, 0.4, -2.41, 0.1, 0, 0, 90],
                ["prop_haybale_01", 3, 0.40, -1.3, 0.63, 0, 0, 90],
                ["prop_haybale_01", 3, 0.75, -2.1, 0.63, 0, 0, 0],
                ["prop_haybale_01", 3, 0.1, -2.1, 0.63, 0, 0, 0],
            ],
            [
                ["prop_haybale_01", 3, 0.13, -1.60, 0.1, 0, 0, 0],
                ["prop_haybale_01", 3, 0.67, -1.60, 0.1, 0, 0, 0],
                ["prop_haybale_01", 3, 0.4, -2.41, 0.1, 0, 0, 90],
                ["prop_haybale_01", 3, 0.40, -1.3, 0.63, 0, 0, 90],
                ["prop_haybale_01", 3, 0.75, -2.1, 0.63, 0, 0, 0],
                ["prop_haybale_01", 3, 0.1, -2.1, 0.63, 0, 0, 0],
                ["prop_haybale_01", 3, 0.4, -2.1, 1.1, 0, 0, 0],
                ["prop_haybale_01", 3, 0.4, -1.2, 1.1, 0, 0, 90],
            ],
        ],
    },

    takeCropHandler() {
        if (mp.busy.includes()) return;
        if (this.jobType == null) return;
        if (this.isCropping()) return;
        if (mp.players.local.vehicle) return;
        // TODO: проверка на состояние присмерти
        var object = mp.utils.getNearObject(mp.players.local.position, 3);
        if (object) mp.events.callRemote("farms.field.crop.take", object.remoteId);
    },
    setJobType(val) {
        this.jobType = val;
    },
    setFarmInfo(data) {
        var items = [{
                text: "Ферма",
                values: [`ID ${data.id}`],
            },
            {
                text: "Хозяин",
                values: [data.owner || "-"],
            },
            {
                text: "Баланс",
                values: [`$${data.balance}`],
            },
            {
                text: "Налог. баланс",
                values: [`$${data.taxBalance}`],
            },
            {
                text: "Зарплата",
                values: [`$${data.pay}`],
            },
            {
                text: "Премия фермера",
                values: [`$${data.farmerPay}`],
            },
            {
                text: "Премия тракториста",
                values: [`$${data.tractorPay}`],
            },
            {
                text: "Премия пилота",
                values: [`$${data.pilotPay}`],
            },
            {
                text: "Количество полей",
                values: [`${data.fields} ед.`],
            },
            {
                text: "Вернуться"
            },
        ];
        mp.callCEFV(`selectMenu.setItems('farmInfo',${JSON.stringify(items)})`);
        if (data.owner) {
            mp.callCEFV(`selectMenu.deleteItem('farm', 'Купить')`);
            if (mp.players.local.name == data.owner) {
                var item = {
                    text: "Управление",
                };
                var cropsPrice = [data.productAPrice, data.productBPrice, data.productCPrice];
                var pays = [data.pay, data.farmerPay, data.tractorPay, data.pilotPay];
                mp.callCEFV(`selectMenu.addItem('farm',${JSON.stringify(item)}, 2)`);
                mp.callCEFV(`selectMenu.menus['farmControlGrains'].items[0].values[0] = "${data.grainPrice}"`);
                mp.callCEFV(`selectMenu.menus['farmControlSoils'].items[0].values[0] = "${data.soilPrice}"`);
                mp.callCEFV(`selectMenu.menus['farmControlCrops'].items[1].values[0] = "${data.productAPrice}"`);
                mp.callCEFV(`selectMenu.menus['farmControlPays'].items[1].values[0] = "${data.pay}"`);
                mp.callCEFV(`selectMenu.menus['farmControlSell'].items[0].values[0] = "$${data.statePrice}"`);
                mp.callCEFV(`selectMenu.setProp('farmControlCrops', 'cropsPrice', ${JSON.stringify(cropsPrice)})`);
                mp.callCEFV(`selectMenu.setProp('farmControlPays', 'pays', ${JSON.stringify(pays)})`);
            }
        } else {
            mp.callCEFV(`selectMenu.deleteItem('farm', 'Управление')`);
            var item = {
                text: "Купить",
                values: [`$${data.price}`],
            };
            mp.callCEFV(`selectMenu.addItem('farm',${JSON.stringify(item)}, 0)`);
        }
    },
    setWarehouseInfo(data) {
        var items = [{
                text: "Зерно",
                values: [`${data.grains} из ${data.grainsMax} ед. ($${data.grainPrice})`],
            },
            {
                text: "Урожай А",
                values: [`${data.productA} из ${data.productsMax} ед. ($${data.productAPrice})`],
            },
            {
                text: "Урожай Б",
                values: [`${data.productB} из ${data.productsMax} ед. ($${data.productBPrice})`],
            },
            {
                text: "Урожай С",
                values: [`${data.productC} из ${data.productsMax} ед. ($${data.productCPrice})`],
            },
            {
                text: "Вернуться"
            },
        ];
        mp.callCEFV(`selectMenu.setItems('farmWarehouseInfo', ${JSON.stringify(items)})`);
        mp.callCEFV(`selectMenu.menus['farmGrainsTake'].init(${JSON.stringify(data.fieldIds)})`);
    },
    setSoilsWarehouseInfo(data) {
        var items = [{
                text: "Удобрение",
                values: [`${data.soils} из ${data.soilsMax} ед. ($${data.soilPrice})`],
            },
            {
                text: "Вернуться"
            },
        ];
        mp.callCEFV(`selectMenu.setItems('farmSoilsWarehouseInfo', ${JSON.stringify(items)})`);
    },
    registerAttachments() {
        // лопатка в руках при сборе урожка
        mp.attachmentMngr.register("farmTrowel", "prop_cs_trowel", 58867, new mp.Vector3(0.01, 0.03, 0),
            new mp.Vector3(-119, 10, 90), {
                dict: "amb@world_human_gardener_plant@female@base",
                name: "base_female",
                speed: 8,
                flag: 1
            }
        );
        // урожай А в руках
        mp.attachmentMngr.register("farmProductA", "prop_veg_crop_03_pump", 11363, new mp.Vector3(0.08, -0.15, -0.25),
            new mp.Vector3(-100, 0, 0), {
                dict: "anim@heists@box_carry@",
                name: "idle",
                speed: 8,
                flag: 49
            },
            true
        );
        // урожай B в руках
        mp.attachmentMngr.register("farmProductB", "prop_veg_crop_03_cab", 11363, new mp.Vector3(0, -0.05, -0.28),
            new mp.Vector3(80, 85, 90), {
                dict: "anim@heists@box_carry@",
                name: "idle",
                speed: 8,
                flag: 49
            },
            true
        );
        // урожай C в руках
        mp.attachmentMngr.register("farmProductC", "prop_weed_02", 11363, new mp.Vector3(0, 0, 0.15),
            new mp.Vector3(175, 7, 0), {
                dict: "anim@heists@box_carry@",
                name: "idle",
                speed: 8,
                flag: 49
            },
            true
        );
    },
    isCropping(player) {
        if (!player) player = mp.players.local;
        return player.hasAttachment("farmTrowel");
    },
    hasProduct(player) {
        if (!player) player = mp.players.local;
        var names = ["farmProductA", "farmProductB", "farmProductC"];
        for (var i = 0; i < names.length; i++) {
            if (player.hasAttachment(names[i])) return true;
        }
        return false;
    },
    attachProductsObjects(vehicle) {
        if (!this.vehAttachInfo[vehicle.model]) return;
        this.clearProductsObjects(vehicle);
        var state = Math.clamp(vehicle.getVariable("farmProductsState"), 0, 6);
        if (!state) return;
        var info = this.vehAttachInfo[vehicle.model][state - 1];

        for (var i = 0; i < info.length; i++) {
            var o = info[i];
            var obj = mp.objects.new(mp.game.joaat(o[0]), vehicle.position, {
                rotation: new mp.Vector3(0, 0, 30),
                dimension: -1
            });
            obj.attachTo(vehicle.handle, o[1], o[2], o[3], o[4], o[5], o[6], o[7],
                false, false, false, false, 2, true);

            vehicle.objects.push(obj);
        }
    },
    clearProductsObjects(vehicle) {
        if (!vehicle.objects) vehicle.objects = [];
        for (var i = 0; i < vehicle.objects.length; i++) {
            var obj = vehicle.objects[i];
            if (mp.objects.exists(obj)) obj.destroy();
        }
        vehicle.objects = [];
    },
};

mp.events.add({
    "attaches.added": (entity, id) => {
        if (entity.type != "player") return;
        if (entity.remoteId != mp.players.local.remoteId) return;
        if (id != mp.game.joaat("farmTrowel")) return;
        mp.busy.add("jobProgress", false);
    },
    "attaches.removed": (entity, id) => {
        if (entity.type != "player") return;
        if (entity.remoteId != mp.players.local.remoteId) return;
        if (id != mp.game.joaat("farmTrowel")) return;
        mp.busy.remove("jobProgress");
    },
    "characterInit.done": () => {
        mp.keys.bind(69, true, () => { // E
            if (mp.game.ui.isPauseMenuActive()) return;
            mp.farms.takeCropHandler();
        });
    },
    "farms.jobType.set": (val) => {
        mp.farms.setJobType(val);
    },
    "farms.info.set": (data) => {
        mp.farms.setFarmInfo(data);
    },
    "farms.warehouse.info.set": (data) => {
        mp.farms.setWarehouseInfo(data);
    },
    "farms.soilsWarehouse.info.set": (data) => {
        mp.farms.setSoilsWarehouseInfo(data);
    },
    "playerEnterVehicleBoot": (player, vehicle) => {
        if (!mp.farms.hasProduct()) return;
        if (!vehicle.getVariable("trunk")) return mp.notify.warning(`Для погрузки урожая откройте багажник`);
        mp.events.callRemote(`farms.vehicle.products.put`, vehicle.remoteId);
    },
    "entityStreamIn": (vehicle) => {
        if (vehicle.type != "vehicle") return;
        mp.farms.attachProductsObjects(vehicle);
    },
    "entityStreamOut": (vehicle) => {
        if (vehicle.type != "vehicle") return;
        mp.farms.clearProductsObjects(vehicle);
    },
});

mp.events.addDataHandler("farmProductsState", (vehicle) => {
    if (vehicle.type != "vehicle") return;
    mp.farms.attachProductsObjects(vehicle);
});

mp.events.addDataHandler("trunk", (vehicle, value) => {
    if (!value) return;
    if (mp.moduleVehicles.nearBootVehicleId == null) return;
    if (mp.moduleVehicles.nearBootVehicleId != vehicle.remoteId) return;
    if (!mp.farms.hasProduct()) return;

    mp.events.callRemote(`farms.vehicle.products.put`, vehicle.remoteId);
});

mp.farms.registerAttachments();
