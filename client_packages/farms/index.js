"use strict";


/*
    Модуль ферм.

    created 07.09.19 by Carter Slade
*/

mp.farms = {
    jobType: null,

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
    }
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
        mp.events.callRemote(`farms.vehicle.products.put`, vehicle.remoteId);
    },
    "playerEnterVehicleBoot": (player, vehicle) => {
        if (!mp.farms.hasProduct()) return;
        // if (!vehicle.getVariable("trunk")) return;
        mp.events.callRemote(`farms.vehicle.products.put`, vehicle.remoteId);
    },
});
