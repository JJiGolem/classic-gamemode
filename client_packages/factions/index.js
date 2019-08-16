"use strict";


/*
    Модуль организаций.

    created 16.08.19 by Carter Slade
*/

mp.factions = {

};

mp.events.add("characterInit.done", () => {
    // боеприпасы в руках
    mp.attachmentMngr.register("ammoBox", "prop_box_ammo04a", 58867, new mp.Vector3(0.2, -0.3, 0.1),
        new mp.Vector3(-45, 20, 120), {
            dict: "anim@heists@box_carry@",
            name: "idle",
            speed: 8,
            flag: 49
        }
    );
});
