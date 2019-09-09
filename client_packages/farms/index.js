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
        if (this.hasProduct()) return;
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
                values: [data.owner],
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
        mp.callCEFV(`selectMenu.setItems('farmInfo', '${JSON.stringify(items)}')`);
    },
    setWarehouseInfo(data) {
        var items = [{
                text: "Зерно",
                values: [`${data.grains} из ${data.grainsMax} ед.`],
            },
            {
                text: "Урожай А",
                values: [`${data.productA} из ${data.productsMax} ед.`],
            },
            {
                text: "Урожай Б",
                values: [`${data.productB} из ${data.productsMax} ед.`],
            },
            {
                text: "Урожай С",
                values: [`${data.productC} из ${data.productsMax} ед.`],
            },
            {
                text: "Вернуться"
            },
        ];
        mp.callCEFV(`selectMenu.setItems('farmWarehouseInfo', '${JSON.stringify(items)}')`);
    },
    setSoilsWarehouseInfo(data) {
        var items = [{
                text: "Удобрение",
                values: [`${data.soils} из ${data.soilsMax} ед.`],
            },
            {
                text: "Вернуться"
            },
        ];
        mp.callCEFV(`selectMenu.setItems('farmSoilsWarehouseInfo', '${JSON.stringify(items)}')`);
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
        mp.attachmentMngr.register("farmProductA", "prop_veg_crop_03_pump", 58867, new mp.Vector3(0.2, -0.3, 0.1),
            new mp.Vector3(-45, 20, 120), {
                dict: "anim@heists@box_carry@",
                name: "idle",
                speed: 8,
                flag: 49
            }
        );
        // урожай B в руках
        mp.attachmentMngr.register("farmProductB", "prop_veg_crop_03_cab", 58867, new mp.Vector3(0.2, -0.3, 0.1),
            new mp.Vector3(-45, 20, 120), {
                dict: "anim@heists@box_carry@",
                name: "idle",
                speed: 8,
                flag: 49
            }
        );
        // урожай C в руках
        mp.attachmentMngr.register("farmProductC", "prop_weed_02", 58867, new mp.Vector3(0.2, -0.3, 0.1),
            new mp.Vector3(-45, 20, 120), {
                dict: "anim@heists@box_carry@",
                name: "idle",
                speed: 8,
                flag: 49
            }
        );
    },
    isCropping() {
        return mp.players.local.hasAttachment("farmTrowel");
    },
    hasProduct() {
        var player = mp.players.local;
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
    "characterInit.done": () => {
        mp.keys.bind(69, true, () => { // E
            mp.farms.takeCropHandler();
        });
        mp.farms.registerAttachments();
    },
    "farms.jobType.set": (val) => {
        mp.farms.setJobType(val);
    },
    "farms.isCropping.end": () => {
        if (nearBootVehicleId == null) return;
        var vehicle = mp.vehicles.atRemoteId(nearBootVehicleId);
        if (!vehicle) return;
        if (!vehicle.getVariable("trunk")) return mp.notify.warning(`Для погрузки урожая откройте багажник`);
        mp.events.callRemote(`farms.vehicle.products.put`, vehicle.remoteId);
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
    if (nearBootVehicleId == null) return;
    if (nearBootVehicleId != vehicle.remoteId) return;
    if (!mp.farms.hasProduct()) return;

    mp.events.callRemote(`farms.vehicle.products.put`, vehicle.remoteId);
});