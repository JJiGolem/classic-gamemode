"use strict"

mp.attachmentMngr.register("takeRod", "prop_fishing_rod_01", 26611, new mp.Vector3(0, -0.05, -0.03), new mp.Vector3(-40, 10, -50)); /// Телефон в руке

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

let camera;

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

mp.events.add('fishing.game.menu', () => {
    mp.events.call('prompt.show', 'Нажмите <span>E</span>, чтобы начать рыбачить', 'Информация');
    mp.keys.bind(0x45, true, () => {
        mp.events.callRemote('fishing.start');
    })
});

mp.events.add('fishing.start', (cam) => {
    if (mp.busy.includes()) return;

    mp.busy.add('fishingGame');
    playBaseAnimation(true);
    mp.gui.cursor.show(true, true);
    mp.game.cam.setCinematicModeActive(true);
    camera = mp.cameras.new('fishingCamera', new mp.Vector3(cam.x, cam.y, cam.z), new mp.Vector3(cam.x, cam.y, cam.z), 60);
    camera.pointAtCoord(100, 100, 100);
    camera.setActive(true);
    mp.game.cam.renderScriptCams(true, false, 0, true, false);
});

mp.events.add('fishing.end', () => {
    if (!mp.busy.includes('fishingGame')) return;

    mp.busy.remove('fishingGame');
    playBaseAnimation(false);
    mp.gui.cursor.show(false, false);
    mp.game.cam.setCinematicModeActive(true);
});

function playBaseAnimation(state, timeout) { /// Анимация держания удочки
    if (state) {
        if (!timeout) timeout = 0;
        setTimeout(()=> {
            mp.events.callRemote('animations.play', 'amb@world_human_stand_fishing@idle_a', 'idle_a', 1, 49);
            mp.attachmentMngr.addLocal("takeRod");
        }, timeout);
    } else {
        mp.attachmentMngr.removeLocal("takeRod");
        mp.events.callRemote('animations.stop');
    }
}

