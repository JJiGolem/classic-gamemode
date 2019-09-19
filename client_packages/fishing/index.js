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
let isBinding = false;

let isEnter = false;
let isStarted = false;
let isFetch = false;

mp.events.add("render", () => {
    if (isEnter) mp.game.controls.disableAllControlActions(0);
});

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
    bindButtons(true);
});

mp.events.add('fishing.fish.sell', () => {
    mp.callCEFV(`selectMenu.loader = true`);
    mp.events.callRemote('fishing.fish.sell');
});

mp.events.add('fishing.fish.sell.ans', (ans) => {
    mp.callCEFV(`selectMenu.loader = false`);
    if (ans == 1) {
        mp.events.call('fishing.menu.close');
    }
});

mp.events.add('fishing.game.enter', (cam) => {
    if (mp.busy.includes()) return;

    mp.busy.add('fishingGame');
    playBaseAnimation(true);
    mp.gui.cursor.show(true, false);
    mp.callCEFVN({ "fishing.show": true });
    isEnter = true;
});

mp.events.add('fishing.game.start', () => {
    playWaitAnimation(true);
    mp.callCEFVN({ "fishing.isStarted": true });
    mp.events.callRemote('fishing.game.start');
});

mp.events.add('fishing.game.fetch', (speed, zone, weight) => {
    playFetchAnimation(true);
    isFetch = true;
    mp.callCEFV(`fishing.fishFetch(${speed},${zone},${weight});`);
});

mp.events.add('fishing.game.end', (result) => {
    playBaseAnimation(true);
    mp.events.callRemote('fishing.game.end', result);
    setTimeout(() => {
        mp.callCEFV(`fishing.clearData();`);
        mp.callCEFVN({ "fishing.isStarted": false });
    }, 1500);
});

mp.events.add('fishing.game.exit', () => {
    mp.events.callRemote('fishing.game.exit');
    setTimeout(() => {
        bindButtons(false);
        isEnter = false;
    }, 100);
    mp.events.call('prompt.hide');
    playBaseAnimation(false);
    mp.gui.cursor.show(false, false);
    mp.callCEFV(`fishing.clearData()`);
    mp.callCEFVN({ "fishing.show": false });
    mp.busy.remove('fishingGame');
});

let bindButtons = (state) => {
    if (state) {
        if (isBinding) return;
        isBinding = true;
        mp.keys.bind(0x45, true, fishingEnter);
        mp.keys.bind(0x20, true, fishingStart);
        mp.keys.bind(0x46, true, fishingEnd);
        mp.keys.bind(0x1B, true, fishingExit);
    }
    else {
        if (!isBinding) return;
        isBinding = false;
        mp.keys.unbind(0x45, true, fishingEnter);
        mp.keys.unbind(0x20, true, fishingStart);
        mp.keys.unbind(0x46, true, fishingEnd);
        mp.keys.unbind(0x1B, true, fishingExit);
    }
}

let fishingEnter = () => {
    if (!isEnter) {
        mp.events.callRemote('fishing.game.enter');
        mp.events.call('prompt.hide');
    }
}

let fishingStart = () => {
    if (isEnter && !isStarted) {
        playWaitAnimation(true);
        mp.callCEFVN({ "fishing.isStarted": true });
        mp.events.callRemote('fishing.game.start');
        isStarted = true;
    }
}

let fishingEnd = () => {
    if (isEnter && isStarted && isFetch) {
        mp.callCEFV(`fishing.endFishing();`);
        isFetch = false;
        setTimeout(() => {
            isStarted = false;
        }, 1500);
    }
}

let fishingExit = () => {
    if (!isFetch) {
        mp.events.call('fishing.game.exit');
        isEnter = false;
        isStarted = false;
    }
}

function playBaseAnimation(state, timeout) { /// Анимация держания удочки
    if (state) {
        if (!timeout) timeout = 0;
        setTimeout(()=> {
            mp.events.callRemote('animations.play', 'amb@world_human_stand_fishing@base', 'base', 1, 49);
            mp.attachmentMngr.addLocal("takeRod");
        }, timeout);
    } else {
        mp.attachmentMngr.removeLocal("takeRod");
        mp.events.callRemote('animations.stop');
    }
}

function playWaitAnimation(state, timeout) { /// Анимация начала рыбалки
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

function playFetchAnimation(state, timeout) { /// Анимация вытягивания
    if (state) {
        if (!timeout) timeout = 0;
        setTimeout(()=> {
            mp.events.callRemote('animations.play', 'amb@world_human_stand_fishing@idle_a', 'idle_c', 1, 49);
            mp.attachmentMngr.addLocal("takeRod");
        }, timeout);
    } else {
        mp.attachmentMngr.removeLocal("takeRod");
        mp.events.callRemote('animations.stop');
    }
}

