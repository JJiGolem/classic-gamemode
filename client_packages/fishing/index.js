"use strict"

mp.attachmentMngr.register("takeRod", "prop_fishing_rod_01", 58867, new mp.Vector3(0.06, 0, 0.05), new mp.Vector3(90, -30, 0)); /// Телефон в руке
// mp.attachmentMngr.register("callPhone", "prop_npc_phone", 58867, new mp.Vector3(0.01, 0.05, -0.02), new mp.Vector3(-5, -65, 165)); /// Телефон у уха

let peds = [
    {
        model: "cs_old_man2",
        position: {
            x: -1849.6412744140625,
            y: -1241.2181591796875,
            z: 8.615778923034668,
        },
        heading: 140.2574462890625,
        defaultScenario: 'WORLD_HUMAN_AA_SMOKE'
    }
];

mp.events.add('characterInit.done', () => {
    peds.forEach((current) => {
        mp.events.call('NPC.create', current);
    })
});

mp.events.add('fishing.menu.show', () => {
   if (mp.busy.includes()) return;

   mp.busy.add('fishingMenu');
   mp.callCEFV(`selectMenu.menu = cloneObj(selectMenu.menus["fishingMenu"])`);
   mp.callCEFV(`selectMenu.show = true`);
});

mp.events.add('fishing.menu.close', () => {
    mp.busy.remove('fishingMenu');
    mp.callCEFV(`selectMenu.show = false`);
});

mp.events.add('fishing.rod.buy', () => {
    mp.callCEFV(`selectMenu.loader = true`);
    mp.events.callRemote('fishing.rod.buy');
});

mp.events.add('fishing.rod.buy.ans', (ans) => {
    mp.callCEFV(`selectMenu.loader = false`);

    if (ans == 1) {
        mp.events.call('fishing.menu.close');
    }
});

mp.events.add('fishing.start', () => {
    playHoldAnimation(true);
})

function playHoldAnimation(state, timeout) { /// Анимация держания удочки
    if (state) {
        if (!timeout) timeout = 0;
        setTimeout(()=> {
            mp.events.callRemote('animations.play', 'amb@world_human_stand_fishing@base', 'base', 1, 49);
            mp.attachmentMngr.addLocal("takeRod");
        }, timeout);
    } else {
        mp.attachmentMngr.removeLocal("takeRod");
    }
}

