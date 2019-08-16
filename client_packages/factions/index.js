"use strict";


/*
    Модуль организаций.

    created 16.08.19 by Carter Slade
*/

mp.factions = {
    enableTakeBox: false,
    typeBox: "",

    insideWarehouse(inside, type = null) {
        if (inside) mp.prompt.showByName("take_ammobox");
        else mp.prompt.hide();
        this.enableTakeBox = inside;
        this.typeBox = type;
    },
    takeBox() {
        if (this.enableTakeBox) {
            // TODO: проверка на аттач
            mp.events.callRemote("factions.warehouse.takeBox", this.typeBox);
        }
    }
};

mp.events.add("characterInit.done", () => {
    mp.keys.bind(69, true, mp.factions.takeBox); // E
    // коробка с боеприпасами в руках
    mp.attachmentMngr.register("ammoBox", "prop_box_ammo04a", 58867, new mp.Vector3(0.2, -0.3, 0.1),
        new mp.Vector3(-45, 20, 120), {
            dict: "anim@heists@box_carry@",
            name: "idle",
            speed: 8,
            flag: 49
        }
    );
    // коробка с медикаментами в руках
    mp.attachmentMngr.register("medicinesBox", "ex_office_swag_pills4", 58867, new mp.Vector3(0.2, -0.3, 0.1),
        new mp.Vector3(-45, 20, 120), {
            dict: "anim@heists@box_carry@",
            name: "idle",
            speed: 8,
            flag: 49
        }
    );
});

mp.events.add("factions.insideWarehouse", mp.factions.insideWarehouse);
